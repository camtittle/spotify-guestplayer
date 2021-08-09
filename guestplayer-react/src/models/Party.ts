import { Role } from "../api/models/role";
import { pushNotificationSetting } from "./PushNotificationSetting";

export interface Party {
  id: string;
  name: string;
  guestCount: number;
  token: string;
  role: Role;
  pushNotificationSetting?: pushNotificationSetting;
}