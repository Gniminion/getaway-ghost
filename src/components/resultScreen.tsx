import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";
import CaptureZone from "~/components/captureZone";
import Button from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { logFailedPromise } from "~/lib/errors";
import IGameState, { WinReason } from "~/lib/state";

interface Props {
  game: IGameState;
  playerIndex: number;
}

function resultDetail(won: boolean, reason: WinReason | null, t: (k: string) => string): string {
  if (reason === "escape") return won ? t("winEscape") : t("loseEscape");
  if (reason === "capturedGood") return won ? t("winCapturedGood") : t("loseCapturedGood");
  if (reason === "capturedEvil") return won ? t("winCapturedEvil") : t("loseCapturedEvil");
  return won ? t("youWin") : t("youLose");
}

export default function ResultScreen(props: Props) {
  const { game, playerIndex } = props;
  const { t } = useTranslation();
  const router = useRouter();

  const won = game.winner === playerIndex;

  return (
    <div className="flex flex-column items-center justify-center w-100 flex-grow-1 pv3">
      <Txt size={TxtSize.LARGE} value={won ? t("youWin") : t("youLose")} />
      <Txt className="mt2 tc" value={resultDetail(won, game.winReason, t)} />

      <div className="mt4 w-100 content-result">
        <CaptureZone game={game} side="top" viewerIndex={playerIndex} />
        <CaptureZone game={game} side="bottom" viewerIndex={playerIndex} />
      </div>

      <Button
        primary
        className="mt4"
        text={t("backToHome")}
        onClick={() => router.push("/").catch(logFailedPromise)}
      />
    </div>
  );
}
