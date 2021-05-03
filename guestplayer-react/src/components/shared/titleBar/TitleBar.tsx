import BackButton from '../backButton/BackButton';
import styles from './TitleBar.module.scss';

interface TitleBarProps {
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onClickBack?: () => void
}

export const TitleBar = (props: TitleBarProps) => {
  
  return (
    <div className={styles.titleBar}>
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
      <div>GuestPlayer</div>
      <div className={styles.spacer}></div>
    </div>
  )
}