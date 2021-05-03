import { createContext } from "react";
import { PartyContextType } from "../models/PartyContextType";

export const PartyContext = createContext<PartyContextType>({
  party: undefined,
  partyLoaded: false,
  setParty: () => {},
  spotifyCredentials: undefined,
  setSpotifyCredentials: () => {}
});