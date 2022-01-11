import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import SlbABI from '../abi/slp_abi.json'
import { IAccountDetail } from '../models/IAccountDetail'
import { IPayoutDetails } from '../models/IPayoutDetails'
import { ClaimManager } from './claimManager'
import { RONIN_PROVIDER, RONIN_PROVIDER_FREE, SLP_CONTRACT } from './constants'
import { TransactionUtils } from './transactionUtils'

export interface IToSign {
  from: string
  to: string
  pk: string
  amount: number
}

export class PayoutManager {
  constructor(
    private web3: Web3,
    private transactionUtils: TransactionUtils,
    private claimManger: ClaimManager,
  ) {}

  public async startTransaction(payoutDetails: IPayoutDetails) {
    // ! INIT --------------------------------------------------------------------
    this.web3.setProvider(new Web3.providers.HttpProvider(RONIN_PROVIDER_FREE))
    let prepareToSign: IToSign[] = []
    //! prepare transactions data ------------------------------------------------
    prepareToSign.push(
      {
        from: payoutDetails.from,
        to: payoutDetails.to,
        pk: payoutDetails.pk,
        amount: payoutDetails.amount,
      },
      {
        from: payoutDetails.from,
        to: payoutDetails.to2,
        pk: payoutDetails.pk,
        amount: payoutDetails.amount2,
      },
    )
    // ! sign + sending Transactions --------------------------------------------------------
    let receipts = []

    for (let tx of prepareToSign) {

      // ! signing
      const signedTx = await this.signTransaction(tx)

      // ! sending
      try {
        const receipt = await this.web3.eth.sendSignedTransaction(
          signedTx.rawTransaction,
        )
        if (receipt) {
          receipts.push(receipt.transactionHash)
        }
      } catch (er) {
        console.error(er)
        throw 'Error while sending the transaction. Please check the logs and report.'
      }
    }

    console.log('Tx Receipts: ', receipts)
    // !----------------------------------------------------------------------------------------
    return receipts
  }

  private async signTransaction(transactionsDetails: IToSign) {
    this.web3.setProvider(new Web3.providers.HttpProvider(RONIN_PROVIDER))

    const slpContract = new this.web3.eth.Contract(
      SlbABI as AbiItem[],
      Web3.utils.toChecksumAddress(SLP_CONTRACT),
    )

    const signedTx = await this.web3.eth.accounts.signTransaction(
      {
        to: Web3.utils.toChecksumAddress(SLP_CONTRACT),
        chainId: 2020,
        gas: 500000,
        gasPrice: Web3.utils.toWei('0', 'gwei'),
        nonce: await this.transactionUtils.getNonce(transactionsDetails.from),
        data: slpContract.methods
          .transfer(
            this.transactionUtils.formatAddress(transactionsDetails.to),
            transactionsDetails.amount,
          )
          .encodeABI(),
      },
      transactionsDetails.pk,
    )

    return signedTx
  }

  private async signTransactions(transactionsDetails: IToSign[]) {
    this.web3.setProvider(new Web3.providers.HttpProvider(RONIN_PROVIDER))

    const slpContract = new this.web3.eth.Contract(
      SlbABI as AbiItem[],
      Web3.utils.toChecksumAddress(SLP_CONTRACT),
    )

    const signedTxs = []
    for (let i = 0; i < transactionsDetails.length; i++) {
      const signedTx = await this.web3.eth.accounts.signTransaction(
        {
          to: Web3.utils.toChecksumAddress(SLP_CONTRACT),
          chainId: 2020,
          gas: 500000,
          gasPrice: Web3.utils.toWei('0', 'gwei'),
          nonce: await this.transactionUtils.getNonce(
            transactionsDetails[i].from,
          ),
          data: slpContract.methods
            .transfer(
              this.transactionUtils.formatAddress(transactionsDetails[i].to),
              transactionsDetails[i].amount,
            )
            .encodeABI(),
        },
        transactionsDetails[i].pk,
      )
      signedTxs.push(signedTx)
    }

    return signedTxs
  }

  private async checkTxReceipt(txRaw: string) {
    const txHash = this.web3.utils.toHex(this.web3.utils.keccak256(txRaw))

    while (true) {
      const receipt = await this.web3.eth.getTransactionReceipt(txHash)
      if (receipt.status) {
        break
      }

      await new Promise((res, rej) => {
        setTimeout(() => {
          res(1)
        }, 2000)
      })
    }
  }

  private async getBalanceOf(address: string) {
    this.web3.setProvider(new Web3.providers.HttpProvider(RONIN_PROVIDER))

    const slpContract = new this.web3.eth.Contract(
      SlbABI as AbiItem[],
      this.web3.utils.toChecksumAddress(SLP_CONTRACT),
    )

    const balance = await slpContract.methods
      .balanceOf(this.transactionUtils.formatAddress(address))
      .call()
  }
}
