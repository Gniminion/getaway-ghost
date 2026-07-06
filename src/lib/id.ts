import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

export type ID = string;

export function nextGameId(): ID {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 3,
    separator: "",
    style: "capital",
  });
}

export function uniqueId(): ID {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

export function generateShuffleSeed(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
