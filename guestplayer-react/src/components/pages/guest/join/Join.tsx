import { useHistory, useParams } from "react-router-dom";
import styles from './Join.module.scss';
import FlexContainer from "../../../shared/container/FlexContainer";
import BackButton from "../../../shared/backButton/BackButton";
import { ActionBar } from "../../../shared/actionBar/ActionBar";
import { Button, ButtonStyle } from "../../../shared/button/Button";
import MusicalNoteIcon from '../../../../assets/img/musical-note.svg';
import InformationIcon from '../../../../assets/img/information.svg';
import { useEffect, useState } from "react";
import { getPartySummary } from "../../../../api/services/partyService";
import { PartySummary } from "../../../../models/PartySummary";
import LoadingSpinner from "../../../shared/loadingSpinner/LoadingSpinner";
import { CSSTransition } from "react-transition-group";
import './JoinTransitions.scss';

interface JoinParams {
  id: string;
}

enum LoadingState {
  Loading,
  Error,
  Loaded
}

export default function Join(): JSX.Element {

  const { id } = useParams<JoinParams>();
  const history = useHistory();
  const [party, setParty] = useState<PartySummary>();
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.Loading);

  useEffect(() => {
    getPartySummary(id).then((party) => {
      setParty(party);
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

  return (
    <FlexContainer className={styles.container}>

      <BackButton className={styles.back} onClick={onClickBack}></BackButton>

      <h1 className={styles.header}>GuestPlayer</h1>

      <CSSTransition in={loadingState === LoadingState.Loaded} timeout={500} classNames="details" mountOnEnter>
        <div className={styles.details}>
          <p>Join</p>
          <h2>{party?.name}</h2>
          <p>to start requesting songs</p>
        </div>
      </CSSTransition>

      {loadingState === LoadingState.Error &&
        <div className={styles.details}>
          <h2>:(</h2>
          <p>Something went wrong finding that party. Please try again.</p>
        </div>
      }

      {loadingState === LoadingState.Loading &&
        <div className={styles.details}>
          <LoadingSpinner></LoadingSpinner>
        </div>
      }

      <CSSTransition in={loadingState === LoadingState.Loaded} classNames="action-bar" timeout={500} mountOnEnter>
        <ActionBar>
          <div className={styles.actionBarContainer}>
            <div>
              <Button style={ButtonStyle.WhitePrimary} icon={MusicalNoteIcon} iconAltText="Musical notes">Join party</Button>
              <div className={styles.spacer}></div>
              <Button style={ButtonStyle.WhiteSecondary} icon={InformationIcon} iconAltText="Information">How does it work?</Button>
            </div>
          </div>
        </ActionBar>
      </CSSTransition>

    </FlexContainer>
  );

}