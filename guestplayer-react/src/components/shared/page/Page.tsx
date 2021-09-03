import FlexContainer from "../container/FlexContainer"
import { MenuItem } from "../titleBar/menu/Menu"
import { TitleBar } from "../titleBar/TitleBar"

interface PageProps {
  isHome?: boolean;
  onClickBack?: () => void;
  containerClassName?: string;
  menuItems?: MenuItem[]
}

export const Page: React.FC<PageProps> = ({children, isHome, menuItems, containerClassName, onClickBack}) => {
  return (
    <FlexContainer className={containerClassName}>
      <TitleBar showMenuButton={isHome} showBackButton={!isHome} onClickBack={onClickBack} menuItems={menuItems}></TitleBar>
      {children}
    </FlexContainer>
  )
}