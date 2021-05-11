import { useHistory, useParams } from "react-router-dom";
import styles from './Join.module.scss';
import FlexContainer from "../../../shared/container/FlexContainer";
import BackButton from "../../../shared/backButton/BackButton";
import { ActionBar } from "../../../shared/actionBar/ActionBar";
import { Button, ButtonStyle } from "../../../shared/button/Button";
import MusicalNoteIcon from '../../../../assets/img/musical-note.svg';
import InformationIcon from '../../../../assets/img/information.svg';
import { useContext, useEffect, useState } from "react";
import { getPartySummary, joinParty } from "../../../../api/services/partyService";
import { PartySummary } from "../../../../models/PartySummary";
import LoadingSpinner from "../../../shared/loadingSpinner/LoadingSpinner";
import { CSSTransition } from "react-transition-group";
import './JoinTransitions.scss';
import Tick from '../../../../assets/img/tick.svg';
import { PartyContext } from "../../../../contexts/partyContext";

interface JoinParams {
  id: string;
}

enum LoadingState {
  Loading,
  Error,
  Loaded,
  Joining,
  Joined
}

export default function Join(): JSX.Element {

  const { id } = useParams<JoinParams>();
  const history = useHistory();
  const [partyToJoin, setPartyToJoin] = useState<PartySummary>();
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);
  const { party, setParty } = useContext(PartyContext);

  useEffect(() => {
    getPartySummary(id).then((party) => {
      setPartyToJoin(party);
      setTimeout(() => {
        setLoadingState(LoadingState.Loaded);
      }, 1000);
    }).catch((e) => {
      console.error(e)
      setLoadingState(LoadingState.Error);
    });

  }, [id]);

  const onClickBack = () => {
    history.push('/');
  };

  const onJoined = () => {
    setLoadingState(LoadingState.Joined);
    setTimeout(() => {
      history.push('/party/guest');
    }, 1000);
  }

  const onClickJoin = () => {
    if (partyToJoin?.id) {
      setLoadingState(LoadingState.Joining);
      setTimeout(() => {
        joinParty(partyToJoin.id).then((party) => {
          setParty(party);
          onJoined();
        });
      }, 1000);
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
            <p>Join</p>
            <h2>{partyToJoin?.name}</h2>
            <p>to start requesting songs</p>
          </div>
        </CSSTransition>

        {loadingState === LoadingState.Error &&
          <div className={styles.detailsInner}>
            <h2>:(</h2>
            <p>Something went wrong finding that party. Please try again.</p>
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
              <Button style={ButtonStyle.WhitePrimary} icon={MusicalNoteIcon} iconAltText="Musical notes" onClick={onClickJoin}>Join party</Button>
              <div className={styles.spacer}></div>
              <Button style={ButtonStyle.WhiteSecondary} icon={InformationIcon} iconAltText="Information">How does it work?</Button>
            </div>
          </div>
        </ActionBar>
      </CSSTransition>

    </FlexContainer>
  );

}