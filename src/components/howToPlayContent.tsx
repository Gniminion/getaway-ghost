import React from "react";
import { useTranslation } from "react-i18next";
import GetawayExitIcon from "~/components/getawayExitIcon";
import GhostIcon from "~/components/ghostIcon";

function GhostRow(props: { type: "good" | "evil"; count?: number; size?: number }) {
  const { type, count = 4, size = 16 } = props;
  return (
    <span className="how-to-play__ghost-row">
      {Array.from({ length: count }, (_, i) => (
        <GhostIcon key={i} className="how-to-play__inline-icon" size={size} type={type} />
      ))}
    </span>
  );
}

export default function HowToPlayContent() {
  const { t } = useTranslation();

  return (
    <div className="how-to-play font-mono mh-30vh overflow-auto">
      <p className="how-to-play__p">
        {t("howToPlay_p1a")} <GhostIcon className="how-to-play__inline-icon" size={18} type="good" />{" "}
        {t("howToPlay_p1b")}
        <GhostIcon className="how-to-play__inline-icon" size={18} type="evil" />
        {t("howToPlay_p1c")} <GetawayExitIcon tile className="how-to-play__inline-icon" size={22} />
        {t("howToPlay_p1d")}
      </p>

      <p className="how-to-play__p">{t("howToPlay_p2")}</p>

      <p className="how-to-play__p">
        {t("howToPlay_p3a")} <GhostRow type="good" /> {t("howToPlay_p3b")}
      </p>

      <p className="how-to-play__p">
        {t("howToPlay_p4a")} <GhostRow type="evil" /> {t("howToPlay_p4b")}
      </p>

      <p className="how-to-play__p">
        {t("howToPlay_p5a")} <GetawayExitIcon tile className="how-to-play__inline-icon" size={20} />{" "}
        {t("howToPlay_p5b")}
      </p>

      <p className="how-to-play__p how-to-play__credit">{t("howToPlay_credit")}</p>
    </div>
  );
}
