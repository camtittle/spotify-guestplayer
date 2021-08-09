import addMinutes from "date-fns/addMinutes";
import isAfter from "date-fns/isAfter";
import jwtDecode from "jwt-decode";
import { JwtToken } from "../models/jwtToken";
import { RefreshTokenResponse } from "../models/refreshTokenResponse";
import { post } from "../services/apiService";

let _bearerToken: {
  token: string;
  expiry: string;
};

export const setBearerToken = (token: string) => {
  const decoded = jwtDecode<JwtToken>(token);
  const expiry = new Date(decoded.exp * 1000);
  _bearerToken = {
    token,
    expiry: expiry.toISOString()
  };
};

let busyFlag = false;
const refreshToken = async (): Promise<void> => {

  // If another call to refreshToken is already running, we just wait for that one to complete,
  // then return as we don't want to make 2 calls
  if (busyFlag) {
    return new Promise(resolve => {

      const interval = setInterval(() => {
        if (!busyFlag) {
          clearInterval(interval);
          resolve();
        }
      }, 100)
    })
  }

  busyFlag = true;
  const response = await post<RefreshTokenResponse>('/token/refresh', undefined, undefined, undefined, true);
  setBearerToken(response.token);
  busyFlag = false;
};

export const getBearerToken = async (): Promise<string | undefined> => {
  if (!_bearerToken) {
    return undefined;
  }

  const now = addMinutes(new Date(), 5).toISOString();
  
  const tokenExpired = now > _bearerToken.expiry;
  if (tokenExpired) {
    await refreshToken();
  }

  return _bearerToken.token;
}