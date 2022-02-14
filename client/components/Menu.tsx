import useResponsiveness from "../hooks/useResponsiveness";
import MenuDesktop from "./MenuDesktop";
import MenuMobile from "./MenuMobile";

export default function Menu() {
  const { isMobile } = useResponsiveness();

  return isMobile ? <MenuMobile /> : <MenuDesktop />;
}
