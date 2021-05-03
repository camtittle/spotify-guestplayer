import React from 'react';
import { CSSTransition } from 'react-transition-group';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import styles from './Button.module.scss';
import './ButtonTransitions.scss';

export enum ButtonStyle {
  WhitePrimary,
  WhiteSecondary,
  GreenPrimary
}

interface ButtonProps {
  style: ButtonStyle;
  icon?: string;
  iconAltText?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = (props) => {

  const loading = props.loading === true;
  const classNames = [styles.button, props.className];
  
  if (props.style === ButtonStyle.WhiteSecondary) {
    classNames.push(styles.secondary);
  } else if (props.style === ButtonStyle.GreenPrimary) {
    classNames.push(styles.greenPrimary);
  }

  if (props.disabled && !props.loading) {
    classNames.push(styles.disabled);
  }

  if (props.loading) {
    classNames.push(styles.loading);
  }

  const img = props.icon ? <img src={props.icon} alt={props.iconAltText} className={styles.icon} /> : undefined;

  return (
    <button className={classNames.join(' ')} onClick={props.onClick} disabled={props.disabled}>
        <CSSTransition
          classNames="button-loading-transition"
          timeout={150}
          in={!loading}
          unmountOnExit
        >
        <div className={styles.buttonContainer}>
            {img}
            <span className={styles.label}>{props.children}</span>
          </div>
        </CSSTransition>
        <CSSTransition
          classNames="button-loading-transition"
          timeout={150}
        in={loading}
        unmountOnExit
      >
        <div className={styles.buttonContainer}>
          <LoadingSpinner className={styles.loadingSpinner} />
        </div>
        </CSSTransition>

    </button>
  )
}