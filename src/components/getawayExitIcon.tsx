import classnames from "classnames";
import React, { CSSProperties } from "react";

interface Props {
  size?: number;
  className?: string;
  tile?: boolean;
}

export default function GetawayExitIcon(props: Props) {
  const { size, className, tile } = props;
  const style: CSSProperties | undefined = size ? { width: size, height: size } : undefined;

  return (
    <span
      aria-hidden
      className={classnames("getaway-exit-icon", { "getaway-exit-icon--tile": tile }, className)}
      style={style}
    >
      <span className="getaway-exit-icon__label">
        <span>GET</span>
        <span>AWAY</span>
      </span>
    </span>
  );
}
