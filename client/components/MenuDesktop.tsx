import LocaleSelector from "./LocaleSelector";
import Wallet from "./Wallet";
import styles from "../styles/Home.module.css";

export default function MenuDesktop() {
  return (
    <div className={styles.stickyCorner}>
      <Wallet />
      <LocaleSelector />
    </div>
  );
}
