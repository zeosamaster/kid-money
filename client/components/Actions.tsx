import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Actions() {
  return (
    <>
      <Link href="/account/deposit">
        <a className={styles.card}>
          <h2>Deposit &rarr;</h2>
          <p>Deposit your tokens to be able to save & compound 🏦</p>
        </a>
      </Link>

      <Link href="/account/withdraw">
        <a href="https://nextjs.org/learn" className={styles.card}>
          <h2>Withdraw &rarr;</h2>
          <p>Withdraw tokens to convert them to money you can spend 💸</p>
        </a>
      </Link>

      <Link href="/account/save">
        <a
          href="https://github.com/vercel/next.js/tree/canary/examples"
          className={styles.card}
        >
          <h2>Save &rarr;</h2>
          <p>Save your tokens to get even more tokens! 💰</p>
        </a>
      </Link>

      <Link href="/account/unsave">
        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          className={styles.card}
        >
          <h2>Unsave &rarr;</h2>
          <p>
            Take your tokens out of savings so you can decide what else to do
            with them 💱
          </p>
        </a>
      </Link>
    </>
  );
}
