import Image from "next/image";
import React from "react";
import styles from "../styles/Menu.module.css";
import LocaleSelector from "./LocaleSelector";
import Wallet from "./Wallet";

function MenuButton({ onClick }: { onClick: (e: any) => void }) {
  return (
    <button onClick={onClick} className={styles.menuButton}>
      <Image src="/icons/hamburger.svg" alt="Menu" width="56" height="40" />
    </button>
  );
}

export default function MenuMobile() {
  const [isOpen, setIsOpen] = React.useState(false);

  const onMenu = React.useCallback((e: any) => {
    e.preventDefault();
    setIsOpen((current) => !current);
  }, []);

  return (
    <>
      {!isOpen && (
        <div className={styles.closedMobileMenu}>
          <MenuButton onClick={onMenu} />
        </div>
      )}
      {isOpen && (
        <div className={styles.opennedMobileMenu}>
          <div className={styles.menuButtonContainer}>
            <MenuButton onClick={onMenu} />
          </div>
          <Wallet />
          <LocaleSelector />
        </div>
      )}
    </>
  );
}
