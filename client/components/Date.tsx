import { ethers } from "ethers";

export default function DateTime({ value }: { value: ethers.BigNumber }) {
  const date = new Date(value.toNumber() * 1000);
  return <>{date.toUTCString()}</>;
}
