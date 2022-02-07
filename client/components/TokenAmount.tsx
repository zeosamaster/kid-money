import { ethers } from "ethers";

interface Props {
  value: ethers.BigNumber;
}

export default function TokenAmount({ value }: Props) {
  const numericValue = value.toNumber();
  const formattedValue = numericValue.toFixed(2);

  return <span>$KM {formattedValue}</span>;
}
