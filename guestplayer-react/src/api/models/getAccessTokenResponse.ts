export interface GetAccessTokenResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}