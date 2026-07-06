import classnames from "classnames";
import React from "react";
import GetawayExitIcon from "~/components/getawayExitIcon";
import GhostDot from "~/components/ghostDot";
import { BOARD_SIZE, COL_LABELS, displayRank, isExitFor, toGame, visibleType } from "~/lib/board";
import { IGhost } from "~/lib/state";

interface Props {
  ghosts: IGhost[];
  viewerIndex: number;
  selectedId?: number | null;
  validTargets?: Array<{ row: number; col: number }>;
  onGhostClick?: (ghost: IGhost) => void;
  onCellClick?: (row: number, col: number) => void;
  setupMode?: boolean;
  setupPlayerIndex?: number;
  onSetupToggle?: (ghostId: number) => void;
}

export default function BoardGrid(props: Props) {
  const {
    ghosts,
    viewerIndex,
    selectedId,
    validTargets = [],
    onGhostClick,
    onCellClick,
    setupMode,
    setupPlayerIndex,
    onSetupToggle,
  } = props;

  function ghostAtGame(row: number, col: number) {
    return ghosts.find((g) => g.onBoard && g.row === row && g.col === col) ?? null;
  }

  function isValidTarget(gameRow: number, gameCol: number) {
    return validTargets.some((t) => t.row === gameRow && t.col === gameCol);
  }

  const cells = [];
  for (let dRow = 0; dRow < BOARD_SIZE; dRow++) {
    for (let dCol = 0; dCol < BOARD_SIZE; dCol++) {
      const { row: gameRow, col: gameCol } = toGame(dRow, dCol, viewerIndex);
      const ghost = ghostAtGame(gameRow, gameCol);
      const myExit = isExitFor(viewerIndex, gameRow, gameCol);
      const oppExit = isExitFor(1 - viewerIndex, gameRow, gameCol);
      const targeted = isValidTarget(gameRow, gameCol);
      const canToggle = setupMode && ghost && ghost.owner === setupPlayerIndex;

      cells.push(
        <button
          key={`${dRow}-${dCol}`}
          className={classnames("board-cell", {
            "board-cell--exit": myExit,
            "board-cell--exit-opp": oppExit,
            "board-cell--target": targeted,
            "board-cell--selected": ghost && ghost.id === selectedId,
          })}
          type="button"
          onClick={() => {
            if (canToggle && onSetupToggle) onSetupToggle(ghost.id);
            else if (targeted && onCellClick) onCellClick(gameRow, gameCol);
            else if (ghost && onGhostClick) onGhostClick(ghost);
            else if (onCellClick) onCellClick(gameRow, gameCol);
          }}
        >
          {myExit && <GetawayExitIcon />}
          {ghost && (
            <GhostDot selected={ghost.id === selectedId} type={visibleType(ghost, viewerIndex)} onClick={undefined} />
          )}
        </button>
      );
    }
  }

  const fileLabels = COL_LABELS.map((label) => (
    <span key={label} className="board-layout__file-label">
      {label}
    </span>
  ));

  const rankLabels = Array.from({ length: BOARD_SIZE }, (_, dRow) => (
    <span key={dRow} className="board-layout__rank-label">
      {displayRank(dRow)}
    </span>
  ));

  return (
    <div className="board-wrap">
      <div className="board-layout">
        <div className="board-layout__ranks">{rankLabels}</div>
        <div className="board-grid">{cells}</div>
        <div className="board-layout__corner" />
        <div className="board-layout__files">{fileLabels}</div>
      </div>
    </div>
  );
}
