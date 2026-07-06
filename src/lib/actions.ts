import {
  applyDirection,
  defaultGhostType,
  homePositions,
  homeRows,
  isExitFor,
  isInsideBoard,
  SETUP_MS,
  WIN_COUNT,
  Direction,
} from "./board";
import IGameState, { IAction, IGhost, IGameOptions, IGameStatus, IPlayer, RpsChoice, WinReason } from "./state";

export type { Direction } from "./board";

function clonePlayers(players: IPlayer[]): IPlayer[] {
  return players.map((p) => ({ ...p }));
}

function cloneGhosts(ghosts: IGhost[]): IGhost[] {
  return ghosts.map((g) => ({ ...g }));
}

export function ghostAt(state: IGameState, row: number, col: number): IGhost | null {
  return state.ghosts.find((g) => g.onBoard && g.row === row && g.col === col) ?? null;
}

export function capturedGhosts(state: IGameState, capturerIndex: number): IGhost[] {
  return state.ghosts.filter((g) => g.capturedBy === capturerIndex);
}

function countType(ghosts: IGhost[], type: IGhost["type"]): number {
  return ghosts.filter((g) => g.type === type).length;
}

function normalizeSetup(ghosts: IGhost[], playerIndex: number): IGhost[] {
  const [near, far] = homeRows(playerIndex);
  return ghosts.map((g) => {
    if (g.owner !== playerIndex) return g;
    if (g.row !== near && g.row !== far) return g;
    return { ...g, type: g.row === near ? ("good" as const) : ("evil" as const) };
  });
}

function creditCapture(player: IPlayer, type: IGhost["type"]): IPlayer {
  if (type === "good") return { ...player, capturedGood: player.capturedGood + 1 };
  return { ...player, capturedEvil: player.capturedEvil + 1 };
}

export function checkWinner(state: IGameState): number | null {
  for (let i = 0; i < 2; i++) {
    const { capturedGood, capturedEvil } = state.players[i];
    if (capturedGood >= WIN_COUNT) return i;
    if (capturedEvil >= WIN_COUNT) return 1 - i;
  }
  return state.winner;
}

function rpsWinner(a: RpsChoice, b: RpsChoice): number | null {
  if (a === b) return null;
  if (
    (a === "rock" && b === "scissors") ||
    (a === "paper" && b === "rock") ||
    (a === "scissors" && b === "paper")
  ) {
    return 0;
  }
  return 1;
}

function createGhosts(): IGhost[] {
  const ghosts: IGhost[] = [];
  for (let owner = 0; owner < 2; owner++) {
    homePositions(owner).forEach((pos, i) => {
      ghosts.push({
        id: owner * 8 + i,
        owner,
        type: defaultGhostType(owner, pos.row),
        row: pos.row,
        col: pos.col,
        onBoard: true,
        revealed: false,
        capturedBy: null,
      });
    });
  }
  return ghosts;
}

export function newGame(options: IGameOptions): IGameState {
  return {
    id: options.id,
    status: IGameStatus.LOBBY,
    players: [],
    currentPlayer: 0,
    ghosts: [],
    turnsHistory: [],
    options,
    winner: null,
    winReason: null,
    createdAt: Date.now(),
    synced: false,
  };
}

export function beginSetup(state: IGameState): IGameState {
  return {
    ...state,
    status: IGameStatus.SETUP,
    ghosts: createGhosts(),
    setupDeadline: Date.now() + SETUP_MS,
    startedAt: Date.now(),
    players: state.players.map((p) => ({ ...p, setupDone: false, rpsChoice: null })),
    synced: false,
  };
}

function allSetupDone(players: IPlayer[]): boolean {
  return players.length === 2 && players.every((p) => p.setupDone);
}

