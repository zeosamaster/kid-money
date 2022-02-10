import React from "react";
import alertStyles from "../styles/Alert.module.css";

interface Props {
  title: string;
  body: React.ReactNode;
}

export default function Alert({ title, body }: Props) {
  return (
    <div className={alertStyles.container}>
      <div className={alertStyles.content}>
        <h4 className={alertStyles.title}>{title}</h4>
        <div className={alertStyles.body}>{body}</div>
      </div>
    </div>
  );
}
