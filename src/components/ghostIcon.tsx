import classnames from "classnames";
import React, { CSSProperties } from "react";
import { VisibleType } from "~/lib/board";

const BODY_COLOR: Record<VisibleType, string> = {
  hidden: "var(--color-accent)",
  good: "var(--color-blue)",
  evil: "var(--color-red)",
};

interface Props {
  type: VisibleType;
  size?: number;
  className?: string;
}

export default function GhostIcon(props: Props) {
  const { type, size = 20, className } = props;
  const body = BODY_COLOR[type];
  const style: CSSProperties = {
    display: "inline-block",
    width: size,
    height: size * (184 / 180),
    lineHeight: 0,
  };

  return (
    <span aria-hidden className={classnames("ghost-icon", className)} style={style}>
      <svg fill="none" height="100%" viewBox="0 0 180 184" width="100%" xmlns="http://www.w3.org/2000/svg">
        <rect fill={body} height="120" transform="translate(6)" width="168" />
        <rect fill="var(--color-white)" height="40" transform="translate(30 40)" width="40" />
        <rect fill="var(--color-white)" height="40" transform="translate(109 40)" width="40" />
        <path d="M50 184L6.69874 109L93.3013 109L50 184Z" fill={body} />
        <path d="M90 184L46.6987 109L133.301 109L90 184Z" fill={body} />
        <path d="M130 184L86.6987 109L173.301 109L130 184Z" fill={body} />
      </svg>
    </span>
  );
}
