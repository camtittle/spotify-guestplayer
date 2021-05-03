import { Party } from "./Party";
import { SpotifyCredentials } from "./SpotifyCredentials";

export interface PartyContextType {
  party?: Party;
  partyLoaded: boolean;
  setParty: (party?: Party) => void;
  spotifyCredentials?: SpotifyCredentials;
  setSpotifyCredentials: (creds?: SpotifyCredentials) => void;
}