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

  return (
    <div className={walletStyles.container}>
      {account === null && <ConnectWallet />}
      {account !== null && <WalletAddress address={account} />}

      {balance !== null && (
        <p className={walletStyles.tokenAmount}>
          <TokenAmount value={balance} />
        </p>
      )}
    </div>
  );
}
