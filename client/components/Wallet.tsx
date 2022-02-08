import React from "react";
import { TokenContext } from "../context/TokenContext";
import { WalletContext } from "../context/WalletContext";
import walletStyles from "../styles/Wallet.module.css";
import { ConnectWallet } from "./ConnectWallet";
import TokenAmount from "./TokenAmount";
import WalletAddress from "./WalletAddress";

export default function Wallet() {
  const { account } = React.useContext(WalletContext);
  const { balance } = React.useContext(TokenContext);

  const addressCardClass = [
    walletStyles.card,
    ...(account === null ? [walletStyles.connectWallet] : []),
  ].join(" ");

  return (
    <div className={walletStyles.container}>
      <div className={addressCardClass}>
        {account === null && <ConnectWallet />}
        {account !== null && <WalletAddress address={account} />}
      </div>

      <div className={walletStyles.card}>
        {balance !== null && <TokenAmount value={balance} />}
      </div>
    </div>
  );
}
