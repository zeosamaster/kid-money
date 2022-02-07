import React from "react";
import { BankContext } from "../context/BankContext";
import styles from "../styles/Home.module.css";
import { withFormAmount } from "../utils/form";
import AmountForm from "./AmountForm";
import TokenAmount from "./TokenAmount";

export default function AccountBalance() {
  const { deposit, withdraw, accountInfo } = React.useContext(BankContext);

  return (
    <>
      <h2>Account balance</h2>

      <span className={styles.tokenAmount}>
        {accountInfo?.balance && <TokenAmount value={accountInfo.balance} />}
      </span>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>🏦 Deposit</h3>
          <p>Deposit your tokens to be able to save & compound</p>
          <AmountForm onSubmit={withFormAmount(deposit)} />
        </div>

        <div className={styles.card}>
          <h3>💸 Withdraw</h3>
          <p>Withdraw tokens to convert them to money you can spend</p>
          <AmountForm onSubmit={withFormAmount(withdraw)} />
        </div>
      </div>
    </>
  );
}
