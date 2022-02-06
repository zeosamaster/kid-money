import styles from "../styles/Home.module.css";
import {
  compound,
  deposit,
  save,
  unsave,
  withdraw,
} from "../utils/contract-methods";
import AmountForm from "./AmountForm";
import Form from "./Form";

export default function Actions() {
  return (
    <>
      <div className={styles.card}>
        <h2>🏦 Deposit</h2>
        <p>Deposit your tokens to be able to save & compound</p>
        <AmountForm onSubmit={deposit} />
      </div>

      <div className={styles.card}>
        <h2>💸 Withdraw</h2>
        <p>Withdraw tokens to convert them to money you can spend</p>
        <AmountForm onSubmit={withdraw} />
      </div>

      <div className={styles.card}>
        <h2>💵 Save</h2>
        <p>Save your tokens to get even more tokens</p>
        <AmountForm onSubmit={save} />
      </div>

      <div className={styles.card}>
        <h2>💱 Unsave</h2>
        <p>Unsave your tokens so you can decide what else to do with them</p>
        <AmountForm onSubmit={unsave} />
      </div>

      <div className={styles.card} style={{ gridColumn: "1 / span 2" }}>
        <h2>💰 Compound</h2>
        <p>Compound your locked savings to enjoy growing returns</p>
        <Form onSubmit={compound} />
      </div>
    </>
  );
}
