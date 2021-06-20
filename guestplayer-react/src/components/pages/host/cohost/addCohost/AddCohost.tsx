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
import { ToastContext } from '../../../../../contexts/toastContext';
import { ToastStyle } from '../../../../shared/toast/Toast';
import Dialog from '../../../../shared/dialog/Dialog';

const AddCohost = () => {

  const history = useHistory();
  const [qrCodeSrc, setQrCodeSrc] = useState<string>();
  const [joinLink, setJoinLink] = useState('');
  const shareLinkRef = useRef<HTMLInputElement>(null);
  const { party } = useContext(PartyContext);
  const { showToast }= useContext(ToastContext);
  const handleApiError = useApiErrorHandler();
  const generateLinkDialogRef = useRef<Dialog>(null);

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

  const onClickShare = async () => {
    generateLinkDialogRef.current?.show();
  };

  const onClickBack = () => {
    history.push('/party/host');
  }

  const onConfirmGenerateLink = async () => {
    generateLinkDialogRef.current?.hide();
    if (!party) {
      return;
    }

    if (navigator.share !== undefined) {
      // Web Share API is supported
      await navigator.share({
        title: 'Join ' + party.name + ' on GuestPlayer',
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
            <p>This QR code gives Co-hosts the power to accept and reject song requests</p>
            <Button className={styles.inviteGuestsLink} style={ButtonStyle.WhitePrimary} size={ButtonSize.Medium} onClick={navigateHome}>Invite guests instead</Button>
          </div>
        </div>

        <div className={styles.qrContainer}>
          <div className={styles.qrCode}>
            <img className={qrCodeSrc ? styles.loaded : undefined} src={qrCodeSrc}></img>
          </div>
          <p>A new QR code is generated after each Co-host joins</p>
        </div>

        <ActionBar>
          <div className={styles.actionBarContainer}>
            <Button style={ButtonStyle.WhiteSecondary} icon={ShareIcon} onClick={onClickShare}>Share Co-host link</Button>
          </div>
        </ActionBar>

        <input className={styles.shareLinkInput} type="text" ref={shareLinkRef} value={joinLink} readOnly />

      </FlexContainer>
        
      <Dialog
        title="Co-host Invite Link"
        body="Each link can only be used to add one Co-host. After they join, you can generate a new link to invite another Co-host."
        primaryLabel="OK"
        onClickPrimary={onConfirmGenerateLink}
        ref={generateLinkDialogRef}
      />

    </Fragment>
  )

}

export default AddCohost;