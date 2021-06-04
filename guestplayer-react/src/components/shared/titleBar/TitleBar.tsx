import BackButton from '../backButton/BackButton';
import ImageButton from '../imageButton/ImageButton';
import styles from './TitleBar.module.scss';
import MenuIcon from '../../../assets/img/menu.svg';
import Menu, { MenuItem } from './menu/Menu';
import { useState } from 'react';

interface TitleBarProps {
  className?: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onClickBack?: () => void;
  menuItems?: MenuItem[];
}

export const TitleBar = (props: TitleBarProps) => {
  
  const [menuVisible, setMenuVisible] = useState(false);
  const classNames = [styles.titleBar, props.className].join(' ');

  const showMenu = (show: boolean) => {
    setMenuVisible(show);
  };

  return (
    <div className={classNames}>
      {props.showBackButton &&
        <BackButton onClick={props.onClickBack} className={styles.backButton}></BackButton>
      }
      {props.showMenuButton &&
        <ImageButton onClick={() => showMenu(true)} icon={MenuIcon} className={styles.menuButton}></ImageButton>
      }
      <div className={styles.title}>GuestPlayer</div>

      <Menu visible={menuVisible} onClose={() => showMenu(false)} menuItems={props.menuItems}></Menu>
    </div>
  )
}