import { ActionBar } from '../../../shared/actionBar/ActionBar';
import styles from './Scan.module.scss';
import QrReader from 'react-qr-reader';
import { useEffect, useState } from 'react';
import FlexContainer from '../../../shared/container/FlexContainer';
import BackButton from '../../../shared/backButton/BackButton';
import { useHistory } from 'react-router';

export default function Scan(): JSX.Element {

  const history = useHistory();

  const handleScan = (data: any) => {
    if (data) {
      console.log(data);
      const parts = data.split('/join/');
      if (parts.length === 2) {
        const partyId = parts[1];
        history.push(`/join/${partyId}`);
      }
    }
  }

  const handleError = (err: any) => {
    console.error(err)
  }

  const onClickBack = () => {
    history.push('/');
  }

  return (
    <FlexContainer>
      <BackButton className={styles.back} onClick={onClickBack}></BackButton>

      <h1 className={styles.header}>GuestPlayer</h1>

      <div className={styles.camera}>
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </div>

      <ActionBar >
        <div className={styles.actionBarContainer}>
          <div className={styles.help}>
            <p className={styles.positioningHelp}>Position the QR code inside the box</p>
            <h3 className={styles.linkHelpHeader}>Not working?</h3>
            <p className={styles.linkHelp}>Don't worry! Ask the host or another party guest to send you an invite link instead</p>
          </div>
        </div>
      </ActionBar>
    </FlexContainer>

  );

}