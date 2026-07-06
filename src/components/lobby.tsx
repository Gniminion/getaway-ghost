import Head from "next/head";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/ui/button";
import { TextInput } from "~/components/ui/forms";
import Txt, { TxtSize } from "~/components/ui/txt";
import { useGame } from "~/hooks/game";
import { useSession } from "~/hooks/session";

interface Props {
  host: string;
  onJoinGame: (playerName: string) => void;
  onStartGame: () => void;
}

const NAME_KEY = "getaway_ghost_name";

export default function Lobby(props: Props) {
  const { host, onJoinGame, onStartGame } = props;
  const { t } = useTranslation();

  const game = useGame();
  const { playerId } = useSession();
  const router = useRouter();

  const [name, setName] = useState(() =>
    typeof localStorage !== "undefined" ? localStorage.getItem(NAME_KEY) ?? "" : ""
  );
  const [copied, setCopied] = useState(false);

  const selfPlayer = game.players.find((p) => p.id === playerId);
  const gameFull = game.players.length === 2;
  const canJoin = !selfPlayer && !gameFull;
  const canStart = selfPlayer && gameFull;

  const shareLink = `${host}/${router.query.gameId}`;
  const inputRef = React.createRef<HTMLInputElement>();

  function copy() {
    inputRef.current.select();
    document.execCommand("copy");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function onJoinSubmit(e: FormEvent) {
    e.preventDefault();
    localStorage.setItem(NAME_KEY, name);
    onJoinGame(name);
  }

  return (
    <div className="flex items-center justify-center h-100 w-100 pa2">
      <Head>
        <title>
          {t("appTitle")} · {t("lobby")}
        </title>
      </Head>

      {copied && (
        <div
          className="fixed z-999 bg-white black ph3 pv2 br2 shadow-2 f6 fw5"
          style={{ top: "1rem", left: "50%", transform: "translateX(-50%)" }}
        >
          {t("copied")}
        </div>
      )}

      <div className="flex flex-column items-center w-100 pa2" style={{ maxWidth: "24rem" }}>
        <Txt className="mb3 ttu" size={TxtSize.MEDIUM} value={t("lobby")} />

        {game.players.length > 0 && (
          <div className="mb3 w-100 tc">
            <Txt value={gameFull ? t("gameFull") : t("waitingForPlayers", { count: game.players.length })} />
            {game.players.map((p) => (
              <div key={p.id} className="mt1">
                <Txt value={`· ${p.name}${p.id === playerId ? ` (${t("you")})` : ""}`} />
              </div>
            ))}
          </div>
        )}

        {canStart && <Button primary className="mb3 w-100" id="start-game" text={t("startGame")} onClick={onStartGame} />}

        {canJoin && (
          <form className="flex flex-column items-center mt3 w-100" onSubmit={onJoinSubmit}>
            <Txt className="mb2 tc" value={t("choosePlayerName")} />
            <div className="flex items-center w-100">
              <TextInput
                autoFocus
                className="flex-grow-1 mr2"
                id="player-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button primary disabled={name.length === 0} id="join-game" text={t("join")} />
            </div>
          </form>
        )}

        {!gameFull && (
          <div className="flex flex-column items-center mt4 w-100">
            <Txt className="mb2 tc" value={t("shareGame")} />
            <a className="mb2 tc break-word" href={shareLink} rel="noopener noreferrer" target="_blank">
              <Txt value={shareLink} />
            </a>
            <input ref={inputRef} readOnly className="fixed top--2 left--2" type="text" value={shareLink} />
            <Button outlined text={t("copy")} onClick={copy} />
          </div>
        )}
      </div>
    </div>
  );
}
