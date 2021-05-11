import { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { PartyContext } from "../../../../contexts/partyContext";
import PartyHome from "../../../shared/partyHome/PartyHome";
import styles from './HostHome.module.scss';
import MusicalNotes from '../../../../assets/img/musical-note.svg';
import Share from '../../../../assets/img/share.svg';
import { Role } from "../../../../api/models/role";

export default function HostHome() {

  const { party, partyLoaded } = useContext(PartyContext);
  const history = useHistory();

  useEffect(() => {
    console.log({ party });
    if (partyLoaded) {
      console.log('loaded');
      if (!party) {
        history.push('/');
      } else if (party.role === Role.Guest) {
        history.push('/party/guest')
      }
    }
  }, [party, partyLoaded, history]);

  if (!partyLoaded) {
    return null;
  }

  const header = (
    <div className={styles.header}>
      <p>Hosting</p>  
      <h1>{party?.name}</h1>
    </div>
  );

  const qrLabel = 'Guests can scan QR to join';

  const primaryButton = {
    label: 'View requests',
    icon: MusicalNotes,
    onClick: () => { }
  };

  const secondaryButton = {
    label: 'Share party link',
    icon: Share
  };

  return (
    <PartyHome header={header} qrLabel={qrLabel} primaryButton={primaryButton} secondaryButton={secondaryButton}></PartyHome>
  )
}