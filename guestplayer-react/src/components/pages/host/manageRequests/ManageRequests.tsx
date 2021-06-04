import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { PartyContext } from '../../../../contexts/partyContext';
import styles from './ManageRequests.module.scss';
import { deleteTrackRequest, getTrackRequests, acceptTrackRequest, subscribeToTrackRequests, unsubscribeFromTrackRequests } from '../../../../api/services/requestService';
import { TrackRequest } from '../../../../models/TrackRequest';
import FlexContainer from '../../../shared/container/FlexContainer';
import { TitleBar } from '../../../shared/titleBar/TitleBar';
import LoadingSpinner from '../../../shared/loadingSpinner/LoadingSpinner';
import TrackListItem from '../../../shared/trackListItem/TrackListItem';
import { Button, ButtonSize, ButtonStyle } from '../../../shared/button/Button';
import MusicalNotesIcon from '../../../../assets/img/musical-note-small.svg';
import QueueIcon from '../../../../assets/img/queue.svg';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ToastContext } from '../../../../contexts/toastContext';
import { ToastState } from '../../../shared/toast/Toast';
import { ErrorCode } from '../../../../api/error/ErrorCodes';
import { Subscription } from '../../../../api/services/websocketService';

const ManageRequests = () => {

  const { party, partyLoaded } = useContext(PartyContext);
  const { setToastState } = useContext(ToastContext);
  const [trackRequests, setTrackRequests] = useState<TrackRequest[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const history = useHistory();

  useEffect(() => {
    if (!party && partyLoaded) {
      console.log('rediect');
      history.push('/');
    }
  }, [party, partyLoaded]);

  useEffect(() => {

    let trackRequestSubscription: Subscription;

    if (party) {
      getTrackRequests(party.token).then(trackRequests => {
        setTrackRequests(trackRequests);
        setLoading(false);

        trackRequestSubscription = subscribeToTrackRequests(party.token, (request) => {
          setTrackRequests((requests) => {
            const existingRequests = requests || [];
            return existingRequests.concat([request]);
          })
        });
      }).catch(e => {
        setError('Problem loading requests');
        setLoading(false);
      });
    }

    return () => {
      if (trackRequestSubscription) {
        unsubscribeFromTrackRequests(trackRequestSubscription);
      }
    }
  }, [party]);

  const onClickBack = () => {
    history.push('/party/host');
  }


  const toastMessages = {
    queue: {
      success: '',
      error: '',
      activePlayerDeviceNotFoundError: '',
      loading: ''
    },
    play: {
      success: '',
      error: '',
      activePlayerDeviceNotFoundError: '',
      loading: ''
    },
    delete: {
      success: '',
      error: '',
      loading: ''
    }
  };

  const onClickTrash = (requestToDelete: TrackRequest) => {
    if (!trackRequests || !party) {
      return;
    }

    // Remove it pre-emptively
    let index = trackRequests?.indexOf(requestToDelete);
    trackRequests.splice(index, 1);
    setTrackRequests(trackRequests.slice());
    setToastState(ToastState.Loading, 'Deleting track request');
    
    deleteTrackRequest(requestToDelete, party.token).then(() => {
      setToastState(ToastState.Success, 'Track request deleted');
    }).catch((e) => {
      console.error(e);
      // Failed to delete, so add it back to the list
      setTrackRequests(requests => {
        if (!requests) {
          return;
        }
        requests.splice(index, 0, requestToDelete);
        return requests.slice();
      });
      setToastState(ToastState.Error, 'Failed to delete track request');
    });
  };

  const onClickPlayNow = (requestToPlay: TrackRequest) => {
    if (!trackRequests || !party) {
      return;
    }

    // Remove it pre-emptively
    let index = trackRequests?.indexOf(requestToPlay);
    trackRequests.splice(index, 1);
    setTrackRequests(trackRequests.slice());
    setToastState(ToastState.Loading, 'Playing track');
    
    acceptTrackRequest(requestToPlay, 'play', party.token).then(() => {
      setToastState(ToastState.Success, 'Track played succesfully');
    }).catch((e) => {
      console.error(e);
      let errorMessage = 'Failed to play track';
      if (e.errorCode === ErrorCode.ActivePlayerDeviceNotFound) {
        errorMessage = "Couldn't play track. To play tracks you need to have an active device currently playing music from Spotify.";
      }

      // Failed to delete, so add it back to the list
      setTrackRequests(requests => {
        if (!requests) {
          return;
        }
        requests.splice(index, 0, requestToPlay);
        return requests.slice();
      });
      setToastState(ToastState.Error, errorMessage);
    });
  };

  const onClickQueue = (requestToPlay: TrackRequest) => {
    if (!trackRequests || !party) {
      return;
    }

    // Remove it pre-emptively
    let index = trackRequests?.indexOf(requestToPlay);
    trackRequests.splice(index, 1);
    setTrackRequests(trackRequests.slice());
    setToastState(ToastState.Loading, 'Queueing track');
    
    acceptTrackRequest(requestToPlay, 'queue', party.token).then(() => {
      setToastState(ToastState.Success, 'Track queued succesfully');
    }).catch((e) => {
      let errorMessage = 'Failed to queue track';
      if (e.errorCode === ErrorCode.ActivePlayerDeviceNotFound) {
        errorMessage = "Couldn't queue track. To queue tracks you need to have an active device currently playing music from Spotify.";
      }

      // Failed to delete, so add it back to the list
      setTrackRequests(requests => {
        if (!requests) {
          return;
        }
        requests.splice(index, 0, requestToPlay);
        return requests.slice();
      });
      setToastState(ToastState.Error, errorMessage);
    });
  };

  let requestCards: JSX.Element[] | null = null;
  if (trackRequests) {
    requestCards = trackRequests.map(request => (
      <CSSTransition timeout={{appear: 400, enter: 400, exit: 300}} key={request.id} enter appear classNames={{
        appear: styles.fadeAppear,
        appearActive: styles.fadeAppearActive,
        enter: styles.fadeEnter,
        enterActive: styles.fadeEnterActive,
        enterDone: styles.fadeEnterDone,
        exit: styles.slideExit,
        exitActive: styles.slideExitActive
      }}>
        <div className={styles.requestCard}>
          <TrackListItem track={request.track} className={styles.trackListItem} />
          <div className={styles.buttonsContainer}>
            <button className={styles.trashButton} onClick={() => onClickTrash(request)} />
            <div>
              <Button style={ButtonStyle.WhitePrimary} size={ButtonSize.Small} className={styles.playNow} icon={MusicalNotesIcon} onClick={() => onClickPlayNow(request)}>Play now</Button>
              <Button style={ButtonStyle.GreenPrimary} size={ButtonSize.Small} className={styles.addToQueue} icon={QueueIcon} onClick={() => onClickQueue(request)}>Add to queue</Button>
            </div>
          </div>
        </div>
      </CSSTransition>
    ))
  }

  return (
    <FlexContainer>
      <TitleBar showBackButton onClickBack={onClickBack} />

      { loading &&
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      }
      
      { error &&
        <div className={styles.errorContainer}>
          <div>{error}</div>
        </div>
      }

      { requestCards &&
        <div className={styles.cardsContainer}>
          <TransitionGroup>
            {requestCards}
          </TransitionGroup>
        </div>
      }

    </FlexContainer>
  );

}

export default ManageRequests;