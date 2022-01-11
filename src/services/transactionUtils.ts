import Web3 from "web3";
import { RONIN_PROVIDER_FREE } from "./constants";
import { HttpClient } from "./httpClient";

export class TransactionUtils {
  constructor(private web3: Web3, private httpClient: HttpClient) {}

  public async getNonce(address: string) {
    this.web3.setProvider(new Web3.providers.HttpProvider(RONIN_PROVIDER_FREE));

    const nonce = await this.web3.eth.getTransactionCount(
      this.formatAddress(address)
    );
    return nonce;
  }

  public formatAddress(address: string) {
    return this.web3.utils.toChecksumAddress(address.replace("ronin:", "0x"));
  }
}
