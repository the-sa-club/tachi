import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import SlbABI from '../abi/slp_abi.json'
import { RONIN_PROVIDER, SLP_CONTRACT } from './constants'
import { HttpClient } from './httpClient'
import { TransactionUtils } from './transactionUtils'

interface SignatureHTTP {
  signature: string
  amount: number
  timestamp: number
}

export class ClaimManager {
  constructor(
    private web3: Web3,
    private httpClient: HttpClient,
    private transactionUtils: TransactionUtils,
  ) {}

  private async getRandomMsg() {
    let payload = {
      operationName: 'CreateRandomMessage',
      variables: {},
      query: 'mutation CreateRandomMessage{createRandomMessage}',
    }
    const url = 'https://graphql-gateway.axieinfinity.com/graphql'

    try {
      const res = await this.httpClient.post<any>(url, payload)
      if (res.status >= 200 && res.status <= 299) {
        return res.data.data.createRandomMessage
      }
    } catch (error) {
      console.error(error)
      throw '601, Some error happened while checking for SLP. Please try again later.'
    }
  }

  private async checkUnclaimedSlp(address: string) {
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1944.0 Safari/537.36'

    const ethAddress = address.replace('ronin:', '0x')
    const url = `https://game-api.skymavis.com/game-api/clients/${ethAddress}/items/1`

    try {
      const res = await this.httpClient.get<any>(url, {
        headers: {
          'User-Agent': userAgent,
        },
      })
      if (res.status >= 200 && res.status <= 299) {
        return res.data.total
      }
    } catch (error) {
      console.error(error)
      throw '605, Some error happened while checking for SLP. Please try again later.'
    }
  }

  private async getJWT(address: string, pk: string) {
    const msg = await this.getRandomMsg()
    const signed = this.web3.eth.accounts.sign(msg, pk)
    const hexMsg = signed.signature
    const payload = {
      operationName: 'CreateAccessTokenWithSignature',
      variables: {
        input: {
          mainnet: 'ronin',
          owner: `${address}`,
          message: `${msg}`,
          signature: `${hexMsg}`,
        },
      },
      query:
        'mutation CreateAccessTokenWithSignature($input: SignatureInput!)' +
        '{createAccessTokenWithSignature(input: $input) ' +
        '{newAccount result accessToken __typename}}',
    }
    const url = 'https://graphql-gateway.axieinfinity.com/graphql'
    try {
      const res = await this.httpClient.post<any>(url, payload)
      if (res.status >= 200 && res.status <= 299) {
        if (
          res.data.data.createAccessTokenWithSignature &&
          res.data.data.createAccessTokenWithSignature.accessToken
        ) {
          return res.data.data.createAccessTokenWithSignature.accessToken
        } else {
          return ''
        }
      }
    } catch (error) {
      console.error(error)
      throw '602, Some error happened while checking for SLP. Please try again later.'
    }
  }

  public async claimSlp(details: { address: string; pk: string }) {
    const unclaimedSlp: number = await this.checkUnclaimedSlp(details.address)
    if (unclaimedSlp == 0) {
      throw "Sorry, you can't claim any SLP for now."
    }

    // ! Getting Claim Signature ------------------------------------------------------
    const ethAddress = details.address.replace('ronin:', '0x')
    const userAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1944.0 Safari/537.36'

    const url = `https://game-api.skymavis.com/game-api/clients/${ethAddress}/items/1/claim`
    let signature: SignatureHTTP
    try {
      const res = await this.httpClient.post<any>(url, null, {
        headers: {
          'User-Agent': userAgent,
          authorization: `Bearer ${await this.getJWT(ethAddress, details.pk)}`,
        },
      })
      if (res.status >= 200 && res.status <= 299) {
        signature = res.data?.blockchain_related?.signature
      }
    } catch (error) {
      console.error(error)
      throw '600, Some error happened while claiming for SLP. Please try again later.'
    }

    if (!signature) {
      throw '603, Some error happened while claiming for SLP. Please try again later.'
    }

    console.log('signature', signature)

    // !------------------------------------------------------------------------------------
    // ! Sending Claim Transaction ---------------------------------------------------------
    this.web3.setProvider(new Web3.providers.HttpProvider(RONIN_PROVIDER))

    const slpContract = new this.web3.eth.Contract(
      SlbABI as AbiItem[],
      Web3.utils.toChecksumAddress(SLP_CONTRACT),
    )

    const signedTx = await this.web3.eth.accounts.signTransaction(
      {
        to: Web3.utils.toChecksumAddress(SLP_CONTRACT),
        nonce: await this.transactionUtils.getNonce(ethAddress),
        chainId: 2020,
        gas: 500000,
        gasPrice: Web3.utils.toWei('0', 'gwei'),
        data: slpContract.methods
          .checkpoint(
            Web3.utils.toChecksumAddress(ethAddress),
            signature.amount,
            signature.timestamp,
            signature.signature,
          )
          .encodeABI(),
      },
      details.pk,
    )

    const receipt = await this.web3.eth.sendSignedTransaction(
      signedTx.rawTransaction,
    )
    // !------------------------------------------------------------------------
    if (receipt.status) {
      return { txHash: receipt.transactionHash, slp: unclaimedSlp }
    } else {
      return ''
    }
  }
}
