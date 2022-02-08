import { ethers, EventFilter } from "ethers";
import React, { PropsWithChildren } from "react";
import BankContract from "../contracts/Bank.json";
import TokenContract from "../contracts/Token.json";
import useContractEventListeners, {
  ContractEventListeners,
} from "../hooks/useContractEventListeners";
import { getContract } from "../utils/metamask";
import { WalletContext } from "./WalletContext";

export enum TokenEvent {
  APPROVAL = "Approval",
  TRANSFER = "Transfer",
}

interface Token extends ContractEventListeners<TokenEvent> {
  balance: ethers.BigNumber | null;
  isApproved: boolean;
  approve: () => Promise<void>;
}

const initialToken: Token = {
  balance: null,
  isApproved: false,
  approve: () => Promise.reject(),
  addEventListener: () => {},
  removeEventListener: () => {},
};

export const TokenContext = React.createContext<Token>(initialToken);

export function TokenContextProvider({ children }: PropsWithChildren<{}>) {
  const { networkId, supportedNetwork, account } =
    React.useContext(WalletContext);
  const [tokenContract, setTokenContract] =
    React.useState<ethers.Contract | null>(null);
  const [balance, setBalance] = React.useState<ethers.BigNumber | null>(null);
  const [isApproved, setIsApproved] = React.useState<boolean>(false);
  const { on, off } = useContractEventListeners<TokenEvent>(tokenContract);

  // token contract
  const getTokenContract = React.useCallback(async () => {
    try {
      if (!networkId) {
        throw Error("Unable to detect network");
      }

      const tokenNetworks: Record<string, any> = TokenContract.networks;
      const tokenContractAddress: string = tokenNetworks[networkId]?.address;

      if (!tokenContractAddress) {
        throw Error(
          `Token contract unavailable on the current network ${networkId}`
        );
      }

      // Get the token contract instance.
      const contract = getContract(tokenContractAddress, TokenContract.abi);
      setTokenContract(contract);
    } catch (e) {
      setTokenContract(null);
      console.error("Unexpected error getting token contract:", e);
    }
  }, [networkId]);

  React.useEffect(() => {
    if (supportedNetwork) {
      getTokenContract();
    } else {
      setTokenContract(null);
      setBalance(null);
      setIsApproved(false);
    }
  }, [getTokenContract, supportedNetwork]);

  // balance
  const getBalance = React.useCallback(async () => {
    try {
      if (!supportedNetwork) {
        return;
      }

      if (!tokenContract) {
        throw Error("Token contract unavailable");
      }

      if (!account) {
        throw Error("No connected account available");
      }

      const value = await tokenContract.balanceOf(account);
      setBalance(value);
    } catch (e) {
      setBalance(null);
      console.error("Unexpected error getting token balance:", e);
    }
  }, [tokenContract, supportedNetwork, account]);

  React.useEffect(() => {
    if (tokenContract && account) {
      getBalance();
    }
  }, [getBalance, tokenContract, account]);

  // check approval
  const getApproval = React.useCallback(async () => {
    try {
      if (!supportedNetwork) {
        return;
      }

      if (!networkId) {
        throw Error("Unable to detect network");
      }

      if (!tokenContract) {
        throw Error("Token contract unavailable");
      }

      if (!account) {
        throw Error("No connected account available");
      }

      const bankContractNetworks: Record<string, any> = BankContract.networks;
      const bankContractAddress = bankContractNetworks[networkId]?.address;

      if (!bankContractAddress) {
        throw Error(
          `Bank contract unavailable on the current network ${networkId}`
        );
      }

      const value = await tokenContract.allowance(account, bankContractAddress);
      setIsApproved(value.gt(0));
    } catch (e) {
      setIsApproved(false);
      console.error("Unexpected error getting token approval:", e);
    }
  }, [tokenContract, supportedNetwork, networkId, account]);

  React.useEffect(() => {
    if (networkId && tokenContract && account) {
      getApproval();
    }
  }, [getApproval, networkId, tokenContract, account]);

  // approve
  const approve = React.useCallback(async () => {
    try {
      if (!supportedNetwork) {
        return;
      }

      if (!networkId) {
        throw Error("Unable to detect network");
      }

      if (!tokenContract) {
        throw Error("Token contract unavailable");
      }

      const bankContractNetworks: Record<string, any> = BankContract.networks;
      const bankContractAddress = bankContractNetworks[networkId]?.address;

      if (!bankContractAddress) {
        throw Error(
          `Bank contract unavailable on the current network ${networkId}`
        );
      }

      const tx = await tokenContract.approve(
        bankContractAddress,
        ethers.constants.MaxUint256
      );

      await tx.wait();

      setIsApproved(true);
    } catch (e) {
      console.error("Unexpected error approving token spending:", e);
      throw e;
    }
  }, [tokenContract, supportedNetwork, networkId]);

  // listen to events
  React.useEffect(() => {
    if (!tokenContract || !account) {
      return;
    }

    const transferFromTopic = [
      ethers.utils.id("Transfer(address,address,uint256)"),
      ethers.utils.hexZeroPad(account, 32),
      null,
      null,
    ] as EventFilter["topics"];
    const transferToTopic = [
      ethers.utils.id("Transfer(address,address,uint256)"),
      null,
      ethers.utils.hexZeroPad(account, 32),
      null,
    ] as EventFilter["topics"];
    const approvalTopic = [
      ethers.utils.id("Approval(address,address,uint256)"),
      ethers.utils.hexZeroPad(account, 32),
      null,
      null,
    ] as EventFilter["topics"];

    on({ topics: transferFromTopic }, getBalance);
    on({ topics: transferToTopic }, getBalance);
    on({ topics: approvalTopic }, getApproval);

    return () => {
      off({ topics: transferFromTopic }, getBalance);
      off({ topics: transferToTopic }, getBalance);
      off({ topics: approvalTopic }, getApproval);
    };
  }, [tokenContract, on, off, account, getBalance, getApproval]);

  // context value
  const value: Token = React.useMemo(() => {
    if (!tokenContract) {
      return initialToken;
    }

    return {
      balance,
      isApproved,
      approve,
      addEventListener: on,
      removeEventListener: off,
    };
  }, [tokenContract, balance, isApproved, approve, on, off]);

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
}
