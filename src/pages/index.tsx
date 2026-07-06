import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HowToPlayModal from "~/components/howToPlayModal";
import LanguageSelector from "~/components/languageSelector";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import useLocalStorage from "~/hooks/localStorage";
import { newGame } from "~/lib/actions";
import { logFailedPromise } from "~/lib/errors";
import { createGame } from "~/lib/firebase";
import { generateShuffleSeed, nextGameId } from "~/lib/id";
import { GameMode } from "~/lib/state";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();
  const [gameId] = useLocalStorage("gameId", null);
  const [mounted, setMounted] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    router.prefetch("/join-game").catch(logFailedPromise);
  }, [router]);

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
    <div className="relative w-100 h-100 flex flex-column justify-center items-center pa2 pv4-l ph3-l shadow-5 br3 bg-main-dark">
      {howToPlayOpen && <HowToPlayModal onClose={() => setHowToPlayOpen(false)} />}

      <Head>
        <title>{t("appTitle")}</title>
        <meta content={t("tagline")} name="description" />
      </Head>

      <div className="absolute top-1 right-2">
        <LanguageSelector outlined />
      </div>

      <div className="flex flex-column items-center">
        <Txt size={TxtSize.LARGE} value={t("appTitle")} />
        <span className="tc mt2">{t("tagline")}</span>

        <main className="flex flex-column mt5">
          <Button
            primary
            className="mb4"
            id="new-game"
            size={ButtonSize.LARGE}
            text={t("newGame")}
            onClick={onNewGame}
          />
          <Button
            className="mb4"
            id="join-game"
            size={ButtonSize.LARGE}
            text={t("joinGame")}
            onClick={() => router.push("/join-game").catch(logFailedPromise)}
          />
          {mounted && gameId && (
            <Button
              className="mb4"
              id="rejoin-game"
              size={ButtonSize.LARGE}
              text={t("continueGame")}
              onClick={() => router.push(`/${gameId}`).catch(logFailedPromise)}
            />
          )}
          <Button
            outlined
            id="how-to-play"
            size={ButtonSize.LARGE}
            text={t("howToPlay")}
            onClick={() => setHowToPlayOpen(true)}
          />
        </main>
      </div>
    </div>
  );
}
