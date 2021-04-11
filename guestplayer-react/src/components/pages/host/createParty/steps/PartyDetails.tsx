import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { Button, ButtonStyle } from "../../../../shared/button/Button";
import { TextInput } from "../../../../shared/textInput/TextInput"
import styles from '../CreateParty.module.scss';

export const PartyDetails = () => {

  const [name, setName] = useState<string>('');
  const history = useHistory();
  const nameInputRef = useRef<TextInput>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, [nameInputRef.current]);

  const onInputChange = (value: string) => {
    setName(value);
  }

  const onClickCancel = () => {
    history.push('/');
  };

  const onClickFinish = () => {
  }

  const finishButtonStyle = !!name ? ButtonStyle.WhitePrimary : ButtonStyle.Disabled;

  return (
    <div className={styles.inputsContainer}>
      <h1 className={styles.stepTitle}>Name your Party</h1>
      <p className={styles.stepDescription}>Guests will see this when they join</p>
      
      <TextInput ref={nameInputRef} value={name} onChange={onInputChange} className={styles.nameInput}></TextInput>
      
      <div>
        <Button style={ButtonStyle.WhiteSecondary} className={styles.leftNavButton} onClick={onClickCancel}>Cancel</Button>
        <Button style={finishButtonStyle} className={styles.rightNavButton} onClick={onClickFinish}>Finish</Button>
      </div>
    </div>
  )
}