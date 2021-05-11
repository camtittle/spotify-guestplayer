import { Track } from '../../../models/Track';
import styles from './TrackListItem.module.scss';

interface TrackListItemProps {
  track: Track;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

const TrackListItem = (props: TrackListItemProps) => {

  const classNames = [styles.container, props.className];
  if (props.clickable) {
    classNames.push(styles.clickable);
  }

  return (
    <button className={classNames.join(' ')} onClick={props.onClick}>
      <img className={styles.artwork} src={props.track.artworkUrl} />
      <div className={styles.metadata}>
        <div className={styles.title}>{props.track.title}</div>
        <div className={styles.subtitle}>{props.track.artist}<span className={styles.separator}></span>{props.track.album}</div>
      </div>
    </button>
  )
};

export default TrackListItem;