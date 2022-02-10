import React from "react";
import { BankContext } from "../context/BankContext";
import { TokenContext } from "../context/TokenContext";
import styles from "../styles/Home.module.css";
import { withFormAmount } from "../utils/form";
import AmountForm from "./AmountForm";
import Loading from "./Loading";
import TokenAmount from "./TokenAmount";

export default function AccountBalance() {
  const { deposit, withdraw, accountInfo } = React.useContext(BankContext);
  const { balance } = React.useContext(TokenContext);

  return (
    <div className={styles.accountSection}>
      <h2>Account balance</h2>

      <p className={styles.tokenAmount}>
        {!accountInfo?.balance && <Loading />}
        {accountInfo?.balance && <TokenAmount value={accountInfo.balance} />}
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>🏦 Deposit</h3>
          <p>Deposit your tokens to be able to save & compound</p>
          <AmountForm onSubmit={withFormAmount(deposit)} max={balance} />
        </div>

        <div className={styles.card}>
          <h3>💸 Withdraw</h3>
          <p>Withdraw tokens to convert them to money you can spend</p>
          <AmountForm
            onSubmit={withFormAmount(withdraw)}
            max={accountInfo?.balance}
          />
        </div>
      </div>
    </div>
  );
}
