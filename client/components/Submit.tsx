import formStyles from "../styles/Form.module.css";

export default function Submit() {
  return (
    <button className={formStyles.submit} type="submit">
      &#9658;
    </button>
  );
}
