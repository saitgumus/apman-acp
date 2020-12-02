import axios from "axios";

class HttpClientService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "/",
      headers: {
        Authorization: `Bearer`,
      },
    });
  }

  get(url) {
    return this.axiosInstance
      .get(url)
      .then((resp) => {})
      .catch((resp) => {
        if (resp.response !== undefined && resp.response.status === 401) {
          window.location.replace("http://localhost:3000");
        } else {
          return Promise.reject(resp);
        }
      });
  }

  post(url, data) {
    return this.axiosInstance
      .post(url, data)
      .then((resp) => {
        return Promise.resolve(resp);
      })
      .catch((resp) => {
        if (resp.response !== undefined && resp.response.status === 401) {
          console.log("unauthorized!!");
        }
        return Promise.reject(resp);
      });
  }

  setTokenOnLogin = (token = "") => {
    // const tokens = JSON.parse(localStorage.getItem("user") || "{}")["token"];
    this.axiosInstance.defaults.headers = { Authorization: `Bearer ${token}` };
  };
  clearTokenOnLogout = () => {
    this.axiosInstance.defaults.headers = {};
  };
}

export const HttpClientServiceInstance = new HttpClientService();
