import { HelpStepConfig } from "../../../shared/helpSteps/HelpSteps";
import Intro from "../../shared/intro/Intro";

const helpSteps: HelpStepConfig[] = [
  {
    header: 'Create your party',
    body: 'Connect to Spotify and name your party'
  },
  {
    header: 'Invite guests',
    body: 'Anyone can scan the QR or click the link you share with them to start requesting songs'
  },
  {
    header: "You're in control",
    body: 'You choose which song requests to queue, play now, or delete'
  }
]

const CreatePartyIntro = () => {
  return (
    <Intro
      getStartedPath="/party/create"
      steps={helpSteps}
      title="Host a party"
    />
  )
};

export default CreatePartyIntro;