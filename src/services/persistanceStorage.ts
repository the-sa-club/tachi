import { AES, enc } from "crypto-js";
import localforage from "localforage";

export class PersistanceStorage {
  constructor(private localForage: LocalForage) {}

  public async setSecurely(data: string, key: string, secret: string = "") {
    const encryptedData = AES.encrypt(data, secret).toString();
    await this.localForage.setItem(key, encryptedData);
  }

  public async getSecurely(key: string, secret: string) {
    const savedData: string = await this.localForage.getItem(key);
    if (!savedData) {
      return null;
    }
    const decryptedData = AES.decrypt(savedData, secret).toString(enc.Utf8);
    return decryptedData;
  }

  public async removeKey(key: string) {
    return await this.localForage.removeItem(key);
  }

  public async getKey(key: string) {
    const savedData: string = await this.localForage.getItem(key);
    return savedData;
  }

  public async setKey(key: string, data: string) {
    await this.localForage.setItem(key, data);
  }

  public async resetAll() {
    await this.localForage.clear();
  }
}

export default new PersistanceStorage(localforage);
