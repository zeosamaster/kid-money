import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

let ethereumInstance: any;
let signer: ethers.providers.JsonRpcSigner;
let contracts: Record<string, ethers.Contract> = {};

export function syncMetamask() {
  const { ethereum } = window;

  if (!ethereum) {
    throw new Error("Ethereum object doesn't exist");
  }

  ethereumInstance = ethereum;

  const provider = new ethers.providers.Web3Provider(ethereum);
  signer = provider.getSigner();

  return ethereum;
}

function getEthereum() {
  if (ethereumInstance) {
    return ethereumInstance;
  }

  return syncMetamask();
}

export const getContract = (address: string, abi: any): ethers.Contract => {
  if (contracts[address]) {
    return contracts[address];
  }

  const contract = new ethers.Contract(address, abi, signer);
  contracts[address] = contract;

  return contract;
};

export const getConnectedAccount = async (): Promise<string | null> => {
  const accounts = await getEthereum().request({ method: "eth_accounts" });

  if (accounts.length === 0) {
    return null;
  }

  return accounts[0];
};

export const getNetworkId = async (): Promise<string> => {
  return getEthereum().request({ method: "eth_chainId" });
};

export const addNetwork = async ({
  networkId,
  networkName,
  rpcUrls,
}: {
  networkId: string;
  networkName: string;
  rpcUrls: string[];
}): Promise<void> => {
  await getEthereum().request({
    method: "wallet_addEthereumChain",
    params: [{ chainId: networkId, chainName: networkName, rpcUrls }],
  });
};

export const switchNetwork = async (networkId: string): Promise<void> => {
  await getEthereum().request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: networkId }],
  });
};

export const addToken = async ({
  address,
  symbol,
}: {
  address: string;
  symbol: string;
}): Promise<void> => {
  await getEthereum().request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: { address, symbol },
    },
  });
};

export const onNetworkChange = (cb: () => void): void => {
  getEthereum().on("chainChanged", cb);
};

export const connectAccount = async (): Promise<string> => {
  const accounts = await getEthereum().request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
};
