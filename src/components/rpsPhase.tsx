import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { checkRpsTimeout, commitAction } from "~/lib/actions";
import IGameState, { RpsChoice } from "~/lib/state";

interface Props {
  game: IGameState;
  playerIndex: number;
  onUpdate: (game: IGameState) => void;
}

const CHOICES: RpsChoice[] = ["rock", "paper", "scissors"];

export default function RpsPhase(props: Props) {
  const { game, playerIndex, onUpdate } = props;
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState(60);

  const self = game.players.find((p) => p.index === playerIndex);
  const picked = self?.rpsChoice ?? null;
  const opponent = game.players.find((p) => p.index !== playerIndex);
  const opponentPicked = opponent?.rpsChoice ?? null;

  const rpsActions = game.turnsHistory
    .map((h) => h.action)
    .filter((a): a is Extract<typeof a, { action: "rps" }> => a.action === "rps");
  const lastTwo = rpsActions.slice(-2);
  const isTie =
    lastTwo.length === 2 &&
    lastTwo[0].choice === lastTwo[1].choice &&
    !picked &&
    !opponentPicked;

  useEffect(() => {
    if (!game.rpsDeadline) return;

    function tick() {
      const left = Math.max(0, Math.ceil((game.rpsDeadline - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left === 0) {
        const next = checkRpsTimeout(game);
        if (next !== game) onUpdate(next);
      }
    }

    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [game, onUpdate]);

  function choose(choice: RpsChoice) {
    if (picked) return;
    onUpdate(commitAction(game, { action: "rps", from: playerIndex, choice }));
  }

  return (
    <div className="flex flex-column items-center w-100 pa3">
      <Txt size={TxtSize.MEDIUM} value={t("rpsTitle")} />
      <Txt className="mt2 txt-accent" value={t("setupTimer", { seconds: secondsLeft })} />

      {isTie && <Txt className="mt3 txt-accent" value={t("rpsTie")} />}

      {!picked && (
        <div className="flex flex-wrap justify-center mt4 w-100">
          {CHOICES.map((c) => (
            <Button key={c} className="ma2" text={t(`rps_${c}`)} onClick={() => choose(c)} />
          ))}
        </div>
      )}

      {picked && !opponentPicked && <Txt className="mt4" value={t("waitingForOpponent")} />}
    </div>
  );
}
