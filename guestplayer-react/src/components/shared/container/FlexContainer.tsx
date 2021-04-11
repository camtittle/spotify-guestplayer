import styles from './FlexContainer.module.scss';

interface FlexContainerProps {
  children: JSX.Element[] | JSX.Element;
}

export default function FlexContainer(props: FlexContainerProps): JSX.Element {
  return (
    <div className={styles.container}>
      { props.children }
    </div>
  );
}