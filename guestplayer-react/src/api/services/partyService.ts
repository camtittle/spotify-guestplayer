import { Party } from "../../models/Party";
import { SpotifyCredentials } from "../../models/SpotifyCredentials";
import { CreatePartyRequest } from "../models/createPartyRequest";
import { PartyResponse } from "../models/partyResponse";
import * as ApiService from './apiService';
import qrCode from 'qrcode';
import { GetPartyResponse } from "../models/getPartyResponse";
import { PartySummary } from "../../models/PartySummary";
import { CohostJoinTokenResponse } from "../models/cohostJoinTokenResponse";
import { CohostPartyRequest } from "../models/cohostPartyRequest";
import { Role } from "../models/role";

enum Endpoint {
  CreateParty = '/party/create',
  GetParty = '/party/{id}',
  JoinParty = '/party/{id}/join',
  CohostParty = '/party/{id}/cohost',
  EndParty = '/party',
  LeaveParty = '/party/leave',
  GetCohostJoinToken = '/party/{id}/cohost/token'
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

  const response = await ApiService.get<GetPartyResponse>(Endpoint.GetParty, params, undefined, true);

  return {
    id: response.id,
    name: response.name
  };
}

export const joinParty = async (partyId: string): Promise<Party> => {
  const params = {
    id: partyId
  };

  const response = await ApiService.post<PartyResponse>(Endpoint.JoinParty, undefined, params, undefined, true);

  return {
    id: response.id,
    name: response.name,
    guestCount: response.guestCount,
    token: response.token,
    role: response.role
  };
};

export const cohostParty = async (partyId: string, joinToken: string): Promise<Party> => {
  const params = {
    id: partyId
  };

  const request: CohostPartyRequest = {
    joinToken
  };

  const response = await ApiService.post<PartyResponse>(Endpoint.CohostParty, request, params, undefined, true);

  return {
    id: response.id,
    name: response.name,
    guestCount: response.guestCount,
    token: response.token,
    role: response.role
  };
};

export const endParty = async () => {
  await ApiService.del(Endpoint.EndParty);
};

export const leaveParty = async () => {
  await ApiService.post(Endpoint.LeaveParty);
};

export const getCohostJoinToken = async (partyId: string): Promise<string> => {
  const pathParams = {
    id: partyId
  };

  const response = await ApiService.get<CohostJoinTokenResponse>(Endpoint.GetCohostJoinToken, pathParams);

  return response.joinToken;
};

export const generateJoinUrl = (partyId: string): string => {
  const baseUrl = process.env.REACT_APP_URL;

  return `${baseUrl}/join/${partyId}`;
};

export const generateCohostJoinUrl = (partyId: string, joinToken: string): string => {
  const baseUrl = process.env.REACT_APP_URL;
  return `${baseUrl}/cohost/join/${partyId}/${joinToken}`;
}

export const generateQrCode = async (partyId: string): Promise<string> => {
  const joinUrl = generateJoinUrl(partyId);
  return await qrCode.toDataURL(joinUrl, { width: 200, errorCorrectionLevel: 'H' });
};

export const generateCohostQrCode = async (partyId: string, joinToken: string): Promise<string> => {
  const joinUrl = generateCohostJoinUrl(partyId, joinToken);
  return await qrCode.toDataURL(joinUrl, { width: 200, errorCorrectionLevel: 'H' });
};