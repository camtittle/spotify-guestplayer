import { HelpStepConfig } from "../../../../shared/helpSteps/HelpSteps";
import Intro from "../../../shared/intro/Intro";

const helpSteps: HelpStepConfig[] = [
  {
    header: 'Invite',
    body: 'Use a QR code or magic link to invite a Co-host'
  },
  {
    header: 'Share control',
    body: "Co-hosts can accept and reject requests, but they can't end the party or invite other Co-hosts"
  },
  {
    header: 'Be careful',
    body: "Once Co-hosts have joined the party they can't be removed. Be careful where you share the QR code or link."
  },
]

const CohostIntro = () => {
  return (
    <Intro
      getStartedPath="/party/cohost"
      steps={helpSteps}
      title="Add a Co-host"
    />
  )
};

export default CohostIntro;