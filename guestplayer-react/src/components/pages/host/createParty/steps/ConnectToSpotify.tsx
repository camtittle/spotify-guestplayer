import { Button, ButtonStyle } from '../../../../shared/button/Button';
import styles from '../CreateParty.module.scss';
import spotifyLogo from '../../../../../assets/img/spotify.svg';
import BuildUrl from 'build-url';
import { v4 as uuid } from 'uuid';
import { SpotifyProfileDetails } from './SpotifyProfileDetails';
import { useHistory } from 'react-router';
import { useContext } from 'react';
import { PartyContext } from '../../../../../contexts/partyContext';

interface ConnectToSpotifyProps {
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
  const { spotifyCredentials } = useContext(PartyContext);

  const generateState = () => {
    const state = uuid();
    localStorage.setItem(stateKey, state);
    return state;
  }

  const redirectToSpotify = (force: boolean = false) => {
    const url = BuildUrl(spotifyAuthBaseUrl, {
      path: spotifyAuthPath,
      queryParams: {
        'client_id': process.env.REACT_APP_SPOTIFY_CLIENT_ID as string,
        'response_type': responseCode,
        'redirect_uri': process.env.REACT_APP_SPOTIFY_CALLBACK as string,
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
      <p className={styles.stepDescription}>Log in with Spotify so GuestRequest can play tracks and add them to the queue</p>

      { !spotifyCredentials &&
        <Button style={ButtonStyle.GreenPrimary} className={styles.connectButton} icon={spotifyLogo} iconAltText="Spotify Logo" onClick={onClickConnectToSpotify}>Connect to Spotify</Button>
      }

      <SpotifyProfileDetails token={spotifyCredentials} onClickLoginAsSomeoneElse={() => redirectToSpotify(true)}></SpotifyProfileDetails>

      <div>
        <Button style={ButtonStyle.WhiteSecondary} className={styles.leftNavButton} onClick={onClickCancel}>Cancel</Button>

        {spotifyCredentials &&
          <Button style={ButtonStyle.WhitePrimary} className={styles.rightNavButton} onClick={onClickNext}>Next</Button>
        }
      </div>

    </div>
  )
}