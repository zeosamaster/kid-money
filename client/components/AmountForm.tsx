import formStyles from "../styles/Form.module.css";
import Form from "./Form";

interface Props {
  onSubmit: (e: any) => void;
}

export default function AmountForm({ onSubmit }: Props) {
  return (
    <Form onSubmit={onSubmit}>
      <input
        className={formStyles.amount}
        type="number"
        step="any"
        name="amount"
        autoComplete="off"
        autoCorrect="off"
        placeholder="0"
      />
    </Form>
  );
}
