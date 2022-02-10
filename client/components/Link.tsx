import React from "react";

interface Props {
  url?: string;
  onClick?: () => void;
}

export default function Link({
  url,
  children,
  onClick,
}: React.PropsWithChildren<Props>) {
  const onLinkClick = React.useCallback(
    (e: any) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick]
  );

  return (
    <a
      style={{ textDecoration: "underline", cursor: "pointer" }}
      href={url}
      onClick={onLinkClick}
    >
      {children}
    </a>
  );
}
