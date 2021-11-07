import { FC } from "react";
import { ThemeProvider } from "styled-components"

const theme = {
  brandPrimary: '#1DB954',
  grey90: '#323232'
};

export const SpotifyThemeProvider: FC = ({children}) => {
  return(
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  )
}