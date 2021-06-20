import { useContext, useEffect, useRef, useState } from "react";
import { generateJoinUrl, generateQrCode } from "../../../api/services/partyService";
import { PartyContext } from "../../../contexts/partyContext";
import { ToastContext } from "../../../contexts/toastContext";
import { ActionBar } from "../actionBar/ActionBar";
import { Button, ButtonStyle } from "../button/Button";
import FlexContainer from "../container/FlexContainer";
import { MenuItem } from "../titleBar/menu/Menu";
import { TitleBar } from "../titleBar/TitleBar";
import { ToastStyle } from "../toast/Toast";
import styles from './PartyHome.module.scss';

export interface PartyHomeProps {
  header: JSX.Element;
  qrLabel: string;
  primaryButton: {
    label: string;
    icon: string;
    badge?: string | number;
    onClick: () => void;
  };
  secondaryButton: {
    label: string;
    icon: string;
  };
  menuItems: MenuItem[];
}

export default function PartyHome(props: PartyHomeProps) {

  const [qrCodeSrc, setQrCodeSrc] = useState<string>();
  const [partyJoinUrl, setPartyJoinUrl] = useState<string>('');
  const { party } = useContext(PartyContext);
  const { showToast }= useContext(ToastContext);
  const partyIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (party?.id) {
      generateQrCode(party.id)
        .then(uri => {
          setQrCodeSrc(uri);
        });
    }
  }, [party?.id]);

  useEffect(() => {
    if (!party) {
      return;
    }
    const url = generateJoinUrl(party.id);
    setPartyJoinUrl(url);
  }, [party?.id]);

  const onClickShare = async () => {
    if (!party) {
      return;
    }

    if (navigator.share !== undefined) {
      // Web Share API is supported
      await navigator.share({
        title: 'Join ' + party.name + ' on GuestPlayer',
        url: partyJoinUrl
      });
    } else {
      console.log('share');
      if (partyIdRef.current) {
        partyIdRef.current.select();
        document.execCommand("copy");
        showToast({
          style: ToastStyle.Success,
          text: 'Sharing link copied to clipboard'
        });
      }
    }
  }

  return (
    <FlexContainer>
      <TitleBar showMenuButton={true} menuItems={props.menuItems}></TitleBar>

      <div className={styles.headerContainer}>
        {props.header}
      </div>

      <div className={styles.qrContainer}>
        <div className={styles.qrCode}>
          <img className={qrCodeSrc ? styles.loaded : undefined} src={qrCodeSrc}></img>
        </div>
        <p>{props.qrLabel}</p>
      </div>

      <ActionBar>
        <div className={styles.actionBarContainer}>

          <Button className={styles.topButton} style={ButtonStyle.WhitePrimary} icon={props.primaryButton.icon} onClick={props.primaryButton.onClick} badge={props.primaryButton.badge} >{props.primaryButton.label}</Button>
          <Button style={ButtonStyle.WhiteSecondary} icon={props.secondaryButton.icon} onClick={onClickShare}>{props.secondaryButton.label}</Button>

        </div>
      </ActionBar>

      <input className={styles.partyIdInput} type="text" ref={partyIdRef} value={partyJoinUrl} readOnly />
    </FlexContainer>
  )
}