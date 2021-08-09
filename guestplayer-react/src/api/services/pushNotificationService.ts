import { urlBase64ToUint8Array } from "../../util/base64Utils";
import { RegisterForPushNotificationsRequest } from "../models/registerForPushNotificationsRequest";
import * as ApiService from './apiService';

enum Endpoint {
  Register = '/pushnotifications/register',
  Unregister = '/pushnotifications/unregister'
};

export const browserSupportsNotifications = async (): Promise<boolean> => {
  return 'serviceWorker' in navigator && 'PushManager' in window && !!(await navigator.serviceWorker.ready);
};

export const requestPushSubscription = async (): Promise<PushSubscription | undefined> => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  const registration = await navigator.serviceWorker.ready;
  // Subscribe to push notifications
  const publicVapidKey = process.env.REACT_APP_PUSH_PUBLIC_KEY as string;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  return subscription;
}

export const registerForPush = async (subscription: PushSubscription): Promise<void> => {
  const request: RegisterForPushNotificationsRequest = {
    subscription: subscription.toJSON() as any
  };

  await ApiService.post(Endpoint.Register, request);
};

export const unregisterPush = async (): Promise<void> => {
  await ApiService.post(Endpoint.Unregister);
};