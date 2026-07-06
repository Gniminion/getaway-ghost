import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BoardGrid from "~/components/boardGrid";
import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { checkSetupTimeout, commitAction, setupValid } from "~/lib/actions";
import IGameState from "~/lib/state";

interface Props {
  game: IGameState;
  playerIndex: number;
  onUpdate: (game: IGameState) => void;
}

export default function SetupBoard(props: Props) {
  const { game, playerIndex, onUpdate } = props;
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState(60);

  const self = game.players.find((p) => p.index === playerIndex);
  const done = self?.setupDone ?? false;
  const canReady = setupValid(game, playerIndex);

  useEffect(() => {
    if (!game.setupDeadline) return;

    function tick() {
      const left = Math.max(0, Math.ceil((game.setupDeadline - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        const next = checkSetupTimeout(game);
        if (next !== game) onUpdate(next);
      }
    }

    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [game, onUpdate]);

  function toggle(ghostId: number) {
    if (done) return;
    onUpdate(commitAction(game, { action: "toggleSetup", from: playerIndex, ghostId }));
  }

  function finish() {
    if (done || !canReady) return;
    onUpdate(commitAction(game, { action: "finishSetup", from: playerIndex }));
  }

  return (
    <div className="flex flex-column items-center w-100 pv3">
      <Txt size={TxtSize.MEDIUM} value={t("setupPhase")} />
      <Txt className="mt1 tc" value={t("setupHint")} />
      <Txt className="mt2 txt-accent" value={t("setupTimer", { seconds: secondsLeft })} />

      <div className="mt3">
        <BoardGrid
          ghosts={game.ghosts}
          setupMode={!done}
          setupPlayerIndex={playerIndex}
          viewerIndex={playerIndex}
          onSetupToggle={toggle}
        />
      </div>

      {!done && <Button primary className="mt3" disabled={!canReady} text={t("ready")} onClick={finish} />}
      {done && <Txt className="mt3" value={t("waitingForOpponent")} />}
    </div>
  );
}
