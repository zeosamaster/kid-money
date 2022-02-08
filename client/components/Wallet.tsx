import React from "react";
import { TokenContext } from "../context/TokenContext";
import { WalletContext } from "../context/WalletContext";
import walletStyles from "../styles/Wallet.module.css";
import { ConnectWallet } from "./ConnectWallet";
import Loading from "./Loading";
import TokenAmount from "./TokenAmount";
import WalletAddress from "./WalletAddress";

export default function Wallet() {
  const { supportedNetwork, account } = React.useContext(WalletContext);
  const { balance } = React.useContext(TokenContext);

  const isLoading = !supportedNetwork;
  const loggedOut = supportedNetwork && account === null;
  const loggedIn = supportedNetwork && account !== null;

  const addressCardClass = [
    walletStyles.card,
    ...(loggedOut ? [walletStyles.connectWallet] : []),
  ].join(" ");

  return (
    <div className={walletStyles.container}>
      <div className={addressCardClass}>
        {isLoading && <Loading />}
        {loggedOut && <ConnectWallet />}
        {loggedIn && <WalletAddress address={account} />}
      </div>

      <div className={walletStyles.card}>
        {balance === null && <Loading />}
        {balance !== null && <TokenAmount value={balance} />}
      </div>
    </div>
  );
}
