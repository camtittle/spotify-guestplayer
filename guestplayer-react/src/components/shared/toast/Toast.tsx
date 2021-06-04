import { Component, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import styles from './Toast.module.scss';

export enum ToastState {
  Disabled = 'Disabled',
  Loading = 'Loading',
  Success = 'Success',
  Error = 'Error'
}

interface ToastProps {
  state: ToastState,
  label: string
}

const Toast = (props: ToastProps) => {

  const [visible, setVisible] = useState(false);
  let timeoutRef = useRef<NodeJS.Timeout>();

  const duration = 5000;

  useEffect(() => {
    if (props.state === ToastState.Error || props.state === ToastState.Success || props.state === ToastState.Loading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, duration);
      setVisible(true);
    } else if (props.state === ToastState.Disabled) {
      setVisible(false);
    }
  }, [props.state]);

  const classNames = [styles.toast];
  switch (props.state) {
    case ToastState.Loading:
      classNames.push(styles.loading);
      break;
    case ToastState.Error:
      classNames.push(styles.error);
      break;
    case ToastState.Success:
      classNames.push(styles.success);
      break;
  }

  return (
    <CSSTransition in={visible} timeout={300} mountOnEnter unmountOnExit classNames={{
      enter: styles.enter,
      enterActive: styles.enterActive,
      exit: styles.exit,
      exitActive: styles.exitActive
    }}>
      <div className={classNames.join(' ')}>
        <span className={styles.iconContainer}>
          {props.state === ToastState.Loading &&
            <LoadingSpinner color="white" className={styles.loadingSpinner} />
          }

          {props.state === ToastState.Success &&
            <span className={styles.tickIcon}></span>
          }

          {props.state === ToastState.Error &&
            <span className={styles.errorIcon}></span>
          }

        </span>
        <span className={styles.label}>{props.label}</span>
      </div>
    </CSSTransition>
  )

}

export default Toast;