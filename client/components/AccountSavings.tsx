import React from "react";
import { BankContext } from "../context/BankContext";
import styles from "../styles/Home.module.css";
import { withFormAmount } from "../utils/form";
import AmountForm from "./AmountForm";

export default function AccountSavings() {
  const { save, unsave } = React.useContext(BankContext);

  return (
    <>
      <div className={styles.card}>
        <h2>💵 Save</h2>
        <p>Save your tokens to get even more tokens</p>
        <AmountForm onSubmit={withFormAmount(save)} />
      </div>

      <div className={styles.card}>
        <h2>💴 Unsave</h2>
        <p>Unsave your tokens so you can decide what else to do with them</p>
        <AmountForm onSubmit={withFormAmount(unsave)} />
      </div>
    </>
  );
}
