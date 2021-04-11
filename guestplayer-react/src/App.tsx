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

export default function App() {
  return (
    <Router>
      <div className={styles.App}>

        <Switch>

          <Route path="/join/:id">
            <Join />
          </Route>

          <Route path="/scan">
            <Scan />
          </Route>

          <Route path="/party/create">
            <CreateParty />
          </Route>
          
          <Route path="/">
            <Home />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}
