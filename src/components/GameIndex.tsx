import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Game } from "~/components/game";
import useConnectivity from "~/hooks/connectivity";
import { GameContext } from "~/hooks/game";
import { subscribeToGame } from "~/lib/firebase";
import IGameState from "~/lib/state";

interface Props {
  host: string;
  game: IGameState;
}

function SsrFreeGameIndex(props: Props) {
  const { game: initialGame, host } = props;
  const [game, setGame] = useState<IGameState>(initialGame);
  const online = useConnectivity();
  const router = useRouter();

  useEffect(() => {
    if (!online) return;

    return subscribeToGame(game.id, (updatedGame) => {
      if (!updatedGame) {
        router.push("/404");
        return;
      }
      setGame({ ...updatedGame, synced: true });
    });
  }, [online, game?.id, router]);

  return (
    <GameContext.Provider value={game}>
      <Game host={host} onGameChange={setGame} />
    </GameContext.Provider>
  );
}

const GameIndex = dynamic(() => Promise.resolve(SsrFreeGameIndex), {
  ssr: false,
});

export default GameIndex;
