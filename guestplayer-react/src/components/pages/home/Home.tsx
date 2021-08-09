import {ActionBar} from '../../shared/actionBar/ActionBar';
import { Button, ButtonStyle } from '../../shared/button/Button';
import styles from './Home.module.scss';
import cameraIcon from './../../../assets/img/camera.svg';
import balloonsIcon from './../../../assets/img/balloons.svg';
import { useHistory } from "react-router-dom";
import FlexContainer from '../../shared/container/FlexContainer';
import { useContext, useEffect } from 'react';
import { PartyContext } from '../../../contexts/partyContext';
import { Role } from '../../../models/Role';
import HelpSteps, { HelpStepConfig } from '../../shared/helpSteps/HelpSteps';

const helpSteps: HelpStepConfig[] = [
  {
    header: 'Join the party',
    body: "Scan the host's QR code or tap the link they shared with you"
  },
  {
    header: 'Request songs',
    body: 'The host can choose to add your request to the queue or play it now'
  }
];

export default function Home() {

  const history = useHistory();
  const { party } = useContext(PartyContext);

  useEffect(() => {
    if (party) {
      if (party.role === Role.Guest) {
        history.push('/party/guest');
      } else if (party.role === Role.Host) {
        history.push('/party/host');
      } else if (party.role === Role.Cohost) {
        history.push('/party/cohost');
      }
    }
  }, [party]);

  const onClickScan = () => {
    history.push('/scan');
  }

  const onClickCreateParty = () => {
    history.push('/party/create/intro');
  }

  return (
    <FlexContainer className={styles.container}>
      <h1 className={styles.header}>GuestPlayer</h1>

      <HelpSteps
        title="How it works"
        steps={helpSteps}
      />
      
      <ActionBar>
          <div className={styles.actionBarContainer}>
            <h3>
              Get Started
            </h3>

            <Button style={ButtonStyle.WhitePrimary} icon={cameraIcon} iconAltText="Camera" onClick={onClickScan}>Scan QR code</Button>
            <div className={styles.or}>or</div>
            <Button style={ButtonStyle.WhiteSecondary} icon={balloonsIcon} iconAltText="Balloons" onClick={onClickCreateParty}>Host a party</Button>

          </div>
        </ActionBar>
    </FlexContainer>
  )
}