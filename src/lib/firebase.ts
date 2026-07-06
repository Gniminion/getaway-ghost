import firebase from "firebase/app";
import "firebase/database";
import IGameState, { cleanState, fillEmptyValues } from "~/lib/state";

function databaseUrl(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_URL || process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "";
}

function database() {
  if (!firebase.apps.length) {
    const url = databaseUrl();
    const isLocal = url.includes("localhost");

    firebase.initializeApp(
      isLocal
        ? { databaseURL: url }
        : {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            databaseURL: url,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
          }
    );
  }

  return firebase.database();
}

export async function loadGame(gameId: string) {
  const ref = database().ref(`/games/${gameId}`);

  return new Promise<IGameState>((resolve) => {
    ref.once("value", (event) => {
      resolve(fillEmptyValues(event.val()));
    });
  });
}

export function subscribeToGame(gameId: string, callback: (game: IGameState) => void) {
  const ref = database().ref(`/games/${gameId}`);

  ref.on("value", (event) => {
    callback(fillEmptyValues(event.val() as IGameState));
  });

  return () => ref.off();
}

export async function updateGame(game: IGameState) {
  await database().ref(`/games/${game.id}`).set(cleanState(game));
}

export async function createGame(game: IGameState) {
  await updateGame(game);
}
