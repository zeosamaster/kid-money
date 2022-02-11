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

interface BankConfigs {
  compoundPeriod: ethers.BigNumber;
  compoundPercentage: number;
  maxCompoundReturn: ethers.BigNumber;
}

interface Bank extends ContractEventListeners<BankEvent> {
  accountInfo: AccountInfo | null;
  bankConfigs: BankConfigs | null;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  save: (amount: number) => Promise<void>;
  unsave: (amount: number) => Promise<void>;
  compoundAndSave: () => Promise<void>;
  compoundAndWithdrawReturns: () => Promise<void>;
  compoundAndWithdrawAll: () => Promise<void>;
}

const initialBank: Bank = {
  accountInfo: null,
  bankConfigs: null,
  deposit: () => Promise.reject(),
  withdraw: () => Promise.reject(),
  save: () => Promise.reject(),
  unsave: () => Promise.reject(),
  compoundAndSave: () => Promise.reject(),
  compoundAndWithdrawReturns: () => Promise.reject(),
  compoundAndWithdrawAll: () => Promise.reject(),
  addEventListener: () => {},
  removeEventListener: () => {},
};

export const BankContext = React.createContext<Bank>(initialBank);

export function BankContextProvider({ children }: PropsWithChildren<{}>) {
  const { networkId, supportedNetwork, account } =
    React.useContext(WalletContext);
  const { allowance, approve } = React.useContext(TokenContext);
  const [bankContract, setBankContract] =
    React.useState<ethers.Contract | null>(null);
  const [accountInfo, setAccountInfo] = React.useState<AccountInfo | null>(
    null
  );
  const [bankConfigs, setBankConfigs] = React.useState<BankConfigs | null>(
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

  // bank configs
  const getBankConfigs = React.useCallback(async () => {
    try {
      if (!supportedNetwork) {
        return;
      }

      if (!bankContract) {
        throw Error("Bank contract unavailable");
      }

      const compoundPeriod = await bankContract.compoundPeriod();
      const compoundPercentage = await bankContract.compoundPercentage();
      const maxCompoundReturn = await bankContract.maxCompoundReturn();

      setBankConfigs({
        compoundPeriod,
        compoundPercentage: compoundPercentage.toNumber(),
        maxCompoundReturn,
      });
    } catch (e) {
      setBankConfigs(null);
      console.error("Unexpected error getting bank account info:", e);
    }
  }, [supportedNetwork, bankContract]);

  React.useEffect(() => {
    if (bankContract) {
      getBankConfigs();
    }
  }, [getBankConfigs, bankContract]);

  // bank user methods
  const deposit = React.useCallback(
    async (amount: number) => {
      try {
        if (!bankContract) {
          throw Error("Bank contract unavailable");
        }

        const bigNumberAmount = ethers.utils.parseUnits(amount.toString(), 18);

        if (!allowance || allowance.lt(bigNumberAmount)) {
          await approve();
        }

        await bankContract.deposit(bigNumberAmount);
      } catch (e) {
        console.error("Unexpected error depositing:", e);
        throw e;
      }
    },
    [bankContract, approve, allowance]
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

  const compoundAndSave = React.useCallback(async () => {
    try {
      if (!bankContract) {
        throw Error("Bank contract unavailable");
      }

      await bankContract.compoundAndSave();
    } catch (e) {
      console.error("Unexpected error compounding (compoundAndSave):", e);
      throw e;
    }
  }, [bankContract]);

  const compoundAndWithdrawReturns = React.useCallback(async () => {
    try {
      if (!bankContract) {
        throw Error("Bank contract unavailable");
      }

      await bankContract.compoundAndWithdrawReturns();
    } catch (e) {
      console.error(
        "Unexpected error compounding (compoundAndWithdrawReturns):",
        e
      );
      throw e;
    }
  }, [bankContract]);

  const compoundAndWithdrawAll = React.useCallback(async () => {
    try {
      if (!bankContract) {
        throw Error("Bank contract unavailable");
      }

      await bankContract.compoundAndWithdrawAll();
    } catch (e) {
      console.error(
        "Unexpected error compounding (compoundAndWithdrawAll):",
        e
      );
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
      bankConfigs,
      deposit,
      withdraw,
      save,
      unsave,
      compoundAndSave,
      compoundAndWithdrawReturns,
      compoundAndWithdrawAll,
      addEventListener: on,
      removeEventListener: off,
    };
  }, [
    bankContract,
    accountInfo,
    bankConfigs,
    deposit,
    withdraw,
    save,
    unsave,
    compoundAndSave,
    compoundAndWithdrawReturns,
    compoundAndWithdrawAll,
    on,
    off,
  ]);

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}
