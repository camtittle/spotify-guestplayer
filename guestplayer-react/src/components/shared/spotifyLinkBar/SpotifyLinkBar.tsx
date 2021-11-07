import styled from 'styled-components';

const LinkBarContainer = styled.div`
  width: 100%;
  height: 64px;
  padding: 12px 8px;
  background-color: ${props => props.theme.grey90};
  box-shadow: rgba(23, 23, 23, 0.52) 0px -3px 6px;
`;

const SpotifyIcon = styled.span`
  display: inline-block;
  background-image: url('/assets/spotify_icon.png');
  background-size: contain;
  width: 25px;
  height: 25px;
  vertical-align: middle;
  margin-right: 10px;
`

const SpotifyLinkButton = styled.a`
  display: inline-block;
  height: 40px;
  border-radius: 20px;
  outline: none;
  border: none;
  background-color: ${props => props.theme.brandPrimary};
  color: white;
  padding: 0px 24px;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  margin: 0 auto;
  box-shadow: rgba(0, 0, 0, 0.171) 0px 3px 6px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background-color: #1c9145;
  }
`;

export const SpotifyLinkBar = () => {
  return (
    <LinkBarContainer>
      <SpotifyLinkButton href="https://www.spotify.com/download/" target="_blank">
        <SpotifyIcon />
        Get Spotify free
      </SpotifyLinkButton>
    </LinkBarContainer>
  )
}