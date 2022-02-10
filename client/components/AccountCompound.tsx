import React from "react";
import { BankContext } from "../context/BankContext";
import { I18nContext } from "../context/I18nContext";
import styles from "../styles/Home.module.css";
import { withForm } from "../utils/form";
import Form from "./Form";
import Loading from "./Loading";
import TokenAmount from "./TokenAmount";

export default function AccountCompound() {
  const _ = React.useContext(I18nContext);
  const { accountInfo, bankConfigs, compound } = React.useContext(BankContext);

  const compoundPercentage = bankConfigs?.compoundPercentage;
  const maxCompoundReturn = bankConfigs?.maxCompoundReturn;
  const savings = accountInfo?.savings;
  const compoundReturn =
    savings && compoundPercentage
      ? savings.mul(compoundPercentage).div(100)
      : null;

  return (
    <div className={styles.accountSection}>
      <h2>{_("ACCOUNT_COMPOUNDING.TITLE")}</h2>

      <p className={styles.compoundPercentage}>
        {!compoundPercentage && <Loading />}
        {compoundPercentage && (
          <>
            {_("ACCOUNT_COMPOUNDING.COMPOUNDING_PERCENTAGE")}:{" "}
            {compoundPercentage}% (
            {compoundReturn && <TokenAmount value={compoundReturn} />})
          </>
        )}
      </p>

      <p className={styles.maxCompoundReturn}>
        {!maxCompoundReturn && <Loading />}
        {maxCompoundReturn && (
          <>
            {_("ACCOUNT_COMPOUNDING.MAX_COMPOUND_RETURN")}:{" "}
            <TokenAmount value={maxCompoundReturn} />
          </>
        )}
      </p>

      <div className={styles.grid}>
        <div className={styles.card} style={{ gridColumn: "1 / span 2" }}>
          <h3>💰 {_("ACCOUNT_COMPOUNDING.COMPOUND.HEADER")}</h3>
          <p>{_("ACCOUNT_COMPOUNDING.COMPOUND.DESCRIPTION")}</p>
          <Form onSubmit={withForm(compound)} />
        </div>
      </div>
    </div>
  );
}
