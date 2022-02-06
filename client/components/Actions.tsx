import React from "react";
import { BankContext } from "../context/BankContext";
import styles from "../styles/Home.module.css";
import { withForm, withFormAmount } from "../utils/form";
import AmountForm from "./AmountForm";
import Form from "./Form";

export default function Actions() {
  const { deposit, withdraw, save, unsave, compound } =
    React.useContext(BankContext);

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

      <div className={styles.card}>
        <h2>💵 Save</h2>
        <p>Save your tokens to get even more tokens</p>
        <AmountForm onSubmit={withFormAmount(save)} />
      </div>

      <div className={styles.card}>
        <h2>💴 Unsave</h2>
        <p>Unsave your tokens so you can decide what else to do with them</p>
        <AmountForm onSubmit={withFormAmount(unsave)} />
      </div>

      <div className={styles.card} style={{ gridColumn: "1 / span 2" }}>
        <h2>💰 Compound</h2>
        <p>Compound your locked savings to enjoy growing returns</p>
        <Form onSubmit={withForm(compound)} />
      </div>
    </>
  );
}
