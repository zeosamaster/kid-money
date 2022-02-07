import React from "react";
import { BankContext } from "../context/BankContext";
import styles from "../styles/Home.module.css";
import { withFormAmount } from "../utils/form";
import AmountForm from "./AmountForm";

export default function AccountSavings() {
  const { save, unsave } = React.useContext(BankContext);

  return (
    <>
      <h2>Account savings</h2>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>💵 Save</h3>
          <p>Save your tokens to get even more tokens</p>
          <AmountForm onSubmit={withFormAmount(save)} />
        </div>

        <div className={styles.card}>
          <h3>💴 Unsave</h3>
          <p>Unsave your tokens so you can decide what else to do with them</p>
          <AmountForm onSubmit={withFormAmount(unsave)} />
        </div>
      </div>
    </>
  );
}
