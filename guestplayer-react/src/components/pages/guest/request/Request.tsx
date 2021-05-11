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
import { useHistory } from 'react-router';
import { ConfirmRequestDialog } from './confirmRequestDialog/ConfirmRequestDialog';

const Request = () => {

  const throttleRate = 500;

  const [searchValue, setSearchValue] = useState('');
  const [tracks, setTracks] = useState<Track[] | undefined>(undefined);
  const {party, partyLoaded} = useContext(PartyContext);
  const history = useHistory();
  const textInputRef = useRef<TextInput>(null);
  const confirmRequestDialogRef = useRef<ConfirmRequestDialog>(null);

  const fetchSearchResults = useCallback(throttle(throttleRate, (searchTerm: string) => {
    if (!party) {
      return;
    }

    searchTerm.trim();
    searchTracks(searchTerm, party.token)
      .then((results) => {
        if (searchTerm) {
          setTracks(results);
        }
      }).catch((e) => {
        console.error(e);
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

  if (!party) {
    return null;
  }

  const onChangeSearchValue = (value: string) => {
    setSearchValue(value);
    if (value) {
      fetchSearchResults(value);
    } else {
      setTracks(undefined);
    }
  };

  const onClickTrack = (track: Track) => {
    if (!confirmRequestDialogRef.current) {
      return;
    }

    confirmRequestDialogRef.current.show(track);
  };

  return (
    <FlexContainer className={styles.flexContainer}>
      <TitleBar showBackButton />

      <div className={styles.container}>
        <TextInput value={searchValue} onChange={onChangeSearchValue} className={styles.textInput} ref={textInputRef} />
        <TrackList tracks={tracks} onClickTrack={onClickTrack} className={styles.trackList} />
      </div>

      <ConfirmRequestDialog ref={confirmRequestDialogRef} />
    </FlexContainer>
  );
};

export default Request;