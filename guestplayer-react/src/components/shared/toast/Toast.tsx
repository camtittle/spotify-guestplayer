import { Component, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './Toast.module.scss';

export enum ToastState {
  Disabled = 'Disabled',
  Loading = 'Loading',
  Success = 'Success',
  Error = 'Error'
}

interface ToastProps {
}

const Toast = (props: ToastProps) => {

  const [visible, setVisible] = useState(false);

  const timeout = 5000;

  useEffect(() => {
    if (props.state === ToastState.Error || props.state === ToastState.Success) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, timeout);
    } else if (props.state === ToastState.Loading) {
      setVisible(true);
    } else if (props.state === ToastState.Disabled) {
      setVisible(false);
    }
  }, [props.state]);

  return (
    <CSSTransition in={visible} timeout={300} mountOnEnter unmountOnExit classNames={{
      enter: styles.enter,
      enterActive: styles.enterActive,
      exit: styles.exit,
      exitActive: styles.exitActive
    }}>
      <div className={styles.toast}>
        Toast
      </div>
    </CSSTransition>
  )

}

export default Toast;