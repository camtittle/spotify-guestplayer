import { CSSTransition } from "react-transition-group";
import styles from './Backdrop.module.scss';

export interface BackdropProps {
  visible: boolean;
  onClick: () => void;
}

const Backdrop = ({ visible, onClick }: BackdropProps) => {
  return (
    <CSSTransition in={visible} timeout={300} mountOnEnter unmountOnExit classNames={{
      enter: styles.fadeEnter,
      enterActive: styles.fadeEnterActive,
      exit: styles.fadeExit,
      exitActive: styles.fadeExitActive
    }}>
      <button className={styles.backdrop} onClick={onClick} />
    </CSSTransition>
  )
}

export default Backdrop;