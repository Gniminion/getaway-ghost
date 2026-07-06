import React from "react";
import GameIndex from "~/components/GameIndex";
import { Session, SessionContext } from "~/hooks/session";
import { loadGame } from "~/lib/firebase";
import withSession, { getPlayerIdFromSession } from "~/lib/session";
import IGameState from "~/lib/state";

export const getServerSideProps = withSession(async function ({ req, params }) {
  const game = await loadGame(params.gameId as string);
  const playerId = await getPlayerIdFromSession(req);

  const protocol = process.env.NODE_ENV === "development" ? "http:" : "https:";
  const { host } = req.headers;

  return {
    props: {
      session: { playerId },
      game,
      host: `${protocol}//${host}`,
    },
  };
});

interface Props {
  game: IGameState;
  session: Session;
  host: string;
}

export default function Play(props: Props) {
  const { game, session, host } = props;

  return (
    <SessionContext.Provider value={session}>
      <GameIndex key={game.id} game={game} host={host} />
    </SessionContext.Provider>
  );
}
