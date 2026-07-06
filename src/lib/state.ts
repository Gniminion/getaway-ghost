export default interface IGameState {
  id: string;
  status: IGameStatus;
  players: IPlayer[];
  currentPlayer: number;
  options: IGameOptions;
  ghosts: IGhost[];
  turnsHistory: ITurn[];
  winner: number | null;
  winReason: WinReason | null;
  createdAt: number;
  startedAt?: number;
  setupDeadline?: number;
  rpsDeadline?: number;
  endedAt?: number;
  synced: boolean;
}

export interface IGameOptions {
  id: string;
  playersCount: 2;
  gameMode: GameMode;
  private: boolean;
  seed: string;
}

export enum GameMode {
  NETWORK = "network",
  PASS_AND_PLAY = "pass_and_play",
}

export enum IGameStatus {
  LOBBY = "lobby",
  SETUP = "setup",
  RPS = "rps",
  ONGOING = "ongoing",
  OVER = "over",
}

export type GhostType = "good" | "evil";
export type WinReason = "escape" | "capturedGood" | "capturedEvil";
export type RpsChoice = "rock" | "paper" | "scissors";

export interface IPlayer {
  id: string;
  name: string;
  index: number;
  capturedGood: number;
  capturedEvil: number;
  setupDone: boolean;
  rpsChoice: RpsChoice | null;
}

export interface IGhost {
  id: number;
  owner: number;
  type: GhostType;
  row: number;
  col: number;
  onBoard: boolean;
  revealed: boolean;
  capturedBy: number | null;
}

export type IAction =
  | IToggleSetupAction
  | IFinishSetupAction
  | IRpsAction
  | IMoveAction
  | ICheckSetupTimeoutAction
  | ICheckRpsTimeoutAction;

export interface IToggleSetupAction {
  action: "toggleSetup";
  from: number;
  ghostId: number;
}

export interface IFinishSetupAction {
  action: "finishSetup";
  from: number;
}

export interface IRpsAction {
  action: "rps";
  from: number;
  choice: RpsChoice;
}

export interface IMoveAction {
  action: "move";
  from: number;
  ghostId: number;
  direction: Direction;
}

export interface ICheckSetupTimeoutAction {
  action: "checkSetupTimeout";
  from: number;
}

export interface ICheckRpsTimeoutAction {
  action: "checkRpsTimeout";
  from: number;
}

export type Direction = "up" | "down" | "left" | "right";

export interface ITurn {
  action: IAction;
}

export function cleanState(state: IGameState): Partial<IGameState> {
  return {
    id: state.id,
    status: state.status,
    options: state.options,
    players: state.players,
    currentPlayer: state.currentPlayer,
    ghosts: state.ghosts,
    turnsHistory: state.turnsHistory,
    winner: state.winner,
    winReason: state.winReason ?? null,
    createdAt: state.createdAt,
    startedAt: state.startedAt ?? null,
    setupDeadline: state.setupDeadline ?? null,
    rpsDeadline: state.rpsDeadline ?? null,
    endedAt: state.endedAt ?? null,
  };
}

export function fillEmptyValues(state: IGameState): IGameState {
  if (!state) return null;

  return {
    ...state,
    players: state.players ?? [],
    ghosts: state.ghosts ?? [],
    turnsHistory: state.turnsHistory ?? [],
    winner: state.winner ?? null,
    winReason: state.winReason ?? null,
  };
}
