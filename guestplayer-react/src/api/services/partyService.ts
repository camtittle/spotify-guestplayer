import { Party } from "../../models/Party";
import { SpotifyCredentials } from "../../models/SpotifyCredentials";
import { CreatePartyRequest } from "../models/createPartyRequest";
import { PartyResponse } from "../models/partyResponse";
import * as ApiService from './apiService';
import qrCode from 'qrcode';
import { GetPartyResponse } from "../models/getPartyResponse";
import { PartySummary } from "../../models/PartySummary";

enum Endpoint {
  CreateParty = '/party/create',
  GetParty = '/party/{id}',
  JoinParty = '/party/{id}/join',
  EndParty = '/party',
  LeaveParty = '/party/leave'
};

export const createParty = async (name: string, spotifyCredentials: SpotifyCredentials): Promise<Party> => {
  const request: CreatePartyRequest = {
    name: name,
    spotifyCredentials: {
      accessToken: spotifyCredentials.accessToken,
      refreshToken: spotifyCredentials.refreshToken,
      expiresAt: spotifyCredentials.expiresAt
    }
  };

  const response = await ApiService.post<PartyResponse>(Endpoint.CreateParty, request);

  return {
    id: response.id,
    name: response.name,
    guestCount: response.guestCount,
    token: response.token,
    role: response.role
  };
};

export const getPartySummary = async (partyId: string): Promise<PartySummary> => {
  const params = {
    id: partyId
  };

  const response = await ApiService.get<GetPartyResponse>(Endpoint.GetParty, params);

  return {
    id: response.id,
    name: response.name
  };
}

export const joinParty = async (partyId: string): Promise<Party> => {
  const params = {
    id: partyId
  };

  const response = await ApiService.post<PartyResponse>(Endpoint.JoinParty, undefined, params);

  return {
    id: response.id,
    name: response.name,
    guestCount: response.guestCount,
    token: response.token,
    role: response.role
  };
};

export const endParty = async (token: string) => {
  const headers = ApiService.getBearerTokenHeaders(token);
  await ApiService.del(Endpoint.EndParty, undefined, headers);
};

export const leaveParty = async (token: string) => {
  const headers = ApiService.getBearerTokenHeaders(token);
  await ApiService.post(Endpoint.LeaveParty, undefined, undefined, headers);
};

export const generateJoinUrl = (partyId: string): string => {
  const baseUrl = process.env.REACT_APP_URL;
  return `${baseUrl}/join/${partyId}`;
};

export const generateQrCode = async (partyId: string): Promise<string> => {
  const joinUrl = generateJoinUrl(partyId);
  return await qrCode.toDataURL(joinUrl, { width: 200, errorCorrectionLevel: 'H' });
};