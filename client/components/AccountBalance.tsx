import React from "react";
import { BankContext } from "../context/BankContext";
import styles from "../styles/Home.module.css";
import { withFormAmount } from "../utils/form";
import AmountForm from "./AmountForm";

export default function AccountBalance() {
  const { deposit, withdraw } = React.useContext(BankContext);

  return (
    <>
      <div className={styles.card}>
        <h2>🏦 Deposit</h2>
        <p>Deposit your tokens to be able to save & compound</p>
        <AmountForm onSubmit={withFormAmount(deposit)} />
      </div>

      <div className={styles.card}>
        <h2>💸 Withdraw</h2>
        <p>Withdraw tokens to convert them to money you can spend</p>
        <AmountForm onSubmit={withFormAmount(withdraw)} />
      </div>
    </>
  );
}
