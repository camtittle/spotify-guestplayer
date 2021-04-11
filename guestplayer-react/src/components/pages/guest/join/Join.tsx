import { useHistory, useParams } from "react-router-dom";
import styles from './Join.module.scss';
import FlexContainer from "../../../shared/container/FlexContainer";
import BackButton from "../../../shared/backButton/BackButton";
import { ActionBar } from "../../../shared/actionBar/ActionBar";
import { Button, ButtonStyle } from "../../../shared/button/Button";
import MusicalNoteIcon from '../../../../assets/img/musical-note.svg';
import InformationIcon from '../../../../assets/img/information.svg';

interface JoinParams {
  id: string;
}

export default function Join(): JSX.Element {

  const { id } = useParams<JoinParams>();
  const history = useHistory();

  const partyName = 'Cameron\'s party';

  const onClickBack = () => {
    history.push('/');
  };

  return (
    <FlexContainer>

      <BackButton className={styles.back} onClick={onClickBack}></BackButton>

      <h1 className={styles.header}>GuestPlayer</h1>

      <ActionBar fillHeight={true}>
        <div className={styles.actionBarContainer}>
          <div className={styles.partyDetails}>
            <p>Join</p>
            <h2>{partyName}</h2>
            <p>to start requesting songs</p>
          </div>

          <div>
            <Button style={ButtonStyle.WhitePrimary} icon={MusicalNoteIcon} iconAltText="Musical notes">Join party</Button>
            <div className={styles.spacer}></div>
            <Button style={ButtonStyle.WhiteSecondary} icon={InformationIcon} iconAltText="Information">How does it work?</Button>
          </div>

        </div>
      </ActionBar>

    </FlexContainer>
  );

}