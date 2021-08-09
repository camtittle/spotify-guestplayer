import { useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import { Role } from '../../../../api/models/role';
import { subscribeToTrackRequests, unsubscribeFromTrackRequests } from '../../../../api/services/requestService';
import { Subscription } from '../../../../api/services/websocketService';
import { PartyContext } from '../../../../contexts/partyContext';
import { useApiErrorHandler } from '../../../../hooks/apiErrorHandlerHook';
import { TrackRequest } from '../../../../models/TrackRequest';
import styles from './TrackRequestNotifications.module.scss';

const TrackRequestNotifications = () => {

  const { party, partyLoaded } = useContext(PartyContext);
  const handleApiError = useApiErrorHandler();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const notification = useRef<TrackRequest>();
  const [visible, setVisible] = useState(false);
  const history = useHistory();

  const duration = 5000;

  useEffect(() => {

    let trackRequestsSubscription: Subscription;

    if (partyLoaded) {
      if (!party || party.role === Role.Guest) {
        return;
      }

      handleApiError(async () => {
        trackRequestsSubscription = await subscribeToTrackRequests(party.token, (request) => {
          if (window.location.pathname.endsWith('requests')) {
            return;
          }

          notification.current = request;
          setVisible(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            setVisible(false);
          }, duration)
        });
      });
    }

    return () => {
      if (trackRequestsSubscription) {
        unsubscribeFromTrackRequests(trackRequestsSubscription);
      }
    }
  }, [party, partyLoaded]);

  const onNotificationClick = () => {
    history.push('/party/host/requests');
    setTimeout(() => {
      setVisible(false);
    }, 300);
  }

  return (
    <CSSTransition in={visible} timeout={300} mountOnEnter unmountOnExit classNames={{
      enter: styles.enter,
      enterActive: styles.enterActive,
      exit: styles.exit,
      exitActive: styles.exitActive
    }}>
      <div className={styles.container}>
        <button className={styles.notification} onClick={onNotificationClick}>
          <img className={styles.image} src={notification.current?.track.artworkUrl} />
          <div className={styles.labels}>
            <h2>New track request</h2>
            <p>Tap to view</p>
          </div>
          <div className={styles.arrow}></div>
        </button>
      </div>
    </CSSTransition>
  )

};

export default TrackRequestNotifications;