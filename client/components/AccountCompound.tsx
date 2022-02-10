import React from "react";
import { BankContext } from "../context/BankContext";
import styles from "../styles/Home.module.css";
import { withForm } from "../utils/form";
import Form from "./Form";
import Loading from "./Loading";
import TokenAmount from "./TokenAmount";

export default function AccountCompound() {
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
      <h2>Compounding</h2>

      <p className={styles.compoundPercentage}>
        {!compoundPercentage && <Loading />}
        {compoundPercentage && (
          <>
            Compound percentage: {compoundPercentage}% (
            {compoundReturn && <TokenAmount value={compoundReturn} />})
          </>
        )}
      </p>

      <p className={styles.maxCompoundReturn}>
        {!maxCompoundReturn && <Loading />}
        {maxCompoundReturn && (
          <>
            Max compound return: <TokenAmount value={maxCompoundReturn} />
          </>
        )}
      </p>

      <div className={styles.grid}>
        <div className={styles.card} style={{ gridColumn: "1 / span 2" }}>
          <h3>💰 Compound</h3>
          <p>Compound your locked savings to enjoy growing returns</p>
          <Form onSubmit={withForm(compound)} />
        </div>
      </div>
    </div>
  );
}
