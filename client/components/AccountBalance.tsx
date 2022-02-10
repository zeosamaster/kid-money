import React from "react";
import { BankContext } from "../context/BankContext";
import { I18nContext } from "../context/I18nContext";
import { TokenContext } from "../context/TokenContext";
import styles from "../styles/Home.module.css";
import { withFormAmount } from "../utils/form";
import AmountForm from "./AmountForm";
import Loading from "./Loading";
import TokenAmount from "./TokenAmount";

export default function AccountBalance() {
  const _ = React.useContext(I18nContext);
  const { deposit, withdraw, accountInfo } = React.useContext(BankContext);
  const { balance } = React.useContext(TokenContext);

  const accountBalance = accountInfo?.balance;

  return (
    <div className={styles.accountSection}>
      <h2>{_("ACCOUNT_BALANCE.TITLE")}</h2>

      <p className={styles.tokenAmount}>
        {!accountBalance && <Loading />}
        {accountBalance && <TokenAmount value={accountBalance} />}
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>🏦 {_("ACCOUNT_BALANCE.DEPOSIT.HEADER")}</h3>
          <p>{_("ACCOUNT_BALANCE.DEPOSIT.DESCRIPTION")}</p>
          <AmountForm onSubmit={withFormAmount(deposit)} max={balance} />
        </div>

        <div className={styles.card}>
          <h3>💸 {_("ACCOUNT_BALANCE.WITHDRAW.HEADER")}</h3>
          <p>{_("ACCOUNT_BALANCE.WITHDRAW.DESCRIPTION")}</p>
          <AmountForm
            onSubmit={withFormAmount(withdraw)}
            max={accountBalance}
          />
        </div>
      </div>
    </div>
  );
}
