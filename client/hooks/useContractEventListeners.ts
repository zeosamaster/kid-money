import { ethers } from "ethers";
import React from "react";

type ContractEventFilter<T> = T | ethers.EventFilter;

export interface ContractEventListeners<EventName> {
  addEventListener: (
    eventName: ContractEventFilter<EventName>,
    callback: (...args: any[]) => void
  ) => void;
  removeEventListener: (
    eventName: ContractEventFilter<EventName>,
    callback: (...args: any[]) => void
  ) => void;
}

export default function useContractEventListeners<EventName>(
  contract: ethers.Contract | null
) {
  // event listeners
  const on = React.useCallback(
    (
      event: ContractEventFilter<EventName>,
      callback: (...args: any[]) => void
    ) => {
      if (!contract) {
        throw Error("Contract unavailable");
      }

      contract.on(event, callback);
    },
    [contract]
  );

  const off = React.useCallback(
    (
      event: ContractEventFilter<EventName>,
      callback: (...args: any[]) => void
    ) => {
      if (!contract) {
        throw Error("Contract unavailable");
      }

      contract.on(event, callback);
    },
    [contract]
  );

  if (!contract) {
    return { on: () => {}, off: () => {} };
  }

  return { on, off };
}
