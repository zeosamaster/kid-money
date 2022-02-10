import React from "react";
import { BankContext } from "../context/BankContext";
import styles from "../styles/Home.module.css";
import { withFormAmount } from "../utils/form";
import AmountForm from "./AmountForm";
import DateTime from "./Date";
import Loading from "./Loading";
import TokenAmount from "./TokenAmount";

export default function AccountSavings() {
  const { save, unsave, accountInfo } = React.useContext(BankContext);

  return (
    <div className={styles.accountSection}>
      <h2>Account savings</h2>

      <p className={styles.tokenAmount}>
        {!accountInfo?.savings && <Loading />}
        {accountInfo?.savings && <TokenAmount value={accountInfo.savings} />}
      </p>

      <p className={styles.savingsDate}>
        {!accountInfo?.savingsDate && <Loading />}
        {accountInfo?.savingsDate && (
          <>
            Savings Date: <DateTime value={accountInfo.savingsDate} />
          </>
        )}
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>💵 Save</h3>
          <p>Save your tokens to get even more tokens</p>
          <AmountForm
            onSubmit={withFormAmount(save)}
            max={accountInfo?.balance}
          />
        </div>

        <div className={styles.card}>
          <h3>💴 Unsave</h3>
          <p>Unsave your tokens so you can decide what else to do with them</p>
          <AmountForm
            onSubmit={withFormAmount(unsave)}
            max={accountInfo?.savings}
          />
        </div>
      </div>
    </div>
  );
}
