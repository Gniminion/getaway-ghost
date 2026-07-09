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
  isSpectating?: boolean;
}

export default function CaptureZone(props: Props) {
  const { game, viewerIndex, side, isSpectating = false } = props;
  const { t } = useTranslation();

  const capturerIndex = side === "bottom" ? viewerIndex : 1 - viewerIndex;
  const captured = capturedGhosts(game, capturerIndex);
  const isMine = capturerIndex === viewerIndex;
  const isP1 = capturerIndex === 0;

  let labelKey: string;

  if (isSpectating) {
    labelKey = isP1 ? "p1Captures" : "p2Captures";
  } else {
    const prefix = isMine ? "your" : "opponent";
    const suffix = isP1 ? "P1" : "P2";
    labelKey = `${prefix}${suffix}Captures`;
  }

  return (
    <div className={classnames("capture-zone flex items-center", side === "top" ? "mb2" : "mt2")}>
      <Txt
        className="capture-zone__label mr2"
        size={TxtSize.SMALL}
        value={t(labelKey)}
      />
      <div className="capture-zone__dots flex">
        {captured.map((g) => (
          <GhostDot key={g.id} size={14} type={visibleType(g, isSpectating ? -1 : viewerIndex)} />
        ))}
        {captured.length === 0 && <Txt className="f6" value=":" />}
      </div>
    </div>
  );
}
