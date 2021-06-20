import { Fragment, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { PartyContext } from '../../../../contexts/partyContext';
import Backdrop from '../../backdrop/Backdrop';
import styles from './Menu.module.scss';

export interface MenuItem {
  label: string;
  icon: string;
  onClick: () => void;
}

export interface MenuProps {
  visible: boolean;
  onClose: () => void;
  menuItems?: MenuItem[];
}

const Menu = ({ visible, onClose, menuItems }: MenuProps) => {

  const { party } = useContext(PartyContext);
  
  const menuItemElements = menuItems?.map(item => {
    const style = {
      backgroundImage: `url(${item.icon})`
    };

    const onClick = () => {
      onClose();
      item.onClick();
    }

    return (
      <button className={styles.menuItem} onClick={onClick} key={item.label}>
        <span className={styles.icon} style={style}></span>
        <span className={styles.label}>{item.label}</span>
      </button>
    )
  })

  return (
    <Fragment>
      <Backdrop visible={visible} onClick={onClose} />

      <CSSTransition in={visible} timeout={300} mountOnEnter unmountOnExit classNames={{
        enter: styles.enter,
        enterActive: styles.enterActive,
        exit: styles.exit,
        exitActive: styles.exitActive
      }}>
        <div className={styles.menu}>
          <div className={styles.partyName}>{party?.name}</div>
          <div className={styles.divider}></div>
          {menuItemElements}
        </div>
      </CSSTransition>
    </Fragment>
  );
};

export default Menu;