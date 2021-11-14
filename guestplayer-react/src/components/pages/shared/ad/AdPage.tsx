import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import { Button, ButtonSize, ButtonStyle } from "../../../shared/button/Button";
import FlexContainer from "../../../shared/container/FlexContainer";
import GoogleAd, { AdType } from "../../../shared/googleAd/GoogleAd";

interface AdPageParams {
  redirectPath: string;
};

const Container = styled(FlexContainer)`
  justify-content: center;
  padding: 12px;
`;

const CenteredButton = styled(Button)`
  margin-top: 60px;
  max-width: 200px;
`;

const AdContainer = styled.div`
  width: 100%;
  height: 500px;
  background-color: grey;
`;

export const AdPage = () => {
  const { redirectPath } = useParams<AdPageParams>();
  const history = useHistory();

  const onClickSkip = () => {
    const decodedPath = decodeURIComponent(redirectPath);
    history.replace(decodedPath);
  };

  return (
    <Container>
      <AdContainer>
        <GoogleAd type={AdType.Vertical}/>
      </AdContainer>
      <CenteredButton style={ButtonStyle.WhitePrimary} size={ButtonSize.Large} onClick={onClickSkip}>Skip Ad</CenteredButton>
    </Container>
  )
}