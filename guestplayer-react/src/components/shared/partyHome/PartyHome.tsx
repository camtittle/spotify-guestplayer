import { useContext, useEffect, useRef, useState } from "react";
import { generateJoinUrl, generateQrCode } from "../../../api/services/partyService";
import { PartyContext } from "../../../contexts/partyContext";
import { ActionBar } from "../actionBar/ActionBar";
import { Button, ButtonStyle } from "../button/Button";
import FlexContainer from "../container/FlexContainer";
import { TitleBar } from "../titleBar/TitleBar";
import styles from './PartyHome.module.scss';

export interface PartyHomeProps {
  header: JSX.Element;
  qrLabel: string;
  primaryButton: {
    label: string;
    icon: string;
    onClick: () => void;
  };
  secondaryButton: {
    label: string;
    icon: string;
  }
}

export default function PartyHome(props: PartyHomeProps) {

  const [qrCodeSrc, setQrCodeSrc] = useState<string>();
  const { party } = useContext(PartyContext);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (qrCanvasRef && party?.id) {
      generateQrCode(party.id)
        .then(uri => {
          setQrCodeSrc(uri);
        });
    }
  }, [party?.id, qrCanvasRef]);

  const onClickShare = async () => {
    if (!party) {
      return;
    }

    const url = generateJoinUrl(party.id);
    if (navigator.share !== undefined) {
      // Web Share API is supported
      await navigator.share({
        title: 'Join ' + party.name + ' on GuestPlayer',
        url: url
      });
    } else {
      // Fallback
    }
  }

  return (
    <FlexContainer>
      <TitleBar showMenuButton={true}></TitleBar>

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

          <Button className={styles.topButton} style={ButtonStyle.WhitePrimary} icon={props.primaryButton.icon} onClick={props.primaryButton.onClick} >{props.primaryButton.label}</Button>
          <Button style={ButtonStyle.WhiteSecondary} icon={props.secondaryButton.icon} onClick={onClickShare}>{props.secondaryButton.label}</Button>

        </div>
      </ActionBar>
    </FlexContainer>
  )
}