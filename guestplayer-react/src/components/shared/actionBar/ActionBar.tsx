import styles from './ActionBar.module.scss';
import ellipse from '../../../assets/img/actionbar-ellipse.svg';

interface ActionBarProps {
  fillHeight?: boolean;
  children?: JSX.Element;
}

export const ActionBar = (props: ActionBarProps) => {
  
  const classNames = [styles.actionBar];
  if (props.fillHeight) {
    classNames.push(styles.fillHeight);
  }

  return (
    <div className={classNames.join(' ')}>
      <div className={styles.ellipse}></div>
      <div className={styles.rectangle}></div>
      {props.children}
    </div>
  )
}