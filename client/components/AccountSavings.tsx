import React from "react";
import { BankContext } from "../context/BankContext";
import styles from "../styles/Home.module.css";
import { withFormAmount } from "../utils/form";
import AmountForm from "./AmountForm";
import DateTime from "./Date";
import Loading from "./Loading";
import TokenAmount from "./TokenAmount";

export default function AccountSavings() {
  const { save, unsave, accountInfo, bankConfigs } =
    React.useContext(BankContext);

  const balance = accountInfo?.balance;
  const savings = accountInfo?.savings;
  const savingsDate = accountInfo?.savingsDate;
  const compoundPeriod = bankConfigs?.compoundPeriod;
  const unlockDate =
    accountInfo && compoundPeriod
      ? accountInfo.savingsDate.add(compoundPeriod)
      : null;

  return (
    <div className={styles.accountSection}>
      <h2>Account savings</h2>

      <p className={styles.tokenAmount}>
        {!savings && <Loading />}
        {savings && <TokenAmount value={savings} />}
      </p>

      <p className={styles.savingsDate}>
        {!savingsDate && <Loading />}
        {savingsDate && (
          <>
            Savings Date: <DateTime value={savingsDate} />
          </>
        )}
      </p>

      <p className={styles.unlockDate}></p>
      {!unlockDate && <Loading />}
      {unlockDate && (
        <>
          Unlock Date: <DateTime value={unlockDate} />
        </>
      )}

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>💵 Save</h3>
          <p>Save your tokens to get even more tokens</p>
          <AmountForm onSubmit={withFormAmount(save)} max={balance} />
        </div>

        <div className={styles.card}>
          <h3>💴 Unsave</h3>
          <p>Unsave your tokens so you can decide what else to do with them</p>
          <AmountForm onSubmit={withFormAmount(unsave)} max={savings} />
        </div>
      </div>
    </div>
  );
}
