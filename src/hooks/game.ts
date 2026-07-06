import React, { useContext } from "react";
import { useSession } from "~/hooks/session";
import IGameState, { IPlayer } from "~/lib/state";

export const GameContext = React.createContext<IGameState>(null);

export function useGame(): IGameState {
  return useContext(GameContext);
}

export function useCurrentPlayer(game: IGameState): IPlayer | null {
  if (!game) return null;
  return game.players[game.currentPlayer] ?? null;
}

export function useSelfPlayer(game: IGameState): IPlayer | undefined {
  const { playerId } = useSession();
  if (!game) return undefined;
  return game.players.find((p) => p.id === playerId);
}
