import axios, { Axios, AxiosRequestConfig } from "axios";
export class HttpClient {
  private _axios: Axios;
  constructor() {
    this._axios = axios.create({});
  }

  public async get<T>(url: string, config?: AxiosRequestConfig<unknown>) {
    return this._axios.get<T>(url, config);
  }
  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ) {
    return this._axios.post<T>(url, data, config);
  }
  public async delete<T>(url: string, config?: AxiosRequestConfig<unknown>) {
    return this._axios.delete<T>(url, config);
  }
  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig<unknown>
  ) {
    return this._axios.patch<T>(url, data, config);
  }
}

export default new HttpClient();
