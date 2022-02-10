import React from "react";
import { I18nContext } from "../context/I18nContext";
import { WalletContext } from "../context/WalletContext";
import buttonStyles from "../styles/Button.module.css";

export function ConnectWallet() {
  const _ = React.useContext(I18nContext);
  const { connect } = React.useContext(WalletContext);

  return (
    <button className={[buttonStyles.button].join(" ")} onClick={connect}>
      {_("WALLET.CONNECT")}
    </button>
  );
}
