import styles from './FlexContainer.module.scss';

type ChildType = JSX.Element | boolean | null | undefined;

interface FlexContainerProps {
  children: ChildType[] | ChildType;
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