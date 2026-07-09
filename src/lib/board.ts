import IGameState, { GhostType, IGhost, IMoveAction } from "./state";

export const BOARD_SIZE = 6;
export const COL_LABELS = ["a", "b", "c", "d", "e", "f"] as const;
export const GHOSTS_PER_PLAYER = 8;
export const WIN_COUNT = 4;
export const SETUP_MS = 60_000;

export type VisibleType = GhostType | "hidden";
export type Direction = "up" | "down" | "left" | "right";

export function displayRank(dRow: number, viewerIndex: number): string {
  return viewerIndex === 0 ? String(dRow + 1) : String(BOARD_SIZE - dRow);
}

export function displayCol(dCol: number, viewerIndex: number): string {
  return viewerIndex === 0 ? COL_LABELS[BOARD_SIZE - 1 - dCol] : COL_LABELS[dCol];
}

export function visibleType(ghost: IGhost, viewerIndex: number | null): VisibleType {
  if (ghost.revealed) return ghost.type;
  if (viewerIndex === -1) return ghost.type;
  if (viewerIndex !== null && ghost.owner === viewerIndex) return ghost.type;
  return "hidden";
}

export function homeRows(playerIndex: number): [number, number] {
  return playerIndex === 0 ? [0, 1] : [4, 5];
}

export function homePositions(playerIndex: number): Array<{ row: number; col: number }> {
  const [near, far] = homeRows(playerIndex);
  const positions: Array<{ row: number; col: number }> = [];
  for (const row of [near, far]) {
    for (let col = 1; col <= 4; col++) {
      positions.push({ row, col });
    }
  }
  return positions;
}

export function defaultGhostType(owner: number, row: number): GhostType {
  const [near] = homeRows(owner);
  return row === near ? "good" : "evil";
}

export function opponentExitCells(playerIndex: number): Array<{ row: number; col: number }> {
  return playerIndex === 0
    ? [
        { row: 5, col: 0 },
        { row: 5, col: 5 },
      ]
    : [
        { row: 0, col: 0 },
        { row: 0, col: 5 },
      ];
}

export function isExitFor(playerIndex: number, row: number, col: number): boolean {
  return opponentExitCells(playerIndex).some((e) => e.row === row && e.col === col);
}

export function toDisplay(row: number, col: number, viewerIndex: number): { row: number; col: number } {
  if (viewerIndex === 0) {
    return { row: BOARD_SIZE - 1 - row, col: BOARD_SIZE - 1 - col };
  }
  return { row, col };
}

export function toGame(row: number, col: number, viewerIndex: number): { row: number; col: number } {
  return toDisplay(row, col, viewerIndex);
}

export function isInsideBoard(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function applyDirection(row: number, col: number, dir: Direction): { row: number; col: number } {
  if (dir === "up") return { row: row - 1, col };
  if (dir === "down") return { row: row + 1, col };
  if (dir === "left") return { row, col: col - 1 };
  return { row, col: col + 1 };
}

export function directionBetween(fromRow: number, fromCol: number, toRow: number, toCol: number): Direction | null {
  if (toRow === fromRow - 1 && toCol === fromCol) return "up";
  if (toRow === fromRow + 1 && toCol === fromCol) return "down";
  if (toRow === fromRow && toCol === fromCol - 1) return "left";
  if (toRow === fromRow && toCol === fromCol + 1) return "right";
  return null;
}

export function getLastMove(game: IGameState): IMoveAction | null {
  if (!game.turnsHistory || game.turnsHistory.length === 0) return null;
  const lastTurn = game.turnsHistory[game.turnsHistory.length - 1];
  if (lastTurn.action?.action === "move") {
    return lastTurn.action as IMoveAction;
  }
  return null;
}

export function getPreviousMovePositions(
  game: IGameState,
  ghosts: IGhost[]
): { from: { row: number; col: number } | null; to: { row: number; col: number } | null } {
  const lastMove = getLastMove(game);
  if (!lastMove) return { from: null, to: null };

  const ghost = ghosts.find((g) => g.id === lastMove.ghostId);
  if (!ghost) return { from: null, to: null };

  return {
    to: { row: ghost.row, col: ghost.col },
    from: reverseDirection(ghost.row, ghost.col, lastMove.direction),
  };
}

function reverseDirection(currentRow: number, currentCol: number, direction: Direction): { row: number; col: number } {
  if (direction === "up") return { row: currentRow + 1, col: currentCol };
  if (direction === "down") return { row: currentRow - 1, col: currentCol };
  if (direction === "left") return { row: currentRow, col: currentCol + 1 };
  return { row: currentRow, col: currentCol - 1 };
}
