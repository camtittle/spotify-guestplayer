export interface JwtToken {
  sub: string;
  partyId: string;
  iat: number;
  exp: number
}