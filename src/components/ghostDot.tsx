import classnames from "classnames";
import React from "react";
import GhostIcon from "~/components/ghostIcon";
import { VisibleType } from "~/lib/board";

interface Props {
  type: VisibleType;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
  playerLabel?: string;
  playerIndex?: number;
}

export default function GhostDot(props: Props) {
  const { type, size = 20, selected, onClick, playerLabel, playerIndex } = props;

  return (
    <div className="ghost-dot-wrapper relative">
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
      {playerLabel && (
        <span
          className={classnames("ghost-label", {
            "ghost-label--p2": playerIndex === 1,
          })}
        >
          {playerLabel}
        </span>
      )}
    </div>
  );
}