function maybeAdvanceFromSetup(state: IGameState, players: IPlayer[]): IGameState {
  if (!allSetupDone(players)) return { ...state, players };
  return {
    ...state,
    players,
    status: IGameStatus.RPS,
    rpsDeadline: Date.now() + SETUP_MS,
    synced: false,
  };
}


function resolveRps(state: IGameState): IGameState {
  const [a, b] = state.players;
  if (!a?.rpsChoice || !b?.rpsChoice) return state;

  const result = rpsWinner(a.rpsChoice, b.rpsChoice);
  if (result === null) {
    return {
      ...state,
      players: state.players.map((p) => ({ ...p, rpsChoice: null })),
      rpsDeadline: Date.now() + SETUP_MS,
      synced: false,
    };
  }

  const winner = result === 0 ? a : b;

  return {
    ...state,
    status: IGameStatus.ONGOING,
    currentPlayer: winner.index,
    synced: false,
  };
}

export function commitAction(state: IGameState, action: IAction): IGameState {
  switch (action.action) {
    case "toggleSetup":
      return toggleSetup(state, action.from, action.ghostId);
    case "finishSetup":
      return finishSetup(state, action.from);
    case "checkSetupTimeout":
      return checkSetupTimeout(state);
    case "checkRpsTimeout":
      return checkRpsTimeout(state);
    case "rps":
      return submitRps(state, action.from, action.choice);
    case "move":
      return applyMove(state, action.from, action.ghostId, action.direction);
    default:
      return state;
  }
}

function toggleSetup(state: IGameState, playerIndex: number, ghostId: number): IGameState {
  if (state.status !== IGameStatus.SETUP) return state;
  const ghost = state.ghosts.find((g) => g.id === ghostId);
  if (!ghost || ghost.owner !== playerIndex) return state;

  const ghosts = cloneGhosts(state.ghosts).map((g) =>
    g.id === ghostId ? { ...g, type: g.type === "good" ? ("evil" as const) : ("good" as const) } : g
  );

  return {
    ...state,
    ghosts,
    turnsHistory: [...state.turnsHistory, { action: { action: "toggleSetup", from: playerIndex, ghostId } }],
    synced: false,
  };
}

function finishSetup(state: IGameState, playerIndex: number): IGameState {
  if (state.status !== IGameStatus.SETUP) return state;

  const mine = state.ghosts.filter((g) => g.owner === playerIndex);
  if (countType(mine, "good") !== 4 || countType(mine, "evil") !== 4) return state;

  const players = clonePlayers(state.players).map((p) => (p.index === playerIndex ? { ...p, setupDone: true } : p));

  return maybeAdvanceFromSetup({ ...state, synced: false }, players);
}

export function setupValid(state: IGameState, playerIndex: number): boolean {
  const mine = state.ghosts.filter((g) => g.owner === playerIndex);
  return countType(mine, "good") === 4 && countType(mine, "evil") === 4;
}

export function checkSetupTimeout(state: IGameState): IGameState {
  if (state.status !== IGameStatus.SETUP || !state.setupDeadline) return state;
  if (Date.now() < state.setupDeadline) return state;

  let ghosts = cloneGhosts(state.ghosts);
  for (const player of state.players) {
    if (!player.setupDone) {
      ghosts = normalizeSetup(ghosts, player.index);
    }
  }

  const players = clonePlayers(state.players).map((p) => ({ ...p, setupDone: true }));
  return maybeAdvanceFromSetup({ ...state, ghosts, synced: false }, players);
}

export function checkRpsTimeout(state: IGameState): IGameState {
  if (state.status !== IGameStatus.RPS || !state.rpsDeadline) return state;
  if (Date.now() < state.rpsDeadline) return state;

  const players = clonePlayers(state.players).map((p) => ({
    ...p,
    rpsChoice: p.rpsChoice ?? ("rock" as RpsChoice),
  }));

  const withChoices = { ...state, players, synced: false };
  const [a, b] = withChoices.players;
  if (!a?.rpsChoice || !b?.rpsChoice) return state;

  const result = rpsWinner(a.rpsChoice, b.rpsChoice);
  if (result !== null) {
    const winner = result === 0 ? a : b;
    return {
      ...withChoices,
      status: IGameStatus.ONGOING,
      currentPlayer: winner.index,
    };
  }

  return {
    ...withChoices,
    status: IGameStatus.ONGOING,
    currentPlayer: state.rpsDeadline % 2,
  };
}

