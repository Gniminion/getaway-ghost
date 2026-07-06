import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HowToPlayModal from "~/components/howToPlayModal";
import GhostIcon from "~/components/ghostIcon";
import LanguageSelector from "~/components/languageSelector";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import useLocalStorage from "~/hooks/localStorage";
import { newGame } from "~/lib/actions";
import { logFailedPromise } from "~/lib/errors";
import { createGame, loadGame } from "~/lib/firebase";
import { generateShuffleSeed, nextGameId } from "~/lib/id";
import { GameMode, IGameStatus } from "~/lib/state";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [gameId, setGameId] = useLocalStorage("gameId", null);
  const [mounted, setMounted] = useState(false);
  const [canRejoin, setCanRejoin] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    router.prefetch("/join-game").catch(logFailedPromise);
  }, [router]);

  useEffect(() => {
    if (!mounted || !gameId) {
      setCanRejoin(false);
      return;
    }

    loadGame(gameId)
      .then((game) => {
        if (!game?.id || game.status === IGameStatus.OVER) {
          setGameId(null);
          setCanRejoin(false);
        } else {
          setCanRejoin(true);
        }
      })
      .catch(logFailedPromise);
  }, [mounted, gameId, setGameId]);

  async function onNewGame() {
    const id = nextGameId();
    const game = newGame({
      id,
      playersCount: 2,
      gameMode: GameMode.NETWORK,
      private: false,
      seed: generateShuffleSeed(),
    });
    await createGame(game);
    router.push(`/${id}`).catch(logFailedPromise);
  }

  return (
    <div className="relative w-100 page-fill flex flex-column screen-pad-x pt5 pb3 shadow-5 br3 bg-main-dark">
      {howToPlayOpen && <HowToPlayModal onClose={() => setHowToPlayOpen(false)} />}

      <Head>
        <title>{t("appTitle")}</title>
        <meta content={t("tagline")} name="description" />
      </Head>

      <div className="absolute top-1 right-2 z-1">
        <LanguageSelector outlined />
      </div>

      <div className="flex-grow-1 flex flex-column justify-center items-center w-100 pb3">
        <div className="flex items-center justify-center">
          <Txt size={TxtSize.LARGE} value={t("appTitle")} />
          <GhostIcon className="ml4" size={40} type="hidden" />
        </div>
        <span className="tc mt2 content-narrow">{t("tagline")}</span>

        <main className="flex flex-column items-center mt4 w-100 content-narrow">
          <Button
            primary
            className="mb4 w-100"
            id="new-game"
            size={ButtonSize.LARGE}
            text={t("newGame")}
            onClick={onNewGame}
          />
          <Button
            className="mb4 w-100"
            id="join-game"
            size={ButtonSize.LARGE}
            text={t("joinGame")}
            onClick={() => router.push("/join-game").catch(logFailedPromise)}
          />
          {canRejoin && (
            <Button
              className="mb4 w-100"
              id="rejoin-game"
              size={ButtonSize.LARGE}
              text={t("continueGame")}
              onClick={() => router.push(`/${gameId}`).catch(logFailedPromise)}
            />
          )}
          <Button
            outlined
            className="w-100"
            id="how-to-play"
            size={ButtonSize.LARGE}
            text={t("howToPlay")}
            onClick={() => setHowToPlayOpen(true)}
          />
        </main>
      </div>

      <Txt className="flex-shrink-0 w-100 tc pb2" size={TxtSize.XSMALL} value={t("credits")} />
    </div>
  );
}
