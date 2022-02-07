import React from "react";
import { WalletContext } from "../context/WalletContext";
import walletStyles from "../styles/Wallet.module.css";
import { ConnectWallet } from "./ConnectWallet";
import WalletAddress from "./WalletAddress";

export default function Wallet() {
  const { account } = React.useContext(WalletContext);

  return (
    <div className={walletStyles.container}>
      {account === null && <ConnectWallet />}
      {account !== null && <WalletAddress address={account} />}
    </div>
  );
}
