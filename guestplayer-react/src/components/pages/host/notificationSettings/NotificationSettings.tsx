import { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { PartyContext } from "../../../../contexts/partyContext";
import { Role } from "../../../../api/models/role";
import { useApiErrorHandler } from "../../../../hooks/apiErrorHandlerHook";
import { pushNotificationSetting } from "../../../../models/PushNotificationSetting";
import { registerForPush, unregisterPush, requestPushSubscription } from "../../../../api/services/pushNotificationService";
import { useToasts } from "../../../../contexts/toastContext";
import { ToastStyle } from "../../../shared/toast/Toast";
import FlexContainer from "../../../shared/container/FlexContainer";
import { TitleBar } from "../../../shared/titleBar/TitleBar";
import styles from './NotificationSettings.module.scss';
import { Button, ButtonSize, ButtonStyle } from "../../../shared/button/Button";

export default function NotificationSettings() {

  const { party, partyLoaded, setParty } = useContext(PartyContext);
  const showToast = useToasts();
  const history = useHistory();
  const handleApiError = useApiErrorHandler();

  useEffect(() => {
    if (partyLoaded) {
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
  
  const enablePushNotifications = async () => {
    const subscription = await requestPushSubscription();

    if (subscription) {
      handleApiError(async () => {
        await registerForPush(subscription);
        showToast({
          style: ToastStyle.Success,
          text: 'Push notifications enabled'
        });

        if (party) {
          setParty({
            ...party,
            pushNotificationSetting: pushNotificationSetting.Enabled
          });
        }
      });
    }
  };
  
  const disablePushNotifications = async () => {
    if (!party) {
      return;
    }
    handleApiError(async () => {
      await unregisterPush();
      showToast({
        style: ToastStyle.Success,
        text: 'Push notifications disabled'
      });

      if (party) {
        setParty({
          ...party,
          pushNotificationSetting: pushNotificationSetting.Disabled
        });
      }
    });
  };

  const notificationsEnabled = party?.pushNotificationSetting === pushNotificationSetting.Enabled;
  const currentSettingLabel = notificationsEnabled ? 'on' : 'off';
  const buttonLabel = notificationsEnabled ? 'Turn off' : 'Turn on';
  const buttonOnClick = notificationsEnabled ? disablePushNotifications : enablePushNotifications;
  const buttonStyle = notificationsEnabled ? ButtonStyle.WhiteSecondary : ButtonStyle.GreenPrimary;

  return (
    <FlexContainer>
      <TitleBar showBackButton />

      <div className={styles.container}>
        <h1 className={styles.title}>Notification settings</h1>
        <p className={styles.description}>GuestRequest can send you notifications when you receive a new track request so you never miss a request.</p>

        <div className={styles.setting}>
          <p>Push notifications are <b>{currentSettingLabel}</b></p>
          <Button className={styles.button} style={buttonStyle} size={ButtonSize.Medium} onClick={buttonOnClick}>{buttonLabel}</Button>
        </div>
      </div>
    </FlexContainer>
  )
}