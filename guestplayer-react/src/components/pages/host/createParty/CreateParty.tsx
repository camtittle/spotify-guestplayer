import { useRef, useState } from 'react';
import { Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router';
import { GetAccessTokenResponse } from '../../../../api/models/getAccessTokenResponse';
import { SpotifyAccessToken } from '../../../../models/SpotifyAccessToken';
import FlexContainer from '../../../shared/container/FlexContainer';
import { TitleBar } from '../../../shared/titleBar/TitleBar';
import styles from './CreateParty.module.scss';
import { ConnectToSpotify } from './steps/ConnectToSpotify';
import { PartyDetails } from './steps/PartyDetails';
import { SpotifyCallback } from './steps/SpotifyCallback';


export const CreateParty = () => {
  
  const [token, setToken] = useState<SpotifyAccessToken>();
  const { path, url } = useRouteMatch();
  const location = useLocation();
  const history = useHistory();

  const setTokenResult = (token?: GetAccessTokenResponse) => {
    setToken(token);
    if (token) {
      history.push(`${path}/`);
    }
  }

  const onClickBackAction = () => {
    if (location.pathname.split('/').includes('finish')) {
      history.goBack();
    } else {
      history.push('/');
    }
  }

  return (
    <FlexContainer>
      <TitleBar showBackButton={true} onClickBack={onClickBackAction}></TitleBar>

      <div className={styles.stepContainer}>
        <Switch>
          <Route path={`${path}/callback`}>
            <SpotifyCallback setTokenResult={setTokenResult}></SpotifyCallback>
          </Route>
          <Route path={`${path}/finish`}>
            <PartyDetails></PartyDetails>
          </Route>
          <Route path={`${path}`}>
            <ConnectToSpotify token={token} nextPath={`${path}/finish`}></ConnectToSpotify>
          </Route>
        </Switch>
      </div>
    </FlexContainer>
  )
}