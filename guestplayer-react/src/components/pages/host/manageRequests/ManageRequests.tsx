import { useContext, useEffect, useRef, useState } from 'react';
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
import { ToastStyle } from '../../../shared/toast/Toast';
import { ErrorCode } from '../../../../api/error/ErrorCodes';
import { Subscription } from '../../../../api/services/websocketService';
import { useApiErrorHandler } from '../../../../hooks/apiErrorHandlerHook';
import Dialog from '../../../shared/dialog/Dialog';
import { Page } from '../../../shared/page/Page';

const ManageRequests = () => {

  const { party, partyLoaded } = useContext(PartyContext);
  const handleApiError = useApiErrorHandler();
  const { showToast }= useContext(ToastContext);
  const [trackRequests, setTrackRequests] = useState<TrackRequest[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const history = useHistory();
  const deviceErrorDialogRef = useRef<Dialog>(null);

  useEffect(() => {
    if (!party && partyLoaded) {
      history.push('/');
    }
  }, [party, partyLoaded]);

  useEffect(() => {
    let trackRequestSubscription: Subscription;

    if (party) {
      handleApiError(async () => {
        const trackRequests = await getTrackRequests();
        setTrackRequests(trackRequests);
        setLoading(false);

        subscribeToTrackRequests(party.token, (request) => {
          setTrackRequests((requests) => {
            const existingRequests = requests || [];
            return existingRequests.concat([request]);
          });
        }).then(subscription => {
          trackRequestSubscription = subscription;
        });
      }).catch((e) => {
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

  const showActiveDeviceErrorDialog = () => {
    showToast(undefined);
    deviceErrorDialogRef.current?.show();
  }

  const dismissDeviceErrorDialog = () => {
    deviceErrorDialogRef.current?.hide();
  };

  const onClickTrash = (requestToDelete: TrackRequest) => {
    if (!trackRequests || !party) {
      return;
    }

    // Remove it pre-emptively
    let index = trackRequests?.indexOf(requestToDelete);
    trackRequests.splice(index, 1);
    setTrackRequests(trackRequests.slice());
    showToast({
      style: ToastStyle.Loading,
      text: 'Deleting track request'
    });
    
    deleteTrackRequest(requestToDelete).then(() => {
      showToast({
        style: ToastStyle.Success,
        text: 'Track request deleted'
      });
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
      showToast({
        style: ToastStyle.Error,
        text: 'Failed to delete track request'
      });
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
    showToast({
      style: ToastStyle.Loading,
      text: 'Playing track'
    });
    
    acceptTrackRequest(requestToPlay, 'play').then(() => {
      showToast({
        style: ToastStyle.Success,
        text: 'Track played succesfully'
      });
    }).catch((e) => {
      console.error(e);
      if (e.errorCode === ErrorCode.ActivePlayerDeviceNotFound) {
        showActiveDeviceErrorDialog();
      } else {
        showToast({
          style: ToastStyle.Error,
          text: 'Failed to play track'
        });
      }

      // Failed to delete, so add it back to the list
      setTrackRequests(requests => {
        if (!requests) {
          return;
        }
        requests.splice(index, 0, requestToPlay);
        return requests.slice();
      });
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
    showToast({
      style: ToastStyle.Loading,
      text: 'Queueing track'
    });
    
    acceptTrackRequest(requestToPlay, 'queue').then(() => {
      showToast({
        style: ToastStyle.Success,
        text: 'Track queued succesfully'
      });
    }).catch((e) => {
      if (e.errorCode === ErrorCode.ActivePlayerDeviceNotFound) {
        showActiveDeviceErrorDialog();
      } else {
        showToast({
          style: ToastStyle.Error,
          text: 'Failed to queue track'
        });
      }

      // Failed to delete, so add it back to the list
      setTrackRequests(requests => {
        if (!requests) {
          return;
        }
        requests.splice(index, 0, requestToPlay);
        return requests.slice();
      });
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
    <Page onClickBack={onClickBack}>

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

      { requestCards && requestCards.length < 1 &&
        <div className={styles.errorContainer}>
          <div>No requests</div>
        </div>
      }

      { requestCards &&
        <div className={styles.cardsContainer}>
          <TransitionGroup>
            {requestCards}
          </TransitionGroup>
        </div>
      }
            
      <Dialog
        title="No device found"
        body="We couldn't find a device currently playing music on your Spotify account. Start playing music on your device and try again."
        primaryLabel="OK"
        onClickPrimary={dismissDeviceErrorDialog}
        ref={deviceErrorDialogRef}
      />

    </Page>
  );

}

export default ManageRequests;