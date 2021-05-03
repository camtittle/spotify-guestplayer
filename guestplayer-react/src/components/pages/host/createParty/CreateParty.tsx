import { useContext, useEffect } from 'react';
import { Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router';
import { PartyContext } from '../../../../contexts/partyContext';
import FlexContainer from '../../../shared/container/FlexContainer';
import { TitleBar } from '../../../shared/titleBar/TitleBar';
import styles from './CreateParty.module.scss';
import { ConnectToSpotify } from './steps/ConnectToSpotify';
import { PartyDetails } from './steps/PartyDetails';
import { SpotifyCallback } from './steps/SpotifyCallback';

export const CreateParty = () => {
  const { path } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();

  const { party } = useContext(PartyContext);

  useEffect(() => {
    if (party) {
      history.push('/party/host');
    }
  }, [party]);

  const onClickBackAction = () => {
    if (location.pathname.split('/').includes('finish')) {
      history.goBack();
    } else {
      history.push('/');
    }
  };

  return (
    <FlexContainer>
      <TitleBar showBackButton={true} onClickBack={onClickBackAction}></TitleBar>

      <div className={styles.stepContainer}>
          <Switch>
            <Route path={`${path}/callback`}>
              <SpotifyCallback></SpotifyCallback>
            </Route>
            <Route path={`${path}/finish`}>
              <PartyDetails></PartyDetails>
            </Route>
            <Route path={`${path}`}>
              <ConnectToSpotify nextPath={`${path}/finish`}></ConnectToSpotify>
            </Route>
          </Switch>
      </div>
      </FlexContainer>
  )
}