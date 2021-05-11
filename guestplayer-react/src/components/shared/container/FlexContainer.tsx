import { MouseEventHandler } from 'react';
import styles from './FlexContainer.module.scss';

interface FlexContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function FlexContainer(props: FlexContainerProps): JSX.Element {
  const classNames = [styles.container, props.className].join(' ');
  return (
    <div className={classNames}>
      { props.children }
    </div>
  );
}