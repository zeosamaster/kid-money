import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export default function LocaleSelector() {
  const { locales } = useRouter();

  return (
    <ul className={styles.flags}>
      {locales?.map((l) => (
        <li key={l} className={styles.flag}>
          <Link href="/" locale={l} passHref>
            <Image src={`/flags/${l}.svg`} height="32px" width="24px" alt={l} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
