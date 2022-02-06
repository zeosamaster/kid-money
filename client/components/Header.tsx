import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Header() {
  return (
    <>
      <h1 className={styles.title}>Welcome to Kid Money!</h1>

      <p className={styles.description}>
        Here you&apos;ll be able to manage your money:
        <br />
        <Image
          height={24}
          width={24}
          alt="deposit"
          src="/icons/deposit.svg"
        />{" "}
        deposit +{" "}
        <Image
          height={24}
          width={24}
          alt="withdraw"
          src="/icons/withdraw.svg"
        />{" "}
        withdraw
        <br />
        <Image height={24} width={24} alt="save" src="/icons/save.svg" /> save +{" "}
        <Image height={24} width={24} alt="compound" src="/icons/unsave.svg" />{" "}
        unsave
        <br />
        <Image
          height={24}
          width={24}
          alt="compound"
          src="/icons/compound.svg"
        />{" "}
        compound
      </p>
    </>
  );
}
