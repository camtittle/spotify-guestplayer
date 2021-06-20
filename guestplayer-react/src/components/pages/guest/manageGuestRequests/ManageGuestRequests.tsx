import { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { PartyContext } from "../../../../contexts/partyContext";
import { useApiErrorHandler } from "../../../../hooks/apiErrorHandlerHook";
import { TrackRequest } from "../../../../models/TrackRequest";
import FlexContainer from "../../../shared/container/FlexContainer";
import LoadingSpinner from "../../../shared/loadingSpinner/LoadingSpinner";
import { TitleBar } from "../../../shared/titleBar/TitleBar";
import TrackListItem from "../../../shared/trackListItem/TrackListItem";
import * as RequestService from '../../../../api/services/requestService';
import styles from './ManageGuestRequests.module.scss';

const ManageGuestRequests = () => {

  const { party, partyLoaded } = useContext(PartyContext);
  const handleApiError = useApiErrorHandler();
  const [trackRequests, setTrackRequests] = useState<TrackRequest[]>();
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (!party && partyLoaded) {
      history.push('/');
    }
  }, [party, partyLoaded]);

  useEffect(() => {
    if (party) {
      handleApiError(async () => {
        try {
          const trackRequests = await RequestService.getGuestTrackRequests();
          setTrackRequests(trackRequests);
        } finally {
          setLoading(false);
        }
      });
    }
  }, [party]);

  let requestCards: JSX.Element[] | null = null;
  if (trackRequests) {
    requestCards = trackRequests.map(request => (
      <CSSTransition timeout={{appear: 400, enter: 400, exit: 300}} key={request.id} enter appear classNames={{
        appear: styles.fadeAppear,
        appearActive: styles.fadeAppearActive,
        exit: styles.slideExit,
        exitActive: styles.slideExitActive
      }}>
        <div className={styles.requestCard}>
          <TrackListItem track={request.track} className={styles.trackListItem} />
          {/* <div className={styles.buttonsContainer}>
            <button className={styles.trashButton} onClick={() => onClickTrash(request)} />
          </div> */}
        </div>
      </CSSTransition>
    ))
  }

  return (
    <FlexContainer>
      <TitleBar showBackButton />
      
      { loading &&
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      }

      { requestCards &&
        <Fragment>
        
          <div className={styles.help}>
            <h2>My requests</h2>
            <p>These are pending requests which have not yet been accepted or rejected. You can have up to 5 pending requests at a time.</p>
          </div>

          <div className={styles.cardsContainer}>
            <TransitionGroup>
              {requestCards}
            </TransitionGroup>
          </div>
        
        </Fragment>
      }

    </FlexContainer>
  )


}

export default ManageGuestRequests;