import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import { hdkey } from 'ethereumjs-wallet'
import Web3 from 'web3'
import { IAccountDetail } from '../models/IAccountDetail'
import { IPayoutDetails } from '../models/IPayoutDetails'
import { reduxStore } from '../reduxStore'
import { setClaimStatus, setClaimsDone } from '../reduxStore/features/claimsSlice'
import { setPayoutStatus, setPayoutDone } from '../reduxStore/features/payoutsSlice'
import authService, { AuthService } from '../services/authService'
import { ClaimManager } from './claimManager'
import httpClient from './httpClient'
import persistanceStorage, { PersistanceStorage } from './persistanceStorage'
import { PayoutManager } from './transactionManager'
import { TransactionUtils } from './transactionUtils'

class HdWallet {
  public seed: Buffer
  public hdRoot: hdkey
  public hdPath: string
  public web3 = new Web3()
  private payoutManager: PayoutManager
  private transactionUtils: TransactionUtils
  private claimManager: ClaimManager

  constructor(
    private pStorage: PersistanceStorage,
    private authService: AuthService,
  ) {
    this.transactionUtils = new TransactionUtils(this.web3, httpClient)
    this.claimManager = new ClaimManager(
      this.web3,
      httpClient,
      this.transactionUtils,
    )
    this.payoutManager = new PayoutManager(
      this.web3,
      this.transactionUtils,
      this.claimManager,
    )
  }

  public async init(mnemonic: string) {
    if (!mnemonic) {
      console.error('Mnemonic Phrase is empty')
      throw '606, Internal Error'
    }
    if (!authService.password) {
      console.error('No Password is set')
      throw '607, Internal Error'
    }

    this.seed = mnemonicToSeedSync(mnemonic)
    this.hdRoot = hdkey.fromMasterSeed(this.seed)
    this.hdPath = "m/44'/60'/0'/0/"

    await this.generateAddressesFromSeed()
  }

  public async generateAddressesFromSeed() {
    let accounts: IAccountDetail[] = []
    let count = 100

    for (let i = 0; i < count; i++) {
      let wallet = this.hdRoot.derivePath(this.hdPath + i).getWallet()
      let address = 'ronin:' + wallet.getAddress().toString('hex')
      let privateKey = wallet.getPrivateKey().toString('hex')
      let publicKey = wallet.getPublicKey().toString('hex')
      accounts.push({ address: address, privateKey: privateKey, publicKey })
    }

    await this.pStorage.setSecurely(
      JSON.stringify(accounts),
      '_d',
      this.authService.password,
    )

    return accounts
  }

  public getAccountAtIndex(indx: number) {
    const wallet = this.hdRoot.derivePath(this.hdPath + indx).getWallet()
    return wallet.getAddress()
  }

  public createAccountFromPrivateKey(privateKey: string) {
    return this.web3.eth.accounts.privateKeyToAccount(privateKey)
  }

  public getNewMnemonic() {
    return generateMnemonic()
  }

  public async reset() {
    await this.pStorage.resetAll()
  }

  public async getAccountsAddresses(): Promise<string[]> {
    if (this.authService.isAuthenticated()) {
      const rawAccounts = await this.pStorage.getSecurely(
        '_d',
        authService.password,
      )
      if (rawAccounts) {
        const accounts: IAccountDetail[] = JSON.parse(rawAccounts)
        return accounts.map((account) => account.address)
      } else {
        return []
      }
    } else {
      throw 'Auth, User is not authenticated.'
    }
  }

  public async payoutAccounts(payoutDetails: IPayoutDetails[]) {
    const allAccounts: IAccountDetail[] = JSON.parse(
      await this.pStorage.getSecurely('_d', authService.password),
    )

    // ! setting the PK
    payoutDetails.forEach((payoutDetail) => {
      const accountFound = allAccounts.find(
        (account) => account.address == payoutDetail.from,
      )
      if (!accountFound) {
        throw `Account with address ${payoutDetail.from} is not found. We can't start the payout process.`
      } else {
        payoutDetail.pk = accountFound.privateKey;
      }
    })

    console.log("Payout Details:", payoutDetails);
    
    
    for (const payout of payoutDetails) {
      reduxStore.dispatch(
        setPayoutStatus({
          address: payout.from,
          status: 'processing',
          to: '',
          amount: 0,
          receipt: '',
          to2: '',
          amount2: 0,
          receipt2: '',
        }),
      )

      // await new Promise((res) =>
      //   setTimeout(() => {
      //     res(1)
      //   }, 3000),
      // )

      // const success = Math.ceil(Math.random() * 10) > 5

      let payoutReceipt: string[] = []
      try {
        payoutReceipt = await this.payoutManager.startTransaction({
          from: payout.from,
          to: payout.to,
          amount: payout.amount,
          to2: payout.to2,
          amount2: payout.amount2,
          pk: payout.pk
        })
      } catch (err) {
        console.log(err)
      }
      // ! ignore tx if there is no claim
      // if (!claimDone) {
      //   continue;
      // }

      reduxStore.dispatch(
        setPayoutStatus({
          address: payout.from,
          status: payoutReceipt.length > 0 ? 'Done' : 'Failed',
          to:payout.to,
          amount: payout.amount,
          receipt: payoutReceipt[0] ,
          to2: payout.to2,
          amount2: payout.amount2,
          receipt2: payoutReceipt[1] ,
        }),
      )
    }

    reduxStore.dispatch(setPayoutDone(true))

    // return this.payoutManager.payoutAccounts(toBatchDetails);
  }

  public async claimAccounts(addresses: string[]) {
    let accounts: IAccountDetail[] = []
    const allAccounts: IAccountDetail[] = JSON.parse(
      await this.pStorage.getSecurely('_d', authService.password),
    )

    addresses.forEach((address) => {
      const accountFound = allAccounts.find(
        (account) => account.address == address
      );
      if (accountFound) {
        accounts.push({ ...accountFound });
      } else {
        throw `Account with address ${address} is not found. We can't start the claiming process.`;
      }
    });

    for (const account of accounts) {
      reduxStore.dispatch(
        setClaimStatus({
          address: account.address,
          status: 'processing',
          receipt: '',
          slp: 0
        }),
      )

      await new Promise((res) =>
        setTimeout(() => {
          res(1)
        }, 3000),
      )

      const success = Math.ceil(Math.random() * 10) > 5
      let claimResult: {txHash: string, slp: number}| "" = ""
      try {
        claimResult = await this.claimManager.claimSlp({
          address: account.address,
          pk: account.privateKey,
        })
      } catch (err) {
        console.log(err)
      }
      // ! ignore tx if there is no claim
      // if (!claimDone) {
      //   continue;
      // }

      reduxStore.dispatch(
        setClaimStatus({
          address: account.address,
          status: claimResult ? 'Done' : 'Failed',
          receipt: claimResult ? claimResult.txHash : '',
          slp: claimResult ? claimResult.slp : 0,
          // receipt: success ? claimReceipt : "",
        }),
      )
    }

    reduxStore.dispatch(setClaimsDone(true))
  }
}

export default new HdWallet(persistanceStorage, authService)
