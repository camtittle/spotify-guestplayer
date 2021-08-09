import { useHistory, useParams } from "react-router-dom";
import styles from './Join.module.scss';
import FlexContainer from "../../../shared/container/FlexContainer";
import BackButton from "../../../shared/backButton/BackButton";
import { ActionBar } from "../../../shared/actionBar/ActionBar";
import { Button, ButtonStyle } from "../../../shared/button/Button";
import MusicalNoteIcon from '../../../../assets/img/musical-note.svg';
import InformationIcon from '../../../../assets/img/information.svg';
import { useContext, useEffect, useState } from "react";
import { cohostParty, getPartySummary, joinParty } from "../../../../api/services/partyService";
import { PartySummary } from "../../../../models/PartySummary";
import LoadingSpinner from "../../../shared/loadingSpinner/LoadingSpinner";
import { CSSTransition } from "react-transition-group";
import './JoinTransitions.scss';
import Tick from '../../../../assets/img/tick.svg';
import { PartyContext } from "../../../../contexts/partyContext";
import { useApiErrorHandler } from "../../../../hooks/apiErrorHandlerHook";

interface JoinParams {
  id: string;
  cohostJoinToken: string;
}

interface JoinProps {
  type: 'guest' | 'cohost'
}

enum LoadingState {
  Loading,
  Error,
  Loaded,
  Joining,
  Joined
}

export default function Join({ type }: JoinProps): JSX.Element {

  const { id, cohostJoinToken } = useParams<JoinParams>();
  const history = useHistory();
  const [partyToJoin, setPartyToJoin] = useState<PartySummary>();
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
  const { party, setParty } = useContext(PartyContext);
  const apiErrorHandler = useApiErrorHandler();

  useEffect(() => {
    getPartySummary(id).then((party) => {
      setPartyToJoin(party);
      setLoadingState(LoadingState.Loaded);
    }).catch((e) => {
      console.error(e);
      setLoadingState(LoadingState.Error);
    });

  }, [id]);

  const onClickBack = () => {
    history.push('/');
  };

  const onJoined = () => {
    setLoadingState(LoadingState.Joined);
    setTimeout(() => {
      if (type === 'guest') {
        history.push('/party/guest');
      } else if (type === 'cohost') {
        history.push('/party/cohost');
      }
    }, 1000);
  }

  const joinAsGuest = async (partyId: string) => {
    const party = await joinParty(partyId);
    setParty(party);
    onJoined();
  }

  const joinAsCohost = async (partyId: string) => {
    if (!cohostJoinToken) {
      setLoadingState(LoadingState.Error);
    }
    const party = await cohostParty(partyId, cohostJoinToken);
    setParty(party);
    onJoined();
  }

  const onClickJoin = async () => {
    if (partyToJoin?.id) {
      setLoadingState(LoadingState.Joining);

      apiErrorHandler(async () => {
        try {
          if (type === 'guest') {
            await joinAsGuest(partyToJoin.id);
          } else if (type === 'cohost') {
            await joinAsCohost(partyToJoin.id);
          }
        } catch (e) {
          setLoadingState(LoadingState.Loaded);
          throw e;
        }
      })
    }
  }

  const loadingSpinnerTransition = loadingState === LoadingState.Joined ? 'spinFade' : 'joinFade';

  return (
    <FlexContainer className={styles.container}>

      <BackButton className={styles.back} onClick={onClickBack}></BackButton>

      <h1 className={styles.header}>GuestPlayer</h1>

      <div className={styles.details}>
        <CSSTransition in={loadingState === LoadingState.Loaded} timeout={500} classNames="joinFade" mountOnEnter unmountOnExit>
          <div className={styles.detailsInner}>
            <p>{type === 'cohost' ? 'Co-host' : 'Join'}</p>
            <h2>{partyToJoin?.name}</h2>
            <p>to start {type === 'cohost' ? 'approving and rejecting song requests' : 'requesting songs'}</p>
          </div>
        </CSSTransition>

        {loadingState === LoadingState.Error &&
          <div className={styles.detailsInner}>
            <h2>:(</h2>
            <p>Something went wrong joining that party. Please try again.</p>
          </div>
        }

        <CSSTransition in={loadingState === LoadingState.Loading || loadingState === LoadingState.Joining} timeout={500} classNames={loadingSpinnerTransition} mountOnEnter unmountOnExit>
          <div className={styles.detailsInner}>
            <LoadingSpinner></LoadingSpinner>
          </div>
        </CSSTransition>

        <CSSTransition in={loadingState === LoadingState.Joined} timeout={300} classNames="spinFade" mountOnEnter unmountOnExit>
          <div className={styles.detailsInner}>
            <img className={styles.tick} src={Tick}></img>
          </div>
        </CSSTransition>
      </div>

      <CSSTransition in={loadingState === LoadingState.Loaded} classNames="action-bar" timeout={500} mountOnEnter unmountOnExit>
        <ActionBar>
          <div className={styles.actionBarContainer}>
            <div>
              <Button style={ButtonStyle.WhitePrimary} icon={MusicalNoteIcon} iconAltText="Musical notes" onClick={onClickJoin}>{type === 'cohost' ? 'Co-host party' : 'Join party'}</Button>
              <div className={styles.spacer}></div>
              <Button style={ButtonStyle.WhiteSecondary} icon={InformationIcon} iconAltText="Information">How does it work?</Button>
            </div>
          </div>
        </ActionBar>
      </CSSTransition>

    </FlexContainer>
  );

}