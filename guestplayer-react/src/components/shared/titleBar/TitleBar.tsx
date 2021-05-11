import BackButton from '../backButton/BackButton';
import styles from './TitleBar.module.scss';

interface TitleBarProps {
  className?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onClickBack?: () => void
}

export const TitleBar = (props: TitleBarProps) => {
  
  const classNames = [styles.titleBar, props.className].join(' ');

  return (
    <div className={classNames}>
      {props.showBackButton &&
        <BackButton onClick={props.onClickBack}></BackButton>
      }
      {props.showMenuButton &&
        // TODO: menu button
        <div className={styles.spacer}></div>
      }
      {!props.showBackButton && !props.showMenuButton &&
        <div className={styles.spacer}></div>
      }
      <div className={styles.title}>GuestPlayer</div>
      <div className={styles.spacer}></div>
    </div>
  )
}