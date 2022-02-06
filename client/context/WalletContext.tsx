import React, { PropsWithChildren } from "react";
import {
  getNetworkId,
  getConnectedAccount,
  onNetworkChange,
  connectAccount,
  syncMetamask,
} from "../utils/metamask";

interface Wallet {
  networkId: string | null;
  supportedNetwork: boolean;
  account: string | null;
  connect: () => Promise<void>;
}

const initialState: Wallet = {
  networkId: null,
  supportedNetwork: false,
  account: null,
  connect: () => Promise.reject(),
};

export const supportedNetworks: Record<string, string> = {
  "4": "Rinkeby",
};

export const WalletContext = React.createContext<Wallet>(initialState);

export function WalletContextProvider({ children }: PropsWithChildren<{}>) {
  const [networkId, setNetworkId] = React.useState<string | null>(null);
  const [account, setAccount] = React.useState<string | null>(null);

  // network
  const checkNetworkId = React.useCallback(async () => {
    try {
      syncMetamask();

      const id = (await getNetworkId()).replace(/^0x/, "");
      setNetworkId(id);
    } catch (e) {
      setNetworkId(null);
      console.error("Unexpected error checking network:", e);
    }
  }, []);

  React.useEffect(() => {
    checkNetworkId();
    onNetworkChange(() => checkNetworkId());
  }, [checkNetworkId]);

  // user account
  const getAccount = React.useCallback(async () => {
    try {
      const connectedAccount = await getConnectedAccount();
      setAccount(connectedAccount);
    } catch (e) {
      setAccount(null);
      console.error("Unexpected error getting account:", e);
    }
  }, []);

  React.useEffect(() => {
    getAccount();
  }, [getAccount]);

  // connect wallet
  const connect = React.useCallback(async () => {
    try {
      const connectedAccount = await connectAccount();
      setAccount(connectedAccount);
    } catch (e) {
      console.error("Unexpected error connecting to wallet:", e);
      throw e;
    }
  }, [setAccount]);

  // context value
  const value: Wallet = React.useMemo(() => {
    if (!networkId) {
      return initialState;
    }

    return {
      account,
      supportedNetwork: !!supportedNetworks[networkId],
      networkId,
      connect,
    };
  }, [account, networkId, connect]);

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
