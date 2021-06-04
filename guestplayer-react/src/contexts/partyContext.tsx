import { createContext, useEffect, useState } from "react";
import { Party } from "../models/Party";
import { SpotifyCredentials } from "../models/SpotifyCredentials";

export interface PartyContextType {
  party?: Party;
  partyLoaded: boolean;
  setParty: (party?: Party) => void;
  spotifyCredentials?: SpotifyCredentials;
  setSpotifyCredentials: (creds?: SpotifyCredentials) => void;
}

export const PartyContext = createContext<PartyContextType>({
  party: undefined,
  partyLoaded: false,
  setParty: () => {},
  spotifyCredentials: undefined,
  setSpotifyCredentials: () => {}
});


interface PartyContextProviderProps {
  children: React.ReactNode;
}

export const PartyContextProvider = ({ children }: PartyContextProviderProps) => {
  
  const partyKey = 'party';

  const saveParty = (party?: Party) => {
    if (party) {
      localStorage.setItem(partyKey, JSON.stringify(party));
    } else {
      localStorage.removeItem(partyKey);
    }
  };

  const getSavedParty = (): Party | undefined => {
    const party = localStorage.getItem(partyKey);
    if (party) {
      return JSON.parse(party);
    }
  }

  const [partyContext, setPartyContext] = useState<PartyContextType>({
    party: undefined,
    partyLoaded: false,
    setParty: (party?: Party) => {
      saveParty(party);
      console.log(party);
      setPartyContext((previous) => {
        return { ...previous, party: party, partyLoaded: true }
      });
    },
    spotifyCredentials: undefined,
    setSpotifyCredentials: (creds?: SpotifyCredentials) => {
      setPartyContext((previous) => {
        return { ...previous, spotifyCredentials: creds }
      });
    }
  });

  useEffect(() => {
    const savedParty = getSavedParty();
    partyContext.setParty(savedParty);
  }, []);

  return (
    <PartyContext.Provider value={partyContext}>
      {children}
    </PartyContext.Provider>
  );
}