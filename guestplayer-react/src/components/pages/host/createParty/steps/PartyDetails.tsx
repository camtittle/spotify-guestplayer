import { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { Button, ButtonStyle } from "../../../../shared/button/Button";
import { TextInput } from "../../../../shared/textInput/TextInput"
import styles from '../CreateParty.module.scss';
import * as PartyService from '../../../../../api/services/partyService';
import { PartyContext } from "../../../../../contexts/partyContext";

interface PartyDetailsProps {
}

export const PartyDetails = (props: PartyDetailsProps): JSX.Element => {

  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();
  const nameInputRef = useRef<TextInput>(null);
  const { setParty, spotifyCredentials } = useContext(PartyContext);

  useEffect(() => {
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 300)
  }, [nameInputRef.current]);

  useEffect(() => {
    if (!spotifyCredentials) {
      history.push('/party/create');
    }
  }, [spotifyCredentials]);

  const onInputChange = (value: string) => {
    setName(value);
  }

  const onClickCancel = () => {
    history.push('/');
  };

  const delay = async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(undefined), 2000);
    })
  };

  const onClickFinish = async () => {
    if (!spotifyCredentials) {
      throw new Error('Cannot create paty without Spotify credentials');
    }
    setLoading(true);
    try {
      await delay();
      const party = await PartyService.createParty(name, spotifyCredentials);
      setParty(party);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  const validName = !!name;

  return (
    <div className={styles.inputsContainer}>
      <h1 className={styles.stepTitle}>Name your Party</h1>
      <p className={styles.stepDescription}>Guests will see this when they join</p>
      
      <TextInput ref={nameInputRef} value={name} onChange={onInputChange} className={styles.nameInput} disabled={loading}></TextInput>
      
      <div>
        <Button style={ButtonStyle.WhiteSecondary} className={styles.leftNavButton} onClick={onClickCancel} disabled={loading}>Cancel</Button>
        <Button style={ButtonStyle.WhitePrimary} className={styles.rightNavButton} onClick={onClickFinish} disabled={!validName} loading={loading}>Finish</Button>
      </div>
    </div>
  )
}