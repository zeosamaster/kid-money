import { ethers } from "ethers";

export default function DateTime({ value }: { value: ethers.BigNumber }) {
  const date = new Date(value.toNumber() * 1000);
  return (
    <>
      {date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      {" - "}
      {date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </>
  );
}
