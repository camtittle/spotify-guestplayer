import { Role } from "../api/models/role";

export interface Party {
  id: string;
  name: string;
  guestCount: number;
  token: string;
  role: Role;
}