function submitRps(state: IGameState, playerIndex: number, choice: RpsChoice): IGameState {
  if (state.status !== IGameStatus.RPS) return state;

  const players = clonePlayers(state.players).map((p) => (p.index === playerIndex ? { ...p, rpsChoice: choice } : p));

  const next = {
    ...state,
    players,
    turnsHistory: [...state.turnsHistory, { action: { action: "rps" as const, from: playerIndex, choice } }],
    synced: false,
  };

  return resolveRps(next);
}

function applyMove(state: IGameState, playerIndex: number, ghostId: number, direction: Direction): IGameState {
  if (state.status !== IGameStatus.ONGOING) return state;
  if (state.currentPlayer !== playerIndex) return state;

  const ghost = state.ghosts.find((g) => g.id === ghostId);
  if (!ghost?.onBoard || ghost.owner !== playerIndex) return state;

  const { row: toRow, col: toCol } = applyDirection(ghost.row, ghost.col, direction);
  if (!isInsideBoard(toRow, toCol)) return state;

  let ghosts = cloneGhosts(state.ghosts);
  const players = clonePlayers(state.players);
  let winner: number | null = null;
  let winReason: WinReason | null = null;

  const occupant = ghostAt(state, toRow, toCol);
  if (occupant) {
    if (occupant.owner === playerIndex) return state;
    ghosts = ghosts.map((g) => {
      if (g.id === ghostId) return { ...g, row: toRow, col: toCol };
      if (g.id === occupant.id) return { ...g, onBoard: false, revealed: true, capturedBy: playerIndex };
      return g;
    });
    players[playerIndex] = creditCapture(players[playerIndex], occupant.type);
  } else {
    ghosts = ghosts.map((g) => (g.id === ghostId ? { ...g, row: toRow, col: toCol } : g));
  }

  if (isExitFor(playerIndex, toRow, toCol) && ghost.type === "good") {
    winner = playerIndex;
    winReason = "escape";
    ghosts = ghosts.map((g) =>
      g.id === ghostId ? { ...g, onBoard: false, revealed: true, capturedBy: null } : g
    );
  }

  if (winner === null) winner = checkWinner({ ...state, players, ghosts });
  if (winner !== null && winReason === null) {
    const { capturedGood, capturedEvil } = players[winner];
    winReason = capturedGood >= WIN_COUNT ? "capturedGood" : "capturedEvil";
  }

  return {
    ...state,
    ghosts,
    players,
    currentPlayer: winner === null ? 1 - playerIndex : state.currentPlayer,
    winner,
    winReason,
    status: winner !== null ? IGameStatus.OVER : state.status,
    endedAt: winner !== null ? Date.now() : state.endedAt,
    turnsHistory: [...state.turnsHistory, { action: { action: "move", from: playerIndex, ghostId, direction } }],
    synced: false,
  };
}

export function validMoves(state: IGameState, ghostId: number): Direction[] {
  const ghost = state.ghosts.find((g) => g.id === ghostId);
  if (!ghost?.onBoard) return [];

  const dirs: Direction[] = ["up", "down", "left", "right"];
  const valid: Direction[] = [];

  for (const dir of dirs) {
    const { row, col } = applyDirection(ghost.row, ghost.col, dir);
    if (!isInsideBoard(row, col)) continue;
    const occupant = ghostAt(state, row, col);
    if (!occupant || occupant.owner !== ghost.owner) valid.push(dir);
  }

  return valid;
}
