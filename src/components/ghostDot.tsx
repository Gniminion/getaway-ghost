import classnames from "classnames";
import React from "react";
import { VisibleType } from "~/lib/board";

interface Props {
  type: VisibleType;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
}

const BODY_COLOR: Record<VisibleType, string> = {
  hidden: "var(--color-accent)",
  good: "var(--color-blue)",
  evil: "var(--color-red)",
};

export default function GhostDot(props: Props) {
  const { type, size = 20, selected, onClick } = props;
  const body = BODY_COLOR[type];

  return (
    <button
      className={classnames("ghost-icon bn pa0", {
        "ghost-icon--selected": selected,
        "pointer": !!onClick,
      })}
      style={{ width: size, height: size * (184 / 180) }}
      type="button"
      onClick={onClick}
    >
      <svg fill="none" height="100%" viewBox="0 0 180 184" width="100%" xmlns="http://www.w3.org/2000/svg">
        <rect fill={body} height="120" transform="translate(6)" width="168" />
        <rect fill="var(--color-white)" height="40" transform="translate(30 40)" width="40" />
        <rect fill="var(--color-white)" height="40" transform="translate(109 40)" width="40" />
        <path d="M50 184L6.69874 109L93.3013 109L50 184Z" fill={body} />
        <path d="M90 184L46.6987 109L133.301 109L90 184Z" fill={body} />
        <path d="M130 184L86.6987 109L173.301 109L130 184Z" fill={body} />
      </svg>
    </button>
  );
}
