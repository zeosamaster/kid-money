import Image from "next/image";
import React from "react";
import { I18nContext } from "../context/I18nContext";
import styles from "../styles/Home.module.css";
import LocaleSelector from "./LocaleSelector";
import Wallet from "./Wallet";

export default function Header() {
  const _ = React.useContext(I18nContext);

  return (
    <>
      <h1 className={styles.title}>{_("HEADER.TITLE")}</h1>

      <div className={styles.stickyCorner}>
        <Wallet />
        <LocaleSelector />
      </div>

      <p className={styles.description}>
        {_("HEADER.DESCRIPTION")}
        <br />
        <Image
          height={24}
          width={24}
          alt="deposit"
          src="/icons/deposit.svg"
        />{" "}
        {_("HEADER.ACTIONS.DEPOSIT")} +{" "}
        <Image
          height={24}
          width={24}
          alt="withdraw"
          src="/icons/withdraw.svg"
        />{" "}
        {_("HEADER.ACTIONS.WITHDRAW")}
        <br />
        <Image height={24} width={24} alt="save" src="/icons/save.svg" />{" "}
        {_("HEADER.ACTIONS.SAVE")} +{" "}
        <Image height={24} width={24} alt="compound" src="/icons/unsave.svg" />{" "}
        {_("HEADER.ACTIONS.UNSAVE")}
        <br />
        <Image
          height={24}
          width={24}
          alt="compound"
          src="/icons/compound.svg"
        />{" "}
        {_("HEADER.ACTIONS.COMPOUND")}
      </p>
    </>
  );
}
