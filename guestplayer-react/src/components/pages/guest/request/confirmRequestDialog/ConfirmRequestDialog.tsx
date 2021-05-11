import React, { Component, Fragment, MouseEventHandler } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Track } from '../../../../../models/Track';
import { Button, ButtonSize, ButtonStyle } from '../../../../shared/button/Button';
import FlexContainer from '../../../../shared/container/FlexContainer';
import Toast, { ToastState } from '../../../../shared/toast/Toast';
import TrackListItem from '../../../../shared/trackListItem/TrackListItem';
import styles from './ConfirmRequestDialog.module.scss';

interface ConfirmRequestState {
  visible: boolean;
  toastState: ToastState;
  track: Track;
}

export class ConfirmRequestDialog extends Component<{}, ConfirmRequestState> {

  dialogRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.state = {
      visible: false,
      track: {} as Track,
      toastState: ToastState.Disabled
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
      toastState: ToastState.Loading,
      visible: false
    });

    setTimeout(() => {
      this.setState({
        toastState: ToastState.Success
      });
    }, 100);
    
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