import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner = (props: LoadingSpinnerProps) => {
  const classes = [props.className, 'lds-ellipsis'].join(' ');

  return (
    <div className={classes}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
 )
}

export default LoadingSpinner;