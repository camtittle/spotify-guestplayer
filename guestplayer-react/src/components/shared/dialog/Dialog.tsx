import { Component, Fragment } from 'react';
import { CSSTransition } from 'react-transition-group';
import Backdrop from '../backdrop/Backdrop';
import { Button, ButtonSize, ButtonStyle } from '../button/Button';
import FlexContainer from '../container/FlexContainer';
import styles from './Dialog.module.scss';

interface DialogProps {
  title: string;
  body: string;
  secondaryLabel: string;
  primaryLabel: string;
  onClickPrimary: () => void;
  onClickSecondary: () => void;
}

class Dialog extends Component<DialogProps> {
  state = {
    visible: false
  }

  onDismiss = () => {
    this.setState({
      visible: false
    });
  };

  public show() {
    this.setState({
      visible: true
    })
  }

  public hide() {
    this.setState({
      visible: false
    })
  }

  render() {
    return (
      <Fragment>
        <Backdrop visible={this.state.visible} onClick={this.onDismiss} />
        
        <CSSTransition in={this.state.visible} timeout={300} mountOnEnter unmountOnExit classNames={{
          enter: styles.enter,
          enterActive: styles.enterActive,
          exit: styles.exit,
          exitActive: styles.exitActive
        }}>
          <FlexContainer className={styles.container}>
            <div className={styles.dialog}>
              <div className={styles.title}>{this.props.title}</div>
              <div className={styles.body}>{this.props.body}</div>
              <div className={styles.buttonsContainer}>
                <Button style={ButtonStyle.WhiteSecondary} size={ButtonSize.Medium} onClick={this.props.onClickSecondary}>{this.props.secondaryLabel}</Button>
                <Button style={ButtonStyle.GreenPrimary} size={ButtonSize.Medium} onClick={this.props.onClickPrimary}>{this.props.primaryLabel}</Button>
              </div>
            </div>
          </FlexContainer>
        </CSSTransition>
      </Fragment>
    );
  }
}

export default Dialog;