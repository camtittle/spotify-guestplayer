import React, { Component, Fragment } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ErrorCode } from '../../../../../api/error/ErrorCodes';
import { requestTrack } from '../../../../../api/services/requestService';
import { ToastContext } from '../../../../../contexts/toastContext';
import { withHistory } from '../../../../../hocs/withHistory';
import { ApiErrorHandler, withApiErrorHandler } from '../../../../../hooks/apiErrorHandlerHook';
import { Party } from '../../../../../models/Party';
import { Track } from '../../../../../models/Track';
import { Button, ButtonSize, ButtonStyle } from '../../../../shared/button/Button';
import FlexContainer from '../../../../shared/container/FlexContainer';
import Dialog from '../../../../shared/dialog/Dialog';
import { ToastStyle } from '../../../../shared/toast/Toast';
import TrackListItem from '../../../../shared/trackListItem/TrackListItem';
import styles from './ConfirmRequestDialog.module.scss';

interface ConfirmRequestState {
  visible: boolean;
  track: Track;
}

interface ConfirmRequestProps {
  party: Party;
  apiErrorHandler: ApiErrorHandler;
  history: any;
}

export class ConfirmRequestDialogType extends Component<ConfirmRequestProps, ConfirmRequestState> {

  static contextType = ToastContext;
  context!: React.ContextType<typeof ToastContext>;

  dialogRef: React.RefObject<HTMLDivElement>;
  tooManyRequestsDialogRef: React.RefObject<Dialog>;

  constructor(props: ConfirmRequestProps) {
    super(props);
    this.state = {
      visible: false,
      track: {} as Track
    };

    this.dialogRef = React.createRef<HTMLDivElement>();
    this.tooManyRequestsDialogRef = React.createRef<Dialog>();
  }

  public show = (track: Track) => {
    this.setState({
      visible: true,
      track: track
    });
  };
  
  onClose = () => {
    this.setState({
      visible: false
    });
  };

  closeTooManyRequestsDialog = () => {
    this.tooManyRequestsDialogRef.current?.hide();
  };

  showTooManyRequestsDialog = () => {
    this.onClose();
    this.tooManyRequestsDialogRef.current?.show();
    this.context.showToast(undefined);
  };

  onClickViewRequests = () => {
    this.props.history.push('/party/guest/requests')
  };

  onConfirm = () => {
    if (!this.state.track) {
      return;
    }

    this.setState({
      visible: false
    });

    this.context.showToast({
      style: ToastStyle.Loading,
      text: 'Requesting track'
    });
    
    this.props.apiErrorHandler(async () => {
      try {
        await requestTrack(this.state.track.spotifyId);
        this.context.showToast({
          style: ToastStyle.Success,
          text: 'Track requested'
        });
      } catch (e) {
        if (e.isApiError && e.errorCode === ErrorCode.TooManyPendingRequests) {
          this.showTooManyRequestsDialog();
        } else {
          throw e;
        }
      }
    });
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
                <Button style={ButtonStyle.WhiteSecondary} size={ButtonSize.Medium} onClick={this.onClose}>Cancel</Button>
                <Button style={ButtonStyle.GreenPrimary} size={ButtonSize.Medium} onClick={this.onConfirm}>Request track</Button>
              </div>
            </div>
          </FlexContainer>
        </CSSTransition>

        <Dialog
          title="Too many requests"
          body="Oops! You can only have 5 pending requests at a time. Once the host accepts or rejects your requests you can make more."
          primaryLabel="OK"
          onClickPrimary={this.closeTooManyRequestsDialog}
          secondaryLabel="View requests"
          onClickSecondary={this.onClickViewRequests}
          equallySpacedButtons
          ref={this.tooManyRequestsDialogRef}
        />
      </Fragment>
    );
  }
}

export default withApiErrorHandler(withHistory(ConfirmRequestDialogType));