import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BoardGrid from "~/components/boardGrid";
import CaptureZone from "~/components/captureZone";
import Txt, { TxtSize } from "~/components/ui/txt";
import { applyDirection, directionBetween } from "~/lib/board";
import { commitAction, validMoves } from "~/lib/actions";
import IGameState, { Direction, IGhost } from "~/lib/state";

interface Props {
  game: IGameState;
  playerIndex: number;
  onUpdate: (game: IGameState) => void;
}

export default function GameBoard(props: Props) {
  const { game, playerIndex, onUpdate } = props;
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const isMyTurn = game.currentPlayer === playerIndex;
  const currentName = game.players[game.currentPlayer]?.name ?? "";

  const selected = game.ghosts.find((g) => g.id === selectedId) ?? null;
  const moves = useMemo(() => (selected ? validMoves(game, selected.id) : []), [game, selected]);

  const validTargets = useMemo(() => {
    if (!selected) return [];
    return moves.map((dir) => applyDirection(selected.row, selected.col, dir));
  }, [selected, moves]);

  function selectGhost(ghost: IGhost) {
    if (!isMyTurn || ghost.owner !== playerIndex) return;
    setSelectedId(ghost.id === selectedId ? null : ghost.id);
  }

  function move(dir: Direction) {
    if (!selected || !isMyTurn || !moves.includes(dir)) return;
    const next = commitAction(game, {
      action: "move",
      from: playerIndex,
      ghostId: selected.id,
      direction: dir,
    });
    if (next !== game) {
      setSelectedId(null);
      onUpdate(next);
    }
  }

  function onCellClick(row: number, col: number) {
    if (!selected || !isMyTurn) return;
    const dir = directionBetween(selected.row, selected.col, row, col);
    if (dir) move(dir);
  }

  return (
    <div className="flex flex-column items-center w-100 pv2">
      <CaptureZone game={game} side="top" viewerIndex={playerIndex} />

      <Txt
        className="mb2"
        size={TxtSize.SMALL}
        value={isMyTurn ? t("yourTurn") : t("opponentTurn", { name: currentName })}
      />

      <BoardGrid
        game={game}
        ghosts={game.ghosts}
        selectedId={selectedId}
        validTargets={validTargets}
        viewerIndex={playerIndex}
        onCellClick={onCellClick}
        onGhostClick={selectGhost}
      />

      <CaptureZone game={game} side="bottom" viewerIndex={playerIndex} />
    </div>
  );
}
