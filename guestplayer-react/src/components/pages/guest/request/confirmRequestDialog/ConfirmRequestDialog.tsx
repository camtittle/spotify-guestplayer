import React, { Component, Fragment, MouseEventHandler, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { requestTrack } from '../../../../../api/services/requestService';
import { ToastContext } from '../../../../../contexts/toastContext';
import { Party } from '../../../../../models/Party';
import { Track } from '../../../../../models/Track';
import { Button, ButtonSize, ButtonStyle } from '../../../../shared/button/Button';
import FlexContainer from '../../../../shared/container/FlexContainer';
import { ToastState } from '../../../../shared/toast/Toast';
import TrackListItem from '../../../../shared/trackListItem/TrackListItem';
import styles from './ConfirmRequestDialog.module.scss';

interface ConfirmRequestState {
  visible: boolean;
  track: Track;
}

interface ConfirmRequestProps {
  party: Party;
}

export class ConfirmRequestDialog extends Component<ConfirmRequestProps, ConfirmRequestState> {

  static contextType = ToastContext;
  context!: React.ContextType<typeof ToastContext>;

  dialogRef: React.RefObject<HTMLDivElement>;

  constructor(props: ConfirmRequestProps) {
    super(props);
    this.state = {
      visible: false,
      track: {} as Track
    };

    this.dialogRef = React.createRef<HTMLDivElement>();
  }

  public show = (track: Track) => {
    this.setState({
      visible: true,
      track: track
    });
  }
  
  onClose = () => {
    this.setState({
      visible: false
    });
  }

  onConfirm = () => {
    if (!this.state.track) {
      return;
    }

    this.setState({
      visible: false
    });

    this.context.setToastState(ToastState.Loading, 'Requesting track');

    setTimeout(() => {
      requestTrack(this.state.track.spotifyId, this.props.party.token).then(() => {
        this.context.setToastState(ToastState.Success, 'Track requested');
      }).catch(() => {
        this.context.setToastState(ToastState.Error, 'Something went wrong');
      })
    }, 1000);
    
    console.log('confirm ' + this.state.track.title);
  }
  
  render() {
    return (
      <Fragment>
        <CSSTransition in={this.state.visible} timeout={300} appear={true} mountOnEnter unmountOnExit classNames={{
          enter: styles['transition-enter'],
          enterActive: styles['transition-enter-active'],
          exit: styles['transition-exit'],
          exitActive: styles['transition-exit-active']
        }}>
          <FlexContainer className={styles.container}>
            <div className={styles.dialog} ref={this.dialogRef}>
              <h2 className={styles.header}>Request track</h2>
              <TrackListItem track={this.state.track} className={styles.trackListItem} />
              <p>The host will be notified of your request and can choose to add to the queue or play now.</p>
              
              <div className={styles.buttons}>
                <Button style={ButtonStyle.WhiteSecondary} size={ButtonSize.Small} onClick={this.onClose}>Cancel</Button>
                <Button style={ButtonStyle.GreenPrimary} size={ButtonSize.Small} onClick={this.onConfirm}>Request track</Button>
              </div>
            </div>
          </FlexContainer>
        </CSSTransition>
      </Fragment>
    );
  }
}