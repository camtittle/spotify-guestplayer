import FlexContainer from "../container/FlexContainer"
import { MenuItem } from "../titleBar/menu/Menu"
import { TitleBar } from "../titleBar/TitleBar"

interface PageProps {
  isHome?: boolean;
  onClickBack?: () => void;
  className?: string;
  menuItems?: MenuItem[]
}

export const Page: React.FC<PageProps> = ({children, isHome, menuItems, className, onClickBack}) => {
  return (
    <FlexContainer className={className}>
      <TitleBar showMenuButton={isHome} showBackButton={!isHome} onClickBack={onClickBack} menuItems={menuItems}></TitleBar>
      {children}
    </FlexContainer>
  )
}