import React from "react";
import { WalletContext } from "../context/WalletContext";
import walletStyles from "../styles/Wallet.module.css";
import buttonStyles from "../styles/Button.module.css";

export function ConnectWallet() {
  const { connect } = React.useContext(WalletContext);

  return (
    <button
      className={[buttonStyles.button, walletStyles.connectWallet].join(" ")}
      onClick={connect}
    >
      Connect to Wallet
    </button>
  );
}
