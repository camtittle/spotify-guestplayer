import { CSSTransition } from 'react-transition-group';
import styles from './HelpSteps.module.scss';

export interface HelpStepConfig {
  header: string;
  body: string;
}

export interface HelpStepsProps {
  steps: HelpStepConfig[];
  title: string;
}

const HelpSteps = ({ title, steps }: HelpStepsProps) => {
  
  const stepElements = steps.map((step, index) => (
    <CSSTransition in appear timeout={1000 + ((index + 1) * 300)} mountOnEnter classNames={{
      appear: styles.enter,
      appearActive: styles.enterActive
    }}>
      <div>
        <h3>
          <span className={styles.stepNumber}>{index + 1}</span>
          <span>{step.header}</span>
        </h3>
        <p>{step.body}</p>
      </div>
    </CSSTransition>
  ));

  return (
    <div className={styles.steps}>
      <h2>{title}</h2>

      <div>
        {stepElements}
      </div>
  </div>
  )

};

export default HelpSteps;