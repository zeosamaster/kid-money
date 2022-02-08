import { ethers } from "ethers";
import React, { PropsWithChildren } from "react";
import BankContract from "../contracts/Bank.json";
import useContractEventListeners, {
  ContractEventListeners,
} from "../hooks/useContractEventListeners";
import { getContract } from "../utils/metamask";
import { TokenContext } from "./TokenContext";
import { WalletContext } from "./WalletContext";

export enum BankEvent {
  DEPOSIT = "Deposit",
  WITHDRAW = "Withdraw",
  SAVE = "Save",
  UNSAVE = "Unsave",
  COMPOUND = "Compound",
}

interface AccountInfo {
  balance: ethers.BigNumber;
  savings: ethers.BigNumber;
  savingsDate: ethers.BigNumber;
}

interface Bank extends ContractEventListeners<BankEvent> {
  accountInfo: AccountInfo | null;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  save: (amount: number) => Promise<void>;
  unsave: (amount: number) => Promise<void>;
  compound: () => Promise<void>;
}

const initialBank: Bank = {
  accountInfo: null,
  deposit: () => Promise.reject(),
  withdraw: () => Promise.reject(),
  save: () => Promise.reject(),
  unsave: () => Promise.reject(),
  compound: () => Promise.reject(),
  addEventListener: () => {},
  removeEventListener: () => {},
};

export const BankContext = React.createContext<Bank>(initialBank);

export function BankContextProvider({ children }: PropsWithChildren<{}>) {
  const { networkId, supportedNetwork, account } =
    React.useContext(WalletContext);
  const { isApproved, approve } = React.useContext(TokenContext);
  const [bankContract, setBankContract] =
    React.useState<ethers.Contract | null>(null);
  const [accountInfo, setAccountInfo] = React.useState<AccountInfo | null>(
    null
  );
  const { on, off } = useContractEventListeners<BankEvent>(bankContract);

  // bank contract
  const getBankContract = React.useCallback(async () => {
    try {
      if (!networkId) {
        throw Error("Unable to detect network");
      }

      const bankNetworks: Record<string, any> = BankContract.networks;
      const bankContractAddress: string = bankNetworks[networkId]?.address;

      if (!bankContractAddress) {
        throw Error(
          `Bank contract unavailable on the current network ${networkId}`
        );
      }

      // Get the token contract instance.
      const contract = getContract(bankContractAddress, BankContract.abi);
      setBankContract(contract);
    } catch (e) {
      setBankContract(null);
      console.error("Failed to get bank contract:", e);
    }
  }, [networkId]);

  React.useEffect(() => {
    if (supportedNetwork) {
      getBankContract();
    } else {
      setBankContract(null);
      setAccountInfo(null);
    }
  }, [getBankContract, supportedNetwork]);

  // user account info
  const getAccountInfo = React.useCallback(async () => {
    try {
      if (!supportedNetwork) {
        return;
      }

      if (!bankContract) {
        throw Error("Bank contract unavailable");
      }

      if (!account) {
        throw Error("No connected account available");
      }

      const info = await bankContract.getAccount();
      setAccountInfo(info);
    } catch (e) {
      setAccountInfo(null);
      console.error("Unexpected error getting bank account info:", e);
    }
  }, [supportedNetwork, bankContract, account]);

  React.useEffect(() => {
    if (bankContract && account) {
      getAccountInfo();
    }
  }, [getAccountInfo, bankContract, account]);

  // bank user methods
  const deposit = React.useCallback(
    async (amount: number) => {
      try {
        if (!bankContract) {
          throw Error("Bank contract unavailable");
        }

        if (!isApproved) {
          await approve();
        }

        const bigNumberAmount = ethers.utils.parseUnits(amount.toString(), 18);
        await bankContract.deposit(bigNumberAmount);
      } catch (e) {
        console.error("Unexpected error depositing:", e);
        throw e;
      }
    },
    [bankContract, isApproved, approve]
  );

  const withdraw = React.useCallback(
    async (amount: number) => {
      try {
        if (!bankContract) {
          throw Error("Bank contract unavailable");
        }

        const bigNumberAmount = ethers.utils.parseUnits(amount.toString(), 18);
        await bankContract.withdraw(bigNumberAmount);
      } catch (e) {
        console.error("Unexpected error withdrawing:", e);
        throw e;
      }
    },
    [bankContract]
  );

  const save = React.useCallback(
    async (amount: number) => {
      try {
        if (!bankContract) {
          throw Error("Bank contract unavailable");
        }

        const bigNumberAmount = ethers.utils.parseUnits(amount.toString(), 18);
        await bankContract.save(bigNumberAmount);
      } catch (e) {
        console.error("Unexpected error saving:", e);
        throw e;
      }
    },
    [bankContract]
  );

  const unsave = React.useCallback(
    async (amount: number) => {
      try {
        if (!bankContract) {
          throw Error("Bank contract unavailable");
        }

        const bigNumberAmount = ethers.utils.parseUnits(amount.toString(), 18);
        await bankContract.unsave(bigNumberAmount);
      } catch (e) {
        console.error("Unexpected error unsaving:", e);
        throw e;
      }
    },
    [bankContract]
  );

  const compound = React.useCallback(async () => {
    try {
      if (!bankContract) {
        throw Error("Bank contract unavailable");
      }

      await bankContract.compound();
    } catch (e) {
      console.error("Unexpected error compounding:", e);
      throw e;
    }
  }, [bankContract]);

  // listen to events
  React.useEffect(() => {
    if (!bankContract || !account) {
      return;
    }

    const topicsToSubscribe = [
      ethers.utils.id("Deposit(address,uint256)"),
      ethers.utils.id("Withdraw(address,uint256)"),
      ethers.utils.id("Save(address,uint256)"),
      ethers.utils.id("Unsave(address,uint256)"),
      ethers.utils.id("Compound(address,uint256)"),
    ];
    const eventFilter = {
      topics: [topicsToSubscribe, ethers.utils.hexZeroPad(account, 32)],
    };

    on(eventFilter, getAccountInfo);

    return () => {
      off(eventFilter, getAccountInfo);
    };
  }, [bankContract, on, off, account, getAccountInfo]);

  // context value
  const value: Bank = React.useMemo(() => {
    if (!bankContract) {
      return initialBank;
    }

    return {
      accountInfo,
      deposit,
      withdraw,
      save,
      unsave,
      compound,
      addEventListener: on,
      removeEventListener: off,
    };
  }, [
    bankContract,
    accountInfo,
    deposit,
    withdraw,
    save,
    unsave,
    compound,
    on,
    off,
  ]);

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}
