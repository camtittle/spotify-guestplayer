import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  className?: string;
  color?: string;
}

const LoadingSpinner = (props: LoadingSpinnerProps) => {
  const classes = [props.className, 'lds-ellipsis'].join(' ');

  const style = {
    background: props.color
  };

  return (
    <div className={classes}>
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
      <div style={style}></div>
    </div>
 )
}

export default LoadingSpinner;