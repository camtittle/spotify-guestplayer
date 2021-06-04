import { Track } from "./Track";

export interface TrackRequest {
  id: string;
  createdAt: Date;
  track: Track;
}