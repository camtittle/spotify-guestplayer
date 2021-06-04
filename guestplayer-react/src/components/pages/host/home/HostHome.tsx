import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { PartyContext } from "../../../../contexts/partyContext";
import PartyHome from "../../../shared/partyHome/PartyHome";
import styles from './HostHome.module.scss';
import MusicalNotes from '../../../../assets/img/musical-note.svg';
import LogoutIcon from '../../../../assets/img/logout.svg';
import Share from '../../../../assets/img/share.svg';
import { Role } from "../../../../api/models/role";
import { getTrackRequestCount, subscribeToTrackRequests, unsubscribeFromTrackRequests } from "../../../../api/services/requestService";
import { Subscription } from "../../../../api/services/websocketService";
import { MenuItem } from "../../../shared/titleBar/menu/Menu";
import Dialog from "../../../shared/dialog/Dialog";
import { endParty } from "../../../../api/services/partyService";

export default function HostHome() {

  const { party, partyLoaded, setParty } = useContext(PartyContext);
  const [requestCount , setRequestCount] = useState<number>(0);
  const history = useHistory();
  const endPartyDialogRef = useRef<Dialog>(null);

  useEffect(() => {

    let trackRequestsSubscription: Subscription;

    if (partyLoaded) {
      if (!party) {
        history.push('/');
      } else if (party.role === Role.Guest) {
        history.push('/party/guest')
      } else {
        trackRequestsSubscription = subscribeToTrackRequests(party.token, (request) => {
          setRequestCount((count) => {
            return count + 1;
          })
        });

        getTrackRequestCount(party.token).then(count => {
          setRequestCount(count);
        }).catch(e => {
          console.log(e);
        });
      }
    }

    return () => {
      if (trackRequestsSubscription) {
        unsubscribeFromTrackRequests(trackRequestsSubscription);
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
    badge: requestCount,
    onClick: () => {
      history.push('/party/host/requests');
    }
  };

  const secondaryButton = {
    label: 'Share party link',
    icon: Share
  };

  const menuItems: MenuItem[] = [
    {
      label: 'End party',
      icon: LogoutIcon,
      onClick: () => {
        endPartyDialogRef.current?.show();
      }
    }
  ];

  const onConfirmEndParty = async () => {
    if (!party) {
      throw new Error('Cannot end party - party context is null');
    }

    endPartyDialogRef.current?.hide();
    setParty(undefined);
    await endParty(party.token);
  };

  return (
    <Fragment>
      <PartyHome header={header} qrLabel={qrLabel} primaryButton={primaryButton} secondaryButton={secondaryButton} menuItems={menuItems}></PartyHome>

      <Dialog
        title="End party?"
        body="Guests will no longer be able to request tracks but your music will keep playing on Spotify."
        primaryLabel="End party"
        onClickPrimary={onConfirmEndParty}
        secondaryLabel="Cancel"
        onClickSecondary={() => endPartyDialogRef.current?.hide()}
        ref={endPartyDialogRef}
      />
    </Fragment>
  )
}