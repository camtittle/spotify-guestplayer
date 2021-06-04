import { TrackRequest } from "../../models/TrackRequest";
import { getTrackRequestCountResponse } from "../models/getTrackRequestCountResponse";
import { RequestTrackRequest } from "../models/requestTrackRequest"
import { TrackRequestResponse } from "../models/TrackRequestResponse";
import { WebsocketMethod } from "../models/websocketMethod";
import { get, getBearerTokenHeaders, post, del } from "./apiService";
import { WebsocketService, Subscription } from "./websocketService";

enum Endpoint {
  RequestTrack = '/request',
  GetRequests = '/request',
  GetRequestCount = '/request/count',
  DeleteRequest = '/request/{id}',
  PlayRequest = '/request/{id}/play',
  QueueRequest = '/request/{id}/queue',
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

const mapTrackRequestResponse = (response: TrackRequestResponse): TrackRequest => {
  return {
    id: response.id,
    createdAt: new Date(response.createdAt),
    track: {
      spotifyId: response.spotifyTrackId,
      title: response.title,
      artist: response.artist,
      artworkUrl: response.artworkUrl,
      album: response.album,
      durationMs: 0
    }
  };
}

export const getTrackRequests = async (token: string): Promise<TrackRequest[]> => {
  if (!token) {
    throw new Error('Missing auth token');
  }

  const headers = getBearerTokenHeaders(token);

  const response = await get<TrackRequestResponse[]>(Endpoint.RequestTrack, undefined, headers);

  return response.map(mapTrackRequestResponse);
}

export const getTrackRequestCount = async (token: string): Promise<number> => {
  if (!token) {
    throw new Error('Missing auth token');
  }

  const headers = getBearerTokenHeaders(token);

  const response = await get<getTrackRequestCountResponse>(Endpoint.GetRequestCount, undefined, headers);

  return response.count;
}

export const deleteTrackRequest = async (trackRequest: TrackRequest, token: string): Promise<void> => {
  if (!token) {
    throw new Error('Missing auth token');
  }

  const headers = getBearerTokenHeaders(token);

  const params = {
    id: trackRequest.id
  }

  await del<void>(Endpoint.DeleteRequest, params, headers);
}

export const acceptTrackRequest = async (trackRequest: TrackRequest, playType: 'play' | 'queue', token: string): Promise<void> => {
  if (!token) {
    throw new Error('Missing auth token');
  }

  const headers = getBearerTokenHeaders(token);

  const params = {
    id: trackRequest.id
  }

  switch (playType) {
    case 'play':
      await post<void>(Endpoint.PlayRequest, undefined, params, headers);
      break;
    case 'queue':
      await post<void>(Endpoint.QueueRequest, undefined, params, headers);
      break;
  }

}


export const subscribeToTrackRequests = (token: string, callback: (trackRequest: TrackRequest) => void): Subscription => {
  return WebsocketService.subscribe<TrackRequestResponse>(token, WebsocketMethod.ReceiveTrackRequest, (response) => {
    callback(mapTrackRequestResponse(response))
  });
}

export const unsubscribeFromTrackRequests = (subscription: Subscription) => {
  WebsocketService.unsubscribe(subscription);
}