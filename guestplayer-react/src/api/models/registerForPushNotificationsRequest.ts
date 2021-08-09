export interface RegisterForPushNotificationsRequest {
  subscription: {
    endpoint?: string;
    keys?: {
      auth: string;
      p256dh: string;
    }
  }
}