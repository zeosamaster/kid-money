import styles from "../styles/Home.module.css";

export default function Actions() {
  return (
    <>
      <div className={styles.card}>
        <h2>🏦 Deposit</h2>
        <p>Deposit your tokens to be able to save & compound</p>
      </div>

      <div className={styles.card}>
        <h2>💸 Withdraw</h2>
        <p>Withdraw tokens to convert them to money you can spend</p>
      </div>

      <div className={styles.card}>
        <h2>💵 Save</h2>
        <p>Save your tokens to get even more tokens</p>
      </div>

      <div className={styles.card}>
        <h2>💱 Unsave</h2>
        <p>Unsave your tokens so you can decide what else to do with them</p>
      </div>

      <div className={styles.card} style={{ gridColumn: "1 / span 2" }}>
        <h2>💰 Compound</h2>
        <p>Compound your locked savings to enjoy growing returns</p>
      </div>
    </>
  );
}
