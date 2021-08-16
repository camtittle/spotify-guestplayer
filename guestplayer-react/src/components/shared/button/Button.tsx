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

export enum ButtonSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large'
}

interface ButtonProps {
  style: ButtonStyle;
  icon?: string;
  iconAltText?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonSize;
  badge?: string | number;
}

export const Button: React.FC<ButtonProps> = (props) => {

  const loading = props.loading === true;
  const classNames = [styles.button, props.className];
  let loadingColor = '#1DB954'; // green

  if (props.style === ButtonStyle.WhiteSecondary) {
    classNames.push(styles.secondary);
  } else if (props.style === ButtonStyle.GreenPrimary) {
    classNames.push(styles.greenPrimary);
    loadingColor = 'white';
  }

  if (props.disabled && !props.loading) {
    classNames.push(styles.disabled);
  }

  if (props.loading) {
    classNames.push(styles.loading);
  }

  if (props.size) {
    if (props.size === ButtonSize.Medium) {
      classNames.push(styles.medium);
    } else if (props.size === ButtonSize.Small) {
      classNames.push(styles.small);
    }
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
          <LoadingSpinner className={styles.loadingSpinner} color={loadingColor} />
        </div>
      </CSSTransition>

      <CSSTransition
        classNames="button-badge-grow"
        timeout={900}
        in={!!props.badge}
        mountOnEnter
        unmountOnExit
      >
        <div className={styles.badge}>
          <div>{props.badge}</div>
        </div>
      </CSSTransition>




    </button>
  )
}