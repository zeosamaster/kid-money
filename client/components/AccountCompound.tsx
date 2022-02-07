import React from "react";
import { BankContext } from "../context/BankContext";
import styles from "../styles/Home.module.css";
import { withForm } from "../utils/form";
import Form from "./Form";

export default function AccountCompound() {
  const { compound } = React.useContext(BankContext);

  return (
    <>
      <div className={styles.card} style={{ gridColumn: "1 / span 2" }}>
        <h2>💰 Compound</h2>
        <p>Compound your locked savings to enjoy growing returns</p>
        <Form onSubmit={withForm(compound)} />
      </div>
    </>
  );
}
