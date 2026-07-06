import classnames from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import GhostDot from "~/components/ghostDot";
import Txt, { TxtSize } from "~/components/ui/txt";
import { capturedGhosts } from "~/lib/actions";
import { visibleType } from "~/lib/board";
import IGameState from "~/lib/state";

interface Props {
  game: IGameState;
  viewerIndex: number;
  side: "top" | "bottom";
}

export default function CaptureZone(props: Props) {
  const { game, viewerIndex, side } = props;
  const { t } = useTranslation();

  const capturerIndex = side === "bottom" ? viewerIndex : 1 - viewerIndex;
  const captured = capturedGhosts(game, capturerIndex);
  const isMine = capturerIndex === viewerIndex;

  return (
    <div className={classnames("capture-zone flex items-center", side === "top" ? "mb2" : "mt2")}>
      <Txt className="capture-zone__label mr2" size={TxtSize.SMALL} value={t(isMine ? "yourCaptures" : "opponentCaptures")} />
      <div className="capture-zone__dots flex">
        {captured.map((g) => (
          <GhostDot key={g.id} size={14} type={visibleType(g, viewerIndex)} />
        ))}
        {captured.length === 0 && <Txt className="f6" value="—" />}
      </div>
    </div>
  );
}
