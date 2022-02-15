import { ethers } from "ethers";
import React, { PropsWithChildren } from "react";
import ChainlinkETHUSDContract from "../contracts/DataFeeds.json";
import { getContract } from "../utils/metamask";
import { WalletContext } from "./WalletContext";

interface DataFeed {
  feed: string;
  answer: number | null;
}

const initialState: DataFeed = {
  feed: "eth-usd",
  answer: null,
};

export const DataFeedContext = React.createContext<DataFeed>(initialState);

export function DataFeedContextProvider({ children }: PropsWithChildren<{}>) {
  const { networkId } = React.useContext(WalletContext);
  const [dataFeedContract, setDataFeedContract] =
    React.useState<ethers.Contract | null>(null);
  const [feed, setFeed] = React.useState("eth-usd");
  const [answer, setAnswer] = React.useState<number | null>(null);

  // data feed contract
  const getDataFeedContract = React.useCallback(async () => {
    try {
      if (!networkId) {
        throw Error("Unable to detect network");
      }

      const dataFeedNetworks: Record<string, any> =
        ChainlinkETHUSDContract.networks;
      const dataFeedContractAddress: string | undefined =
        dataFeedNetworks[networkId]?.[feed];

      if (!dataFeedContractAddress) {
        throw Error(`DataFeed contract unavailable`);
      }

      // Get the data feed contract instance.
      const contract = getContract(
        dataFeedContractAddress,
        ChainlinkETHUSDContract.abi
      );
      setDataFeedContract(contract);
    } catch (e) {
      setDataFeedContract(null);
      console.error("Failed to get dataFeed contract:", e);
    }
  }, [networkId, feed]);

  React.useEffect(() => {
    if (networkId) {
      getDataFeedContract();
    }
  }, [networkId, feed, getDataFeedContract]);

  // answer
  const getAnswer = React.useCallback(async () => {
    try {
      if (!dataFeedContract) {
        throw Error("DataFeed contract unavailable");
      }

      const latestAnswer = await dataFeedContract.latestAnswer();
      const decimals = await dataFeedContract.decimals();
      const parsedAnswer = ethers.utils.formatUnits(latestAnswer, decimals);

      setAnswer(Number(parsedAnswer));
    } catch (e) {
      setAnswer(null);
      console.error("Unexpected error getting latest data feed answer:", e);
    }
  }, [dataFeedContract]);

  React.useEffect(() => {
    if (!dataFeedContract) {
      return;
    }

    getAnswer();
  }, [dataFeedContract, getAnswer]);

  // context value
  const value: DataFeed = React.useMemo(() => {
    return {
      feed,
      answer,
    };
  }, [feed, answer]);

  return (
    <DataFeedContext.Provider value={value}>
      {children}
    </DataFeedContext.Provider>
  );
}
