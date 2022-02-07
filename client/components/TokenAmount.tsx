import { ethers } from "ethers";

interface Props {
  value: ethers.BigNumber;
}

const suffixes = ["", "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
export function abbreviateCommifiedAnswer(commifiedAnswer: string): string {
  // split answer's orders of magnitude
  const splitAnswer = commifiedAnswer.split(",");

  // answers lower than a billion don't need abbreviating
  if (splitAnswer.length < 2) {
    return (Math.floor(Number(commifiedAnswer) * 100) / 100).toFixed(2);
  }

  // get the correct order of magnitude suffix
  const [shortPart, decimals] = splitAnswer;
  const suffix = suffixes[splitAnswer.length - 1];

  // abbreviate with order of magnitude suffix
  const abbreviatedAnswer = `${shortPart}.${decimals.slice(0, 2)}${suffix}`;

  return abbreviatedAnswer;
}

export default function TokenAmount({ value }: Props) {
  const withoutDecimalPrecision = ethers.utils.formatUnits(value, 18);
  const commifiedValue = withoutDecimalPrecision.replace(
    /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
    ","
  );
  const abbreviatedValue = abbreviateCommifiedAnswer(commifiedValue);

  return <>$KM {abbreviatedValue}</>;
}
