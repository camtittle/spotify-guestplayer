import styles from './ImageButton.module.scss';

interface ImageButtonProps {
  className?: string;
  onClick: () => void;
  icon: string;
}

export default function ImageButton(props: ImageButtonProps): JSX.Element {

  const classes = [styles.button, props.className].join(' ');

  const onClick = () => {
    props.onClick();
  };

  const style = {
    backgroundImage: `url(${props.icon})`
  };

  return (
    <button className={classes} onClick={onClick} style={style}></button>
  );

}