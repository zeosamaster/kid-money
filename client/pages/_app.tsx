import type { AppProps } from "next/app";
import Image from "next/image";
import { BankContextProvider } from "../context/BankContext";
import { I18nContextProvider } from "../context/I18nContext";
import { TokenContextProvider } from "../context/TokenContext";
import { WalletContextProvider } from "../context/WalletContext";
import "../styles/globals.css";
import styles from "../styles/Page.module.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <I18nContextProvider>
      <WalletContextProvider>
        <TokenContextProvider>
          <BankContextProvider>
            <div className={styles.container}>
              <main className={styles.page}>
                <Component {...pageProps} />
              </main>

              <footer className={styles.footer}>
                <a
                  href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Powered by{" "}
                  <span className={styles.logo}>
                    <Image
                      src="/vercel.svg"
                      alt="Vercel Logo"
                      width={72}
                      height={16}
                    />
                  </span>
                </a>
              </footer>
            </div>
          </BankContextProvider>
        </TokenContextProvider>
      </WalletContextProvider>
    </I18nContextProvider>
  );
}

export default MyApp;
