import { createContext, useEffect, useRef, useState } from "react";
import { PartyErrorType } from "../api/models/partyErrorType";
import Dialog from "../components/shared/dialog/Dialog";
import { Party } from "../models/Party";
import { SpotifyCredentials } from "../models/SpotifyCredentials";
import * as TokenManager from '../api/auth/tokenManager';

export interface PartyContextType {
  party?: Party;
  partyLoaded: boolean;
  setParty: (party?: Party) => void;
  spotifyCredentials?: SpotifyCredentials;
  setSpotifyCredentials: (creds?: SpotifyCredentials) => void;
  setError: (errorType: PartyErrorType) => void;
}

export const PartyContext = createContext<PartyContextType>({
  party: undefined,
  partyLoaded: false,
  setParty: () => {},
  spotifyCredentials: undefined,
  setSpotifyCredentials: () => { },
  setError: () => { },
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

  const partyEndedDialog = useRef<Dialog>(null);

  const handleError = (errorType: PartyErrorType) => {
    if (errorType === PartyErrorType.PartyEnded) {
      partyEndedDialog.current?.show();
    }
  }

  const [partyContext, setPartyContext] = useState<PartyContextType>({
    party: undefined,
    partyLoaded: false,
    setParty: (party?: Party) => {
      console.log(party);
      saveParty(party);
      if (party) {
        TokenManager.setBearerToken(party.token);
      }
      setPartyContext((previous) => {
        return { ...previous, party: party, partyLoaded: true }
      });
    },
    spotifyCredentials: undefined,
    setSpotifyCredentials: (creds?: SpotifyCredentials) => {
      setPartyContext((previous) => {
        return { ...previous, spotifyCredentials: creds }
      });
    },
    setError: (errorType: PartyErrorType) => {
      handleError(errorType);
    }
  });

  useEffect(() => {
    const savedParty = getSavedParty();
    partyContext.setParty(savedParty);
  }, []);

  const closeSessionExpiredDialog = () => {
    partyEndedDialog.current?.hide();
  };

  return (
    <PartyContext.Provider value={partyContext}>
      <Dialog
        title="Party ended"
        body="The party was ended by the host"
        primaryLabel="OK"
        onClickPrimary={closeSessionExpiredDialog}
        ref={partyEndedDialog}
      ></Dialog>
      {children}
    </PartyContext.Provider>
  );
}