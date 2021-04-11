import { ChangeEvent, Component, createRef } from 'react';
import styles from './TextInput.module.scss';

export interface TextInputProps {
  className: string;
  value: string;
  onChange: (value: string) => void;
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
    this.props.onChange(event.target.value);
  }

  render() {
    const classNames = [styles.textInput, this.props.className];

    return (
      <input type="text" className={classNames.join(' ')} value={this.props.value} onChange={this.onChange} ref={this.inputRef}/>
    );

  }

};