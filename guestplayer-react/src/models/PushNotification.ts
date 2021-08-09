export enum NotificationType {
  TrackRequest = 'TrackRequest'
}

export interface PushNotification<TData> {
  type: NotificationType;
  data: TData;
}