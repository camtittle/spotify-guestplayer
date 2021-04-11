import React from 'react';
import styles from './Button.module.scss';

export enum ButtonStyle {
  WhitePrimary,
  WhiteSecondary,
  GreenPrimary,
  Disabled
}

interface ButtonProps {
  style: ButtonStyle;
  icon?: string;
  iconAltText?: string;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = (props) => {

  const classNames = [styles.button];
  
  if (props.style === ButtonStyle.WhiteSecondary) {
    classNames.push(styles.secondary);
  } else if (props.style === ButtonStyle.GreenPrimary) {
    classNames.push(styles.greenPrimary);
  } else if (props.style === ButtonStyle.Disabled) {
    classNames.push(styles.disabled);
  }

  if (props.className) {
    classNames.push(props.className);
  }

  const img = props.icon ? <img src={props.icon} alt={props.iconAltText} className={styles.icon} /> : undefined;

  return (
    <button className={classNames.join(' ')} onClick={props.onClick}>{img}<span className={styles.label}>{props.children}</span></button>
  )
}