import { useEffect, useState } from "react";
import { SpotifyCredentials } from "../../../../../models/SpotifyCredentials";
import { SpotifyProfile } from "../../../../../models/SpotifyProfile";
import * as SpotifyService from '../../../../../api/services/spotifyService';
import styles from '../CreateParty.module.scss';
import greenTick from '../../../../../assets/img/checked.svg';

interface SpotifyProfileDetailsProps {
  token?: SpotifyCredentials;
  onClickLoginAsSomeoneElse: () => void;
};

export const SpotifyProfileDetails = (props: SpotifyProfileDetailsProps) => {

  const [profile, setProfile] = useState<SpotifyProfile>();

  useEffect(() => {
    if (props.token) {
      SpotifyService.getProfile().then(profile => {
        setProfile(profile);
      });
    }
  }, [props.token]);

  const profileDetails = (
    <div>
      <div className={styles.connectedSuccess}>
        <img src={greenTick} />
        <p>Connected to Spotify</p>
      </div>
      <div className={styles.profileDetails}>
        <img src={profile?.image} alt="Profile picture" />
        <p>{profile?.name}</p>
      </div>
      <a href="#" className={styles.notYouLink} onClick={props.onClickLoginAsSomeoneElse}>Not you? Log in as someone else</a>
    </div>
  );

  return props.token ? profileDetails : null;
}