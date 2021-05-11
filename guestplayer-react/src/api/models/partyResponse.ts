import { Role } from "./role";

export interface PartyResponse {
  id: string;
  name: string;
  guestCount: number;
  token: string;
  role: Role;
}