import { Button, ButtonStyle } from '../../../../shared/button/Button';
import styles from '../CreateParty.module.scss';
import spotifyLogo from '../../../../../assets/img/spotify.svg';
import BuildUrl from 'build-url';
import { environment } from '../../../../../envionment';
import { v4 as uuid } from 'uuid';
import { SpotifyAccessToken } from '../../../../../models/SpotifyAccessToken';
import { SpotifyProfileDetails } from './SpotifyProfileDetails';
import { useHistory, useRouteMatch } from 'react-router';

interface ConnectToSpotifyProps {
  token?: SpotifyAccessToken;
  nextPath: string;
};

const spotifyAuthBaseUrl = 'https://accounts.spotify.com';
const spotifyAuthPath = 'authorize';
const scopes = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing'
];
const responseCode = 'code';
const stateKey = 'spotify-auth-state';

export const ConnectToSpotify = (props: ConnectToSpotifyProps) => {

  const history = useHistory();

  const generateState = () => {
    const state = uuid();
    localStorage.setItem(stateKey, state);
    return state;
  }

  const redirectToSpotify = (force: boolean = false) => {
    const url = BuildUrl(spotifyAuthBaseUrl, {
      path: spotifyAuthPath,
      queryParams: {
        'client_id': environment.spotifyClientId,
        'response_type': responseCode,
        'redirect_uri': environment.spotifyRedirectUri,
        'scope': scopes,
        'state': generateState(),
        'show_dialog': force ? 'true' : 'false'
      }
    });

    window.location.href = url;
  };

  const onClickConnectToSpotify = () => {
    redirectToSpotify();
  }

  const onClickCancel = () => {
    history.push('/');
  }

  const onClickNext = () => {
    history.push(props.nextPath)
  }

  return (
    <div>
      <h1 className={styles.stepTitle}>Host a party</h1>
      <p className={styles.stepDescription}>Log in with Spotify so GuestPlayer can play tracks and add them to the queue</p>

      { !props.token &&
        <Button style={ButtonStyle.GreenPrimary} className={styles.connectButton} icon={spotifyLogo} iconAltText="Spotify Logo" onClick={onClickConnectToSpotify}>Connect to Spotify</Button>
      }

      <SpotifyProfileDetails token={props.token} onClickLoginAsSomeoneElse={() => redirectToSpotify(true)}></SpotifyProfileDetails>

      <div>
        <Button style={ButtonStyle.WhiteSecondary} className={styles.leftNavButton} onClick={onClickCancel}>Cancel</Button>

        {props.token &&
          <Button style={ButtonStyle.WhitePrimary} className={styles.rightNavButton} onClick={onClickNext}>Next</Button>
        }
      </div>

    </div>
  )
}