import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import GameBoard from "~/components/gameBoard";
import HomeButton from "~/components/homeButton";
import Lobby from "~/components/lobby";
import MenuArea from "~/components/menuArea";
import ResultScreen from "~/components/resultScreen";
import RpsPhase from "~/components/rpsPhase";
import SetupBoard from "~/components/setupBoard";
import SpectatorBoard from "~/components/spectatorBoard";
import Txt from "~/components/ui/txt";
import { useGame, useSelfPlayer } from "~/hooks/game";
import useLocalStorage from "~/hooks/localStorage";
import { useSession } from "~/hooks/session";
import { beginSetup } from "~/lib/actions";
import { logFailedPromise } from "~/lib/errors";
import { updateGame } from "~/lib/firebase";
import IGameState, { IGameStatus, IPlayer } from "~/lib/state";

interface Props {
  host: string;
  onGameChange: (game: IGameState) => void;
}

export function Game(props: Props) {
  const { host, onGameChange } = props;
  const { t } = useTranslation();
  const router = useRouter();

  const game = useGame();
  const { playerId } = useSession();
  const self = useSelfPlayer(game);
  const [, setGameId] = useLocalStorage("gameId", null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (game.status === IGameStatus.OVER) {
      setGameId(null);
      if (!self) {
        const timer = setTimeout(() => {
          router.push("/").catch(logFailedPromise);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [game.status, setGameId, self, router]);

  function persist(next: IGameState) {
    onGameChange(next);
    updateGame(next).catch(logFailedPromise);
  }

  function onJoinGame(playerName: string) {
    const player: IPlayer = {
      id: playerId,
      name: playerName,
      index: game.players.length,
      capturedGood: 0,
      capturedEvil: 0,
      setupDone: false,
      rpsChoice: null,
    };
    persist({ ...game, players: [...game.players, player], synced: false });
    setGameId(game.id);
  }

  function onStartGame() {
    persist(beginSetup({ ...game, synced: false }));
  }

  const playerIndex = self?.index ?? 0;

  return (
    <>
      {menuOpen && <MenuArea onClose={() => setMenuOpen(false)} />}
      <div className="game page-fill bg-main-dark relative flex flex-column w-100 overflow-y-auto screen-pad-x">
        {game.status === IGameStatus.LOBBY && <Lobby host={host} onJoinGame={onJoinGame} onStartGame={onStartGame} />}

        {game.status !== IGameStatus.LOBBY && (
          <div className="pv2 flex justify-end">
            <HomeButton onClick={() => setMenuOpen(true)} />
          </div>
        )}

        {game.status === IGameStatus.SETUP && self && (
          <SetupBoard game={game} playerIndex={playerIndex} onUpdate={persist} />
        )}

        {game.status === IGameStatus.SETUP && !self && (
          <div className="flex items-center justify-center w-100 h-100">
            <Txt value={t("spectating")} />
          </div>
        )}

        {game.status === IGameStatus.RPS && self && (
          <RpsPhase game={game} playerIndex={playerIndex} onUpdate={persist} />
        )}

        {game.status === IGameStatus.RPS && !self && (
          <div className="flex items-center justify-center w-100 h-100">
            <Txt value={t("spectating")} />
          </div>
        )}

        {game.status === IGameStatus.ONGOING && self && (
          <GameBoard game={game} playerIndex={playerIndex} onUpdate={persist} />
        )}

        {game.status === IGameStatus.ONGOING && !self && <SpectatorBoard game={game} />}

        {game.status === IGameStatus.OVER && self && <ResultScreen game={game} playerIndex={playerIndex} />}

        {game.status === IGameStatus.OVER && !self && (
          <div className="flex items-center justify-center w-100 h-100">
            <Txt value={t("gameEnded")} />
          </div>
        )}
      </div>
    </>
  );
}
