import persistanceStorage, { PersistanceStorage } from "./persistanceStorage";
import stateStore, { StateStore } from "./stateStore";

export class AuthService {
  public password: string = "";

  constructor(
    private sStore: StateStore,
    private pStorage: PersistanceStorage
  ) {}

  public isAuthenticated() {
    return this.sStore.getAuthState().loggedIn;
  }

  public async isRegistered() {
    const password = await this.pStorage.getKey("_d");
    return !!password;
  }

  public async login(password: string) {
    try {
      const _d = await this.pStorage.getSecurely("_d", password);
      this.password = password;
    } catch (error) {
      if (error + "".includes("Malformed")) {
        console.log("Password is not Correct");
        throw "608, Password is not Correct";
      }
    }
  }
}

export default new AuthService(stateStore, persistanceStorage);
