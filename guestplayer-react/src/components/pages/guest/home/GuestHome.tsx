import { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { PartyContext } from "../../../../contexts/partyContext";
import PartyHome from "../../../shared/partyHome/PartyHome";
import styles from './GuestHome.module.scss';
import MusicalNotes from '../../../../assets/img/musical-note.svg';
import Share from '../../../../assets/img/share.svg';
import { Role } from "../../../../api/models/role";

export default function GuestHome() {

  const { party, partyLoaded } = useContext(PartyContext);
  const history = useHistory();

  useEffect(() => {
    if (partyLoaded) {
      if (!party) {
        history.push('/');
      } else if (party.role === Role.Host) {
        history.push('/party/host');
      }
    }
  }, [party, partyLoaded, history]);

  if (!partyLoaded) {
    return null;
  }

  const onClickPrimaryButton = () => {
    history.push('/party/guest/request');
  }

  const header = (
    <div className={styles.header}>
      <p>You're in</p>  
      <h1>{party?.name}</h1>
    </div>
  );

  const qrLabel = 'Other guests can scan QR to join';

  const primaryButton = {
    label: 'Request a song',
    icon: MusicalNotes,
    onClick: onClickPrimaryButton
  };

  const secondaryButton = {
    label: 'Share party link',
    icon: Share
  };

  return (
    <PartyHome header={header} qrLabel={qrLabel} primaryButton={primaryButton} secondaryButton={secondaryButton}></PartyHome>
  )
}