import { Track } from '../../../models/Track';
import TrackListItem from '../trackListItem/TrackListItem';
import styles from './TrackList.module.scss';
import './TrackListTransitions.scss';
import ReactCSSTransitionReplace from 'react-css-transition-replace';

interface TrackListProps {
  className?: string;
  loading?: boolean;
  tracks?: Track[];
  onClickTrack: (track: Track) => void;
};

const TrackList = (props: TrackListProps) => {

  let tracks;
  const key = props.tracks ? props.tracks.map(x => x.spotifyId).join() : 'key';
  
  if (props.tracks && props.tracks.length > 0) {
    tracks = props.tracks.map(track => {
      return <TrackListItem track={track} key={track.spotifyId} onClick={() => props.onClickTrack(track)} clickable />;
    });
  }

  return (
    <div className={props.className}>
      <ReactCSSTransitionReplace transitionName="fade" transitionEnterTimeout={100} transitionLeaveTimeout={100}>
        <div key={key}>
          {tracks}
        
          <div>
            {props.tracks && props.tracks.length < 1 &&
              <div className={styles.info}>No results</div>
            }
        
            {!props.tracks &&
              <div className={styles.info}>Start typing to search</div>
            }
          </div>
        </div>
      </ReactCSSTransitionReplace>
    </div>
  )
};

export default TrackList;