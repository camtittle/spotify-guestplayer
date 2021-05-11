import { useHistory, useLocation } from 'react-router';
import queryString from 'query-string';
import { useContext, useEffect, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import * as SpotifyService from '../../../../../api/services/spotifyService';
import { GetAccessTokenResponse } from '../../../../../api/models/getAccessTokenResponse';
import styles from '../CreateParty.module.scss';
import { PartyContext } from '../../../../../contexts/partyContext';

const stateKey = 'spotify-auth-state';

export const SpotifyCallback = () => {

  const location = useLocation();
  const history = useHistory();
  const { setSpotifyCredentials } = useContext(PartyContext);

  const params = queryString.parse(location.search);
  const code = params.code as string;
  const receivedState = params.state as string;

  const [error, setError] = useState<string>();

  const validateStoredState = (receievdState: string) => {
    const state = localStorage.getItem(stateKey);
    return state === receievdState;
  }
  
  const exchangeToken = async (code: string): Promise<GetAccessTokenResponse> => {
    const result = await SpotifyService.getAccessToken(code);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresAt: result.expiresAt
    };
  }

  useEffect(() => {
    const stateIsValid = validateStoredState(receivedState);
    const codeIsValid = code !== undefined && code !== null;
    const paramsAreValid = stateIsValid && codeIsValid;
    console.log({ code, receivedState });
    if (!paramsAreValid) {
      console.error('Invalid redirect params');
      setError('An error occured connecting to Spotify. Please try again');
      return;
    }

    exchangeToken(code)
      .then(result => {
        setSpotifyCredentials(result);
        if (result) {
          history.push(`/party/create`);
        }
      })
      .catch(error => {
        console.error(error);
        setSpotifyCredentials(undefined);
        setError('An error occured connecting to Spotify. Please try again.');
      });
  }, [code, receivedState]);

  return (
    <div className={styles.callbackContainer}>
      {!error &&
        <PropagateLoader color="#1DB954"></PropagateLoader>
      }

      {error &&
        <p>{error}</p>
      }
    </div>
  );
}