import { Switch, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import './SlideLeft.scss';

interface SlideLeftProps {
  children: JSX.Element | JSX.Element[],
  routeKey?: string;
};

export const SlideLeft = (props: SlideLeftProps) => {
  const location = useLocation();
  const key = location.key;

  return (
    <TransitionGroup>
      <CSSTransition
        key={key}
        classNames="fade"
        timeout={300}
      >
        <Switch location={location}>
          {props.children}
        </Switch>
       </CSSTransition>
     </TransitionGroup>
  );
}