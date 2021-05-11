import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './components/pages/home/Home';
import styles from './App.module.scss';
import Scan from './components/pages/guest/scan/Scan';
import Join from './components/pages/guest/join/Join';
import { CreateParty } from './components/pages/host/createParty/CreateParty';
import { useEffect, useState } from 'react';
import { Party } from './models/Party';
import { PartyContext } from './contexts/partyContext';
import { PartyContextType } from './models/PartyContextType';
import HostHome from './components/pages/host/home/HostHome';
import { SlideLeft } from './components/shared/animatedRouteTransitions/slideLeft/SlideLeft';
import { SpotifyCredentials } from './models/SpotifyCredentials';
import GuestHome from './components/pages/guest/home/GuestHome';
import Request from './components/pages/guest/request/Request';
import Toast from './components/shared/toast/Toast';
import { ToastContextProvider } from './contexts/toastContext';

export default function App() {

  const partyKey = 'party';

  const saveParty = (party?: Party) => {
    if (party) {
      localStorage.setItem(partyKey, JSON.stringify(party));
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
      <ToastContextProvider>
        <Router>
          <div className={styles.App}>
            <Switch>

              <Route path="*">
                <SlideLeft>
                  <Route path="/join/:id">
                    <Join />
                  </Route>

                  <Route path="/scan">
                    <Scan />
                  </Route>

                  <Route path='/party/guest/request'>
                    <Request />
                  </Route>

                  <Route path='/party/guest'>
                    <GuestHome />
                  </Route>

                  <Route path='/party/host'>
                    <HostHome />
                  </Route>
                  
                  <Route path="/party/create">
                    <CreateParty />
                  </Route>

                  <Route path="/" exact>
                    <Home />
                  </Route>
                </SlideLeft>

              </Route>

            </Switch>
          </div>
        </Router>
      </ToastContextProvider>
    </PartyContext.Provider>

  );
}
