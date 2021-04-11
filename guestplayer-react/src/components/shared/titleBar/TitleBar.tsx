import BackButton from '../backButton/BackButton';
import styles from './TitleBar.module.scss';

interface TitleBarProps {
  showBackButton?: boolean;
  onClickBack?: () => void
}

export const TitleBar = (props: TitleBarProps) => {
  
  return (
    <div className={styles.titleBar}>
      {props.showBackButton &&
        <BackButton onClick={props.onClickBack}></BackButton>
      }
    </div>
  )
}