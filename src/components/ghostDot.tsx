import classnames from "classnames";
import React from "react";
import GhostIcon from "~/components/ghostIcon";
import { VisibleType } from "~/lib/board";

interface Props {
  type: VisibleType;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
}

export default function GhostDot(props: Props) {
  const { type, size = 20, selected, onClick } = props;

  return (
    <button
      className={classnames("ghost-icon bn pa0", {
        "ghost-icon--selected": selected,
        "pointer": !!onClick,
      })}
      type="button"
      onClick={onClick}
    >
      <GhostIcon size={size} type={type} />
    </button>
  );
}
