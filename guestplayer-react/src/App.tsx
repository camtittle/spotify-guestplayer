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
import { PartyContextProvider } from './contexts/partyContext';
import HostHome from './components/pages/host/home/HostHome';
import { SlideLeft } from './components/shared/animatedRouteTransitions/slideLeft/SlideLeft';
import GuestHome from './components/pages/guest/home/GuestHome';
import Request from './components/pages/guest/request/Request';
import { ToastContextProvider } from './contexts/toastContext';
import ManageRequests from './components/pages/host/manageRequests/ManageRequests';
import ManageGuestRequests from './components/pages/guest/manageGuestRequests/ManageGuestRequests';
import CreatePartyIntro from './components/pages/host/createPartyIntro/CreatePartyIntro';
import CohostIntro from './components/pages/host/cohost/cohostIntro/CohostIntro';
import AddCohost from './components/pages/host/cohost/addCohost/AddCohost';
import NotificationSettings from './components/pages/host/notificationSettings/NotificationSettings';
import TrackRequestNotifications from './components/pages/host/trackRequestNotifications/TrackRequestNotifications';

export default function App() {
  return (
    <PartyContextProvider>
      
      <Router>
        <div className={styles.App}>

          <ToastContextProvider>
            <Switch>
              <Route path="*">
                <SlideLeft>

                  <Route path="/join/:id">
                    <Join type="guest" />
                  </Route>

                  <Route path="/cohost/join/:id/:cohostJoinToken">
                    <Join type="cohost" />
                  </Route>

                  <Route path="/scan">
                    <Scan />
                  </Route>

                  <Route path='/party/guest/requests'>
                    <ManageGuestRequests />
                  </Route>

                  <Route path='/party/guest/request'>
                    <Request />
                  </Route>

                  <Route path='/party/guest'>
                    <GuestHome />
                  </Route>

                  <Route path='/party/host/notifications'>
                    <NotificationSettings />
                  </Route>

                  <Route path='/party/host/requests'>
                    <ManageRequests />
                  </Route>

                  <Route path='/party/host'>
                    <HostHome />
                  </Route>
                  
                  <Route path="/party/cohost/intro">
                    <CohostIntro />
                  </Route>
                  
                  <Route path="/party/cohost/invite">
                    <AddCohost />
                  </Route>

                  <Route path='/party/cohost'>
                    <HostHome />
                  </Route>
                  
                  <Route path="/party/create/intro">
                    <CreatePartyIntro />
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
            </ToastContextProvider>
            <TrackRequestNotifications />
        </div>
      </Router>
        
    </PartyContextProvider>
  );
}
