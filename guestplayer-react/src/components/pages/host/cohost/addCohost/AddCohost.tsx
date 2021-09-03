import { useHistory } from 'react-router';
import { ActionBar } from '../../../../shared/actionBar/ActionBar';
import { Button, ButtonSize, ButtonStyle } from '../../../../shared/button/Button';
import FlexContainer from '../../../../shared/container/FlexContainer';
import { TitleBar } from '../../../../shared/titleBar/TitleBar';
import styles from './AddCohost.module.scss';
import ShareIcon from '../../../../../assets/img/share.svg';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { generateCohostJoinUrl, generateCohostQrCode, generateQrCode, getCohostJoinToken } from '../../../../../api/services/partyService';
import { PartyContext } from '../../../../../contexts/partyContext';
import { useApiErrorHandler } from '../../../../../hooks/apiErrorHandlerHook';
import { ToastContext, useToasts } from '../../../../../contexts/toastContext';
import { ToastStyle } from '../../../../shared/toast/Toast';
import Dialog from '../../../../shared/dialog/Dialog';
import { Role } from '../../../../../api/models/role';

const AddCohost = () => {

  const history = useHistory();
  const [qrCodeSrc, setQrCodeSrc] = useState<string>();
  const [joinLink, setJoinLink] = useState('');
  const shareLinkRef = useRef<HTMLInputElement>(null);
  const { party, partyLoaded } = useContext(PartyContext);
  const showToast = useToasts();
  const handleApiError = useApiErrorHandler();
  const generateLinkDialogRef = useRef<Dialog>(null);

  useEffect(() => {
    if (partyLoaded) {
      if (!party) {
        history.push('/');
      } else if (party.role !== Role.Host) {
        history.push('/');
      }
    }
  }, [party, partyLoaded])

  useEffect(() => {
    if (party?.id) {
      handleApiError(async () => {
        const joinToken = await getCohostJoinToken(party.id);

        const url = generateCohostJoinUrl(party.id, joinToken);
        setJoinLink(url);

        const qrCode = await generateCohostQrCode(party.id, joinToken);
        setQrCodeSrc(qrCode);
      });
    }
  }, [party?.id]);

  const navigateHome = () => {
    history.push('/party/host');
  }

  const onClickBack = () => {
    history.push('/party/host');
  }

  const onClickShare = async () => {
    generateLinkDialogRef.current?.hide();
    if (!party) {
      return;
    }

    if (navigator.share !== undefined) {
      // Web Share API is supported
      await navigator.share({
        title: 'Join ' + party.name + ' on GuestRequest',
        url: joinLink
      });
    } else {
      console.log('share');
      if (shareLinkRef.current) {
        shareLinkRef.current.select();
        document.execCommand("copy");
        showToast({
          style: ToastStyle.Success,
          text: 'Co-host invite link copied to clipboard'
        });
      }
    }
  }

  return (
    <Fragment>
      <FlexContainer>
        <TitleBar showBackButton onClickBack={onClickBack} />

        <div className={styles.container}>
          <h1>Add a Co-host</h1>

          <div className={styles.warning}>
            <h2>Warning</h2>
            <p>Adding a Co-host gives them the power to accept and reject song requests, whereas guests can only request songs.</p>
            <Button className={styles.inviteGuestsLink} style={ButtonStyle.WhitePrimary} size={ButtonSize.Medium} onClick={navigateHome}>Invite guests instead</Button>
          </div>
        </div>

        <div className={styles.qrContainer}>
          <div className={styles.qrCode}>
            <img className={qrCodeSrc ? styles.loaded : undefined} src={qrCodeSrc}></img>
          </div>
          <p>This QR gives Co-hosts the power to approve and reject requests</p>
        </div>

        <ActionBar>
          <div className={styles.actionBarContainer}>
            <Button style={ButtonStyle.WhiteSecondary} icon={ShareIcon} onClick={onClickShare}>Share Co-host link</Button>
          </div>
        </ActionBar>

        <input className={styles.shareLinkInput} type="text" ref={shareLinkRef} value={joinLink} readOnly />

      </FlexContainer>

    </Fragment>
  )

}

export default AddCohost;