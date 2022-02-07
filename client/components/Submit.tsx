import formStyles from "../styles/Form.module.css";
import buttonStyles from "../styles/Button.module.css";

export default function Submit() {
  return (
    <button
      className={[formStyles.submit, buttonStyles.button].join(" ")}
      type="submit"
    >
      &#9658;
    </button>
  );
}
