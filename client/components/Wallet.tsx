import React from "react";
import { TokenContext } from "../context/TokenContext";
import { WalletContext } from "../context/WalletContext";
import walletStyles from "../styles/Wallet.module.css";
import { getProvider } from "../utils/metamask";
import { ConnectWallet } from "./ConnectWallet";
import Loading from "./Loading";
import TokenAmount from "./TokenAmount";
import WalletAddress from "./WalletAddress";

export default function Wallet() {
  const { supportedNetwork, account } = React.useContext(WalletContext);
  const { balance } = React.useContext(TokenContext);
  const [accountName, setAccountName] = React.useState<string | null>(null);

  const isLoading = !supportedNetwork;
  const loggedOut = supportedNetwork && account === null;
  const loggedIn = supportedNetwork && account !== null;

  const addressCardClass = [
    walletStyles.card,
    ...(loggedOut ? [walletStyles.connectWallet] : []),
  ].join(" ");

  React.useEffect(() => {
    async function lookup(address: string) {
      try {
        const name = await getProvider().lookupAddress(address);
        setAccountName(name || account);
      } catch (e) {
        setAccountName(address);
      }
    }

    if (account) {
      lookup(account);
    }
  }, [account]);

  return (
    <div className={walletStyles.container}>
      <div className={addressCardClass}>
        {isLoading && <Loading />}
        {loggedOut && <ConnectWallet />}
        {loggedIn && !accountName && <Loading />}
        {loggedIn && accountName && <WalletAddress address={accountName} />}
      </div>

      <div className={walletStyles.card}>
        {balance === null && <Loading />}
        {balance !== null && <TokenAmount value={balance} />}
      </div>
    </div>
  );
}
