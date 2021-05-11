import {ActionBar} from '../../shared/actionBar/ActionBar';
import { Button, ButtonStyle } from '../../shared/button/Button';
import styles from './Home.module.scss';
import cameraIcon from './../../../assets/img/camera.svg';
import balloonsIcon from './../../../assets/img/balloons.svg';
import { useHistory } from "react-router-dom";
import FlexContainer from '../../shared/container/FlexContainer';
import { CSSTransition  } from 'react-transition-group'
import './HomeTransitions.scss';
import { useContext, useEffect } from 'react';
import { PartyContext } from '../../../contexts/partyContext';
import { Role } from '../../../models/Role';

export default function Home() {

  const history = useHistory();
  const { party } = useContext(PartyContext);

  useEffect(() => {
    if (party) {
      if (party.role === Role.Guest) {
        history.push('/party/guest')
      } else if (party.role === Role.Host) {
        history.push('/party/host')
      }
    }
  }, [party]);

  const onClickScan = () => {
    history.push('/scan');
  }

  const onClickCreateParty = () => {
    history.push('/party/create');
  }

  return (
    <FlexContainer className={styles.container}>
      <h1 className={styles.header}>GuestPlayer</h1>

      <div className={styles.howTo}>
        <h2>How it works</h2>

        
        <CSSTransition classNames="step1" in={true} timeout={1000} appear={true}>
          <div>
            <h3>
              <span className={styles.stepNumber}>1</span>
              <span>Join the party</span>
            </h3>
            <p key="p">Scan the host's QR code or tap the link they shared with you</p>
          </div>
        </CSSTransition>

        
        <CSSTransition classNames="step2" in={true} timeout={1300} appear={true}>
          <div>
            <h3><span className={styles.stepNumber}>2</span> Request songs</h3>
            <p>The host can choose to add your request to the queue or play it now</p>
          </div>
        </CSSTransition>
      </div>
      
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