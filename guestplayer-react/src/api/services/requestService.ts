import { RequestTrackRequest } from "../models/requestTrackRequest"
import { getBearerTokenHeaders, Headers, post } from "./apiService";

enum Endpoint {
  RequestTrack = '/request',
};


export const requestTrack = async (spotifyTrackId: string, token: string): Promise<void> => {
  if (!spotifyTrackId) {
    throw new Error('Missing spotify track ID');
  }

  if (!token) {
    throw new Error('Missing auth token');
  }

  const request: RequestTrackRequest = {
    trackId: spotifyTrackId
  }

  const headers = getBearerTokenHeaders(token);

  await post(Endpoint.RequestTrack, request, undefined, headers);
}