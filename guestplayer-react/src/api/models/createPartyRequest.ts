export interface CreatePartyRequest {
  name: string;
  spotifyCredentials: SpotifyCredentials
}

export interface SpotifyCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}