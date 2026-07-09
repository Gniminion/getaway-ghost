import React from "react";
import { useTranslation } from "react-i18next";
import BoardGrid from "~/components/boardGrid";
import CaptureZone from "~/components/captureZone";
import Txt, { TxtSize } from "~/components/ui/txt";
import IGameState from "~/lib/state";

interface Props {
  game: IGameState;
}

export default function SpectatorBoard(props: Props) {
  const { game } = props;
  const { t } = useTranslation();

  const currentName = game.players[game.currentPlayer]?.name ?? "";

  return (
    <div className="flex flex-column items-center w-100 pv2">
      <Txt className="mb2" value={t("spectating")} />

      <CaptureZone isSpectating game={game} side="top" viewerIndex={0} />

      <Txt className="mb2" size={TxtSize.SMALL} value={t("opponentTurn", { name: currentName })} />

      <BoardGrid isSpectating game={game} ghosts={game.ghosts} viewerIndex={0} />

      <CaptureZone isSpectating game={game} side="bottom" viewerIndex={0} />
    </div>
  );
}
