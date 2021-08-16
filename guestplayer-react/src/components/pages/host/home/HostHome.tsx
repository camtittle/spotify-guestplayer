import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { PartyContext } from "../../../../contexts/partyContext";
import PartyHome from "../../../shared/partyHome/PartyHome";
import styles from './HostHome.module.scss';
import MusicalNotes from '../../../../assets/img/musical-note.svg';
import LogoutIcon from '../../../../assets/img/logout.svg';
import UserIcon from '../../../../assets/img/user.svg';
import SettingsIcon from '../../../../assets/img/settings.svg';
import Share from '../../../../assets/img/share.svg';
import { Role } from "../../../../api/models/role";
import { getTrackRequestCount, subscribeToTrackRequests, unsubscribeFromTrackRequests } from "../../../../api/services/requestService";
import { Subscription } from "../../../../api/services/websocketService";
import { MenuItem } from "../../../shared/titleBar/menu/Menu";
import Dialog from "../../../shared/dialog/Dialog";
import { endParty, leaveParty } from "../../../../api/services/partyService";
import { useApiErrorHandler } from "../../../../hooks/apiErrorHandlerHook";
import { pushNotificationSetting } from "../../../../models/PushNotificationSetting";
import { urlBase64ToUint8Array } from "../../../../util/base64Utils";
import { browserSupportsNotifications, registerForPush } from "../../../../api/services/pushNotificationService";
import { ToastContext } from "../../../../contexts/toastContext";
import { ToastStyle } from "../../../shared/toast/Toast";

export default function HostHome() {

  const { party, partyLoaded, setParty } = useContext(PartyContext);
  const { showToast } = useContext(ToastContext);
  const [role, setRole] = useState<Role>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [requestCount, setRequestCount] = useState<number>(0);
  const history = useHistory();
  const endPartyDialogRef = useRef<Dialog>(null);
  const leavePartyDialogRef = useRef<Dialog>(null);
  const pushNotificationsDialogRef = useRef<Dialog>(null);
  const handleApiError = useApiErrorHandler();
  const [pushNotificationLoading, setPushNotificationLoading] = useState(false);
  const [supportsPushNotifs, setSupportsPushNotifs] = useState(false);

  useEffect(() => {

    let trackRequestsSubscription: Subscription;

    if (partyLoaded) {
      if (!party) {
        history.push('/');
      } else if (party.role === Role.Guest) {
        history.push('/party/guest')
      } else {
        setRole(party.role);
        handleApiError(async () => {
          trackRequestsSubscription = await subscribeToTrackRequests(party.token, (request) => {
            setRequestCount((count) => {
              return count + 1;
            })
          });

          const count = await getTrackRequestCount();
          setRequestCount(count);
        });
      }
    }

    return () => {
      if (trackRequestsSubscription) {
        unsubscribeFromTrackRequests(trackRequestsSubscription);
      }
    }
  }, [party, partyLoaded, history]);

  useEffect(() => {
    const shouldShowPushNotificationDialog = party && partyLoaded && (party.role === Role.Host || party.role === Role.Cohost) && !party.pushNotificationSetting;
    if (shouldShowPushNotificationDialog) {
      browserSupportsNotifications().then(() => {
        setSupportsPushNotifs(true);
        pushNotificationsDialogRef.current?.show();
      });
    }
  }, [party, partyLoaded]);

  useEffect(() => {
    const notificationMenuItem = supportsPushNotifs ? {
      label: 'Notification settings',
      icon: SettingsIcon,
      onClick: () => {
        history.push('/party/host/notifications');
      }
    } : undefined;
    
    let items = [];
    if (role === Role.Host) {
      items.push(...[
        {
          label: 'Add Co-host',
          icon: UserIcon,
          onClick: () => {
            history.push('/party/cohost/intro');
          }
        },
        notificationMenuItem,
        {
          label: 'End party',
          icon: LogoutIcon,
          onClick: () => {
            endPartyDialogRef.current?.show();
          }
        }
      ]);
    } else if (role === Role.Cohost) {
      items.push(...[
        notificationMenuItem,
        {
          label: 'Leave party',
          icon: LogoutIcon,
          onClick: () => {
            leavePartyDialogRef.current?.show();
          }
        }
      ]);
    }

    setMenuItems(items.filter(x => x !== undefined) as MenuItem[]);
  }, [role, supportsPushNotifs]);

  if (!partyLoaded) {
    return null;
  }

  const header = (
    <div className={styles.header}>
      <p>{role === Role.Host ? 'Hosting' : 'Co-hosting'}</p>
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

  const onConfirmEndParty = async () => {
    if (!party) {
      throw new Error('Cannot end party - party context is null');
    }

    endPartyDialogRef.current?.hide();
    setParty(undefined);
    await endParty();
  };

  const onConfirmLeaveParty = async () => {
    if (!party) {
      throw new Error('Cannot end party - party context is null');
    }

    leavePartyDialogRef.current?.hide();
    setParty(undefined);
    handleApiError(async () => {
      await leaveParty();
    });
  };
  
  const onConfirmEnablePushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

    setPushNotificationLoading(true);

    const registration = await navigator.serviceWorker.ready;
    // Subscribe to push notifications
    const publicVapidKey = process.env.REACT_APP_PUSH_PUBLIC_KEY as string;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

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
      
      setPushNotificationLoading(false);
      pushNotificationsDialogRef.current?.hide();
    }
  };
  
  const onRejectPushNotifications = async () => {
    if (!party) {
      return;
    }
    setParty({
      ...party,
      pushNotificationSetting: pushNotificationSetting.Disabled
    });
    pushNotificationsDialogRef.current?.hide();
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
      
      <Dialog
        title="Leave party?"
        body="You will no longer be able to request songs at this party."
        primaryLabel="Leave party"
        onClickPrimary={onConfirmLeaveParty}
        secondaryLabel="Cancel"
        onClickSecondary={() => leavePartyDialogRef.current?.hide()}
        ref={leavePartyDialogRef}
      />
      
      <Dialog
        title="Enable push notifications?"
        body="Receive notifications when a guest requests a track so you never miss a request."
        primaryLabel="Enable notifications"
        onClickPrimary={onConfirmEnablePushNotifications}
        secondaryLabel="Cancel"
        onClickSecondary={onRejectPushNotifications}
        loading={pushNotificationLoading}
        ref={pushNotificationsDialogRef}
      />
    </Fragment>
  )
}