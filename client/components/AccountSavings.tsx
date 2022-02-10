import React from "react";
import { BankContext } from "../context/BankContext";
import { I18nContext } from "../context/I18nContext";
import styles from "../styles/Home.module.css";
import { withFormAmount } from "../utils/form";
import AmountForm from "./AmountForm";
import DateTime from "./Date";
import Loading from "./Loading";
import TokenAmount from "./TokenAmount";

export default function AccountSavings() {
  const _ = React.useContext(I18nContext);
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
      <h2>{_("ACCOUNT_SAVINGS.TITLE")}</h2>

      <p className={styles.tokenAmount}>
        {!savings && <Loading />}
        {savings && <TokenAmount value={savings} />}
      </p>

      <p className={styles.savingsDate}>
        {!savingsDate && <Loading />}
        {savingsDate && (
          <>
            {_("ACCOUNT_SAVINGS.SAVINGS_DATE")}:{" "}
            <DateTime value={savingsDate} />
          </>
        )}
      </p>

      <p className={styles.unlockDate}></p>
      {!unlockDate && <Loading />}
      {unlockDate && (
        <>
          {_("ACCOUNT_SAVINGS.UNLOCK_DATE")}: <DateTime value={unlockDate} />
        </>
      )}

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>💵 {_("ACCOUNT_SAVINGS.SAVE.HEADER")}</h3>
          <p>{_("ACCOUNT_SAVINGS.SAVE.DESCRIPTION")}</p>
          <AmountForm onSubmit={withFormAmount(save)} max={balance} />
        </div>

        <div className={styles.card}>
          <h3>💴 {_("ACCOUNT_SAVINGS.UNSAVE.HEADER")}</h3>
          <p>{_("ACCOUNT_SAVINGS.UNSAVE.DESCRIPTION")}</p>
          <AmountForm onSubmit={withFormAmount(unsave)} max={savings} />
        </div>
      </div>
    </div>
  );
}
