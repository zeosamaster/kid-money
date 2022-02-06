import { PropsWithChildren } from "react";
import formStyles from "../styles/Form.module.css";
import Submit from "./Submit";

export default function Form({
  children,
  onSubmit,
}: PropsWithChildren<{ onSubmit: (e: any) => void }>) {
  return (
    <form className={formStyles.form} onSubmit={onSubmit}>
      {children}
      <Submit />
    </form>
  );
}
