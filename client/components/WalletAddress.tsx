import walletStyles from "../styles/Wallet.module.css";

interface Props {
  address: string;
}

export default function WalletAddress({ address }: Props) {
  return <p className={walletStyles.address}>{address}</p>;
}
