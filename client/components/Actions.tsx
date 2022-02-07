import React from "react";
import AccountBalance from "./AccountBalance";
import AccountCompound from "./AccountCompound";
import AccountSavings from "./AccountSavings";

export default function Actions() {
  return (
    <>
      <AccountBalance />
      <AccountSavings />
      <AccountCompound />
    </>
  );
}
