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
  console.log('set bearer token');
  const decoded = jwtDecode<JwtToken>(token);
  const expiry = new Date(decoded.exp * 1000);
  _bearerToken = {
    token,
    expiry: expiry.toISOString()
  };

  console.log('set Bearer token, expiry: ' + expiry.toISOString());
};

const refreshToken = async () => {
  console.log('Refreshing token...');
  const response = await post<RefreshTokenResponse>('/token/refresh', undefined, undefined, undefined, true);
  setBearerToken(response.token);
};

export const getBearerToken = async (): Promise<string | undefined> => {
  if (!_bearerToken) {
    return undefined;
  }

  const now = addMinutes(new Date(), 5).toISOString();
  
  console.log({ now, exp: _bearerToken.expiry });
  const tokenExpired = now > _bearerToken.expiry;
  if (tokenExpired) {
    await refreshToken();
  }

  return _bearerToken.token;
}