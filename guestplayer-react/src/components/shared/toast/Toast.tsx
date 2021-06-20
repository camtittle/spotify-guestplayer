import { Component, createRef, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import styles from './Toast.module.scss';

export enum ToastStyle {
  Loading = 'Loading',
  Success = 'Success',
  Error = 'Error'
}

export interface ToastNotification {
  style: ToastStyle,
  text: string;
}

interface ToastProps {
  notification?: ToastNotification;
}


class Toast extends Component {

  private duration = 5000;
  private timeoutRef: NodeJS.Timeout | undefined;
  private notification: ToastNotification | undefined;

  state = {
    visible: false
  }

  constructor(props: any) {
    super(props);
  }

  private setVisible(visible: boolean) {
    this.setState({
      visible
    });
  }

  showToast(toast?: ToastNotification) {
    if (toast) {
      this.notification = toast;
      if (this.timeoutRef) {
        clearTimeout(this.timeoutRef);
      }
      this.timeoutRef = setTimeout(() => {
        this.setVisible(false);
      }, this.duration);
      this.setVisible(true);
    } else {
      this.setVisible(false);
    }
  }

  render() {
    const classNames = [styles.toast];
    switch (this.notification?.style) {
      case ToastStyle.Loading:
        classNames.push(styles.loading);
        break;
      case ToastStyle.Error:
        classNames.push(styles.error);
        break;
      case ToastStyle.Success:
        classNames.push(styles.success);
        break;
    }

    return (
      <CSSTransition in={this.state.visible} timeout={300} mountOnEnter unmountOnExit classNames={{
        enter: styles.enter,
        enterActive: styles.enterActive,
        exit: styles.exit,
        exitActive: styles.exitActive
      }}>
        <div className={classNames.join(' ')}>
          <span className={styles.iconContainer}>
            {this.notification?.style === ToastStyle.Loading &&
              <LoadingSpinner color="white" className={styles.loadingSpinner} />
            }

            {this.notification?.style === ToastStyle.Success &&
              <span className={styles.tickIcon}></span>
            }

            {this.notification?.style === ToastStyle.Error &&
              <span className={styles.errorIcon}></span>
            }

          </span>
          <span className={styles.label}>{this.notification?.text}</span>
        </div>
      </CSSTransition>
    )
  }
}

export default Toast;