import { useHistory } from 'react-router';
import { Button, ButtonStyle } from '../../../shared/button/Button';
import FlexContainer from '../../../shared/container/FlexContainer';
import HelpSteps, { HelpStepConfig } from '../../../shared/helpSteps/HelpSteps';
import { TitleBar } from '../../../shared/titleBar/TitleBar';
import styles from './Intro.module.scss';

export interface IntroProps {
  title: string,
  steps: HelpStepConfig[],
  getStartedPath: string;
}

const Intro = ({ title, steps, getStartedPath }: IntroProps) => {

  const history = useHistory();

  const onClickCancel = () => {
    history.goBack();
  };

  const onClickGetStarted = () => {
    history.push(getStartedPath);
  }

  return (
    <FlexContainer>
      <TitleBar showBackButton={true}></TitleBar>

      <HelpSteps title={title} steps={steps} />
            
      <div>
        <Button style={ButtonStyle.WhiteSecondary} className={styles.leftNavButton} onClick={onClickCancel}>Cancel</Button>
        <Button style={ButtonStyle.WhitePrimary} className={styles.rightNavButton} onClick={onClickGetStarted}>Get started</Button>
      </div>
    </FlexContainer>
  )

}

export default Intro;