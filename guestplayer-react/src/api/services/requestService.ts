import { TrackRequest } from "../../models/TrackRequest";
import { getTrackRequestCountResponse } from "../models/getTrackRequestCountResponse";
import { RequestTrackRequest } from "../models/requestTrackRequest"
import { TrackRequestResponse } from "../models/TrackRequestResponse";
import { WebsocketMethod } from "../models/websocketMethod";
import { get, post, del } from "./apiService";
import { WebsocketService, Subscription } from "./websocketService";

enum Endpoint {
  RequestTrack = '/request',
  GetRequests = '/request',
  GetGuestRequests = '/request/guest',
  GetRequestCount = '/request/count',
  DeleteRequest = '/request/{id}',
  PlayRequest = '/request/{id}/play',
  QueueRequest = '/request/{id}/queue',
};

export const requestTrack = async (spotifyTrackId: string): Promise<void> => {
  if (!spotifyTrackId) {
    throw new Error('Missing spotify track ID');
  }

  const request: RequestTrackRequest = {
    trackId: spotifyTrackId
  }

  await post(Endpoint.RequestTrack, request);
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

export const getTrackRequests = async (): Promise<TrackRequest[]> => {
  const response = await get<TrackRequestResponse[]>(Endpoint.RequestTrack);

  return response.map(mapTrackRequestResponse);
}

export const getGuestTrackRequests = async (): Promise<TrackRequest[]> => {
  const response = await get<TrackRequestResponse[]>(Endpoint.GetGuestRequests);

  return response.map(mapTrackRequestResponse);
}

export const getTrackRequestCount = async (): Promise<number> => {
  const response = await get<getTrackRequestCountResponse>(Endpoint.GetRequestCount);

  return response.count;
}

export const deleteTrackRequest = async (trackRequest: TrackRequest): Promise<void> => {
  const params = {
    id: trackRequest.id
  }

  await del<void>(Endpoint.DeleteRequest, params);
}

export const acceptTrackRequest = async (trackRequest: TrackRequest, playType: 'play' | 'queue'): Promise<void> => {
  const params = {
    id: trackRequest.id
  }

  switch (playType) {
    case 'play':
      await post<void>(Endpoint.PlayRequest, undefined, params);
      break;
    case 'queue':
      await post<void>(Endpoint.QueueRequest, undefined, params);
      break;
  }

}


export const subscribeToTrackRequests = async (token: string, callback: (trackRequest: TrackRequest) => void): Promise<Subscription> => {
  return WebsocketService.subscribe<TrackRequestResponse>(WebsocketMethod.ReceiveTrackRequest, (response) => {
    callback(mapTrackRequestResponse(response))
  });
}

export const unsubscribeFromTrackRequests = (subscription: Subscription) => {
  WebsocketService.unsubscribe(subscription);
}