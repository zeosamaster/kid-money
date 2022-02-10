import { ethers } from "ethers";
import React from "react";
import { I18nContext } from "../context/I18nContext";
import formStyles from "../styles/Form.module.css";
import Form from "./Form";

interface Props {
  onSubmit: (e: any) => void;
  max: ethers.BigNumber | null | undefined;
}

export default function AmountForm({ onSubmit, max }: Props) {
  const _ = React.useContext(I18nContext);
  const input = React.useRef<HTMLInputElement>(null);
  const onMax = React.useCallback(
    (e: any) => {
      e.preventDefault();

      if (!max || !input.current) {
        return;
      }

      const value = ethers.utils.formatEther(max).replace(/\.0$/, "");
      input.current.value = value;
    },
    [input, max]
  );

  return (
    <Form onSubmit={onSubmit}>
      <div className={formStyles.field}>
        <input
          ref={input}
          className={formStyles.amount}
          type="number"
          step="any"
          name="amount"
          autoComplete="off"
          autoCorrect="off"
          placeholder="0"
        />
        {max && (
          <button className={formStyles.maxButton} onClick={onMax}>
            {_("INPUT.MAX")}
          </button>
        )}
      </div>
    </Form>
  );
}
