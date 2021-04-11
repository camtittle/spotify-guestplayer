import { useHistory } from 'react-router';
import styles from './BackButton.module.scss';

interface BackButtonProps {
  className?: string;
  onClick?: () => void;
}

export default function BackButton(props: BackButtonProps): JSX.Element {

  const classes = [styles.back, props.className].join(' ');
  const history = useHistory();

  const onClick = () => {
    if (props.onClick) {
      props.onClick();
    } else {
      history.goBack();
    }
  };

  return (
    <button className={classes} onClick={onClick}></button>
  );

}