import { Fragment, useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router";
import { PartyContext } from "../../../../contexts/partyContext";
import PartyHome from "../../../shared/partyHome/PartyHome";
import styles from './GuestHome.module.scss';
import MusicalNotes from '../../../../assets/img/musical-note.svg';
import Share from '../../../../assets/img/share.svg';
import { Role } from "../../../../api/models/role";
import { MenuItem } from "../../../shared/titleBar/menu/Menu";
import LogoutIcon from '../../../../assets/img/logout.svg';
import MusicalNotesWhite from '../../../../assets/img/musical-note-white.svg';
import Dialog from "../../../shared/dialog/Dialog";
import { leaveParty } from "../../../../api/services/partyService";
import { useApiErrorHandler } from "../../../../hooks/apiErrorHandlerHook";

export default function GuestHome() {

  const { party, partyLoaded, setParty } = useContext(PartyContext);
  const handleApiError = useApiErrorHandler();
  const history = useHistory();
  const leavePartyDialogRef = useRef<Dialog>(null);

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

  const menuItems: MenuItem[] = [
    {
      label: 'My requests',
      icon: MusicalNotesWhite,
      onClick: () => {
        history.push('/party/guest/requests')
      }
    },
    {
      label: 'Leave party',
      icon: LogoutIcon,
      onClick: () => {
        leavePartyDialogRef.current?.show();
      }
    }
  ];

  const onConfirmLeaveParty = async () => {
    if (!party) {
      throw new Error('Cannot end party - party context is null');
    }

    leavePartyDialogRef.current?.hide();
    setParty(undefined);
    handleApiError(async () => {
      await leaveParty();
    });
  }

  return (
    <Fragment>
      <PartyHome header={header} qrLabel={qrLabel} primaryButton={primaryButton} secondaryButton={secondaryButton} menuItems={menuItems}></PartyHome>
      
      <Dialog
        title="Leave party?"
        body="You will no longer be able to request songs at this party."
        primaryLabel="Leave party"
        onClickPrimary={onConfirmLeaveParty}
        secondaryLabel="Cancel"
        onClickSecondary={() => leavePartyDialogRef.current?.hide()}
        ref={leavePartyDialogRef}
      />
    </Fragment>
  )
}