import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { searchTracks } from '../../../../api/services/spotifyService';
import { Track } from '../../../../models/Track';
import FlexContainer from '../../../shared/container/FlexContainer';
import { TextInput } from '../../../shared/textInput/TextInput';
import { TitleBar } from '../../../shared/titleBar/TitleBar';
import TrackList from '../../../shared/trackList/TrackList';
import styles from './Request.module.scss';
import { throttle } from 'throttle-debounce';
import { PartyContext } from '../../../../contexts/partyContext';
import { useHistory, useLocation } from 'react-router';
import ConfirmRequestDialog, { ConfirmRequestDialogType } from './confirmRequestDialog/ConfirmRequestDialog';
import Search from '../../../../assets/img/search.svg';
import { useApiErrorHandler } from '../../../../hooks/apiErrorHandlerHook';
import { Page } from '../../../shared/page/Page';
import { SpotifyLinkBar } from '../../../shared/spotifyLinkBar/SpotifyLinkBar';

const Request = () => {

  const throttleRate = 500;

  const [searchValue, _setSearchValue] = useState('');
  const [tracks, setTracks] = useState<Track[] | undefined>(undefined);
  const {party, partyLoaded} = useContext(PartyContext);
  const history = useHistory();
  const textInputRef = useRef<TextInput>(null);
  const confirmRequestDialogRef = useRef<ConfirmRequestDialogType>(null);
  const apiErrorHandler = useApiErrorHandler();

  const setSearchValue = (searchValue: string) => {
    const queryParam = "?" + new URLSearchParams({ q: searchValue }).toString();
    const newPath = history.location.pathname + queryParam;
    window.history.replaceState(null, "", newPath)
    _setSearchValue(searchValue);
  }

  const fetchSearchResults = useCallback(throttle(throttleRate, (searchTerm: string) => {
    if (!party) {
      return;
    }

    searchTerm.trim();

    apiErrorHandler(async () => {
      const results = await searchTracks(searchTerm);
      if (searchTerm) {
        setTracks(results);
      }
    });
  }), [party]);

  useEffect(() => {
    if (!party && partyLoaded) {
      history.push('/');
    }
  }, [party, partyLoaded, history]);

  useEffect(() => {
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 300);
  }, [textInputRef.current]);

  const onChangeSearchValue = (value: string) => {
    setSearchValue(value);
    if (value) {
      fetchSearchResults(value);
    } else {
      setTracks(undefined);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    let searchQuery = params.get('q')
    if (searchQuery) {
      onChangeSearchValue(searchQuery);
    }
  }, []);
  
  if (!party) {
    return null;
  }

  const onClickTrack = (track: Track) => {
    if (!confirmRequestDialogRef.current) {
      return;
    }

    confirmRequestDialogRef.current.show(track);
  };

  return (
    <Page className={styles.flexContainer}>
      <div className={styles.container}>
        <TextInput value={searchValue} onChange={onChangeSearchValue} className={styles.textInput} ref={textInputRef} icon={Search} />
        <TrackList tracks={tracks} onClickTrack={onClickTrack} className={styles.trackList} />
      </div>

      <SpotifyLinkBar />

      <ConfirmRequestDialog ref={confirmRequestDialogRef} party={party} />
    </Page>
  );
};

export default Request;