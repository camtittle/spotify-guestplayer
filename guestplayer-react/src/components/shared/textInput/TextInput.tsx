import { ChangeEvent, Component, createRef, Fragment } from 'react';
import styles from './TextInput.module.scss';

export interface TextInputProps {
  className?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  icon?: string;
}

export class TextInput extends Component<TextInputProps> {
  private inputRef = createRef<HTMLInputElement>();

  public focus() {
    const inputElement = this.inputRef.current;
    if (inputElement) {
      inputElement.focus();
    }
  }

  private onChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  }

  private onClickClear = () => {
    if (this.props.onChange) {
      this.props.onChange('');
    }
    this.focus();
  }

  render() {
    const classNames = [styles.container, this.props.className];
    const buttonClasses = [styles.clearButton];

    if (this.props.value) {
      buttonClasses.push(styles.visible);
    }

    const inputClasses = [styles.textInput];
    if (this.props.icon) {
      inputClasses.push(styles.withIcon);
    }

    let iconStyle = {
      backgroundImage: `url(${this.props.icon})`
    };

    return (
      <div className={classNames.join(' ')}>
        <input type="text" className={inputClasses.join(' ')} value={this.props.value} onChange={this.onChange} ref={this.inputRef} disabled={this.props.disabled} />
        <button className={buttonClasses.join(' ')} onClick={this.onClickClear}></button>
        <div className={styles.icon} style={iconStyle}></div>
      </div>
    );

  }

};