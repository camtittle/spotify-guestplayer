import SpotifyWebApi from "spotify-web-api-js";
import { environment } from "../../envionment";
import { SpotifyProfile } from "../../models/SpotifyProfile";
import * as ApiService from "../apiService";
import { GetAccessTokenRequest } from "../models/getAccessTokenRequest";
import { GetAccessTokenResponse } from "../models/getAccessTokenResponse";


enum Endpoint {
  Token = 'Token'
};

const endpoints = {
  [Endpoint.Token]: '/spotify/token'
};

let token: string;
let spotifyClient: SpotifyWebApi.SpotifyWebApiJs;

const getEndpointUrl = (endpoint: Endpoint) => {
  const endpointPath = endpoints[endpoint];
  if (!endpointPath) {
    throw new Error(`Cannot find URL for endpoint ${endpoint}`)
  }

  return environment.apiBaseUrl + endpointPath;
}

export const getAccessToken = async (code: string): Promise<GetAccessTokenResponse> => {
  const endpointUrl = getEndpointUrl(Endpoint.Token);
  const body: GetAccessTokenRequest = {
    code: code
  };

  const response = await ApiService.post<GetAccessTokenRequest, GetAccessTokenResponse>(endpointUrl, body);
  token = response.accessToken;
  return response;
}

export const setAccessToken = (thisToken: string) => {
  token = thisToken;
}

const getSpotifyClient = (): SpotifyWebApi.SpotifyWebApiJs => {
  if (!spotifyClient) {
    spotifyClient = new SpotifyWebApi();
  }
  
  spotifyClient.setAccessToken(token);
  return spotifyClient;
}

export const getProfile = async (): Promise<SpotifyProfile> => {
  const client = getSpotifyClient();

  const profile = await client.getMe();
  
  return {
    name: profile.display_name,
    image: profile.images ? profile.images[0].url : undefined
  };
}
