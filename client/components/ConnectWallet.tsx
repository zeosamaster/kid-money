import React from "react";
import { WalletContext } from "../context/WalletContext";
import buttonStyles from "../styles/Button.module.css";

export function ConnectWallet() {
  const { connect } = React.useContext(WalletContext);

  return (
    <button className={[buttonStyles.button].join(" ")} onClick={connect}>
      Connect to Wallet
    </button>
  );
}
