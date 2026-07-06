import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import HomeButton from "~/components/homeButton";
import Button, { ButtonSize } from "~/components/ui/button";
import { TextInput } from "~/components/ui/forms";
import Txt, { TxtSize } from "~/components/ui/txt";
import { logFailedPromise } from "~/lib/errors";

function parseGameId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || null;
  } catch {
    return trimmed;
  }
}

export default function JoinGame() {
  const router = useRouter();
  const { t } = useTranslation();
  const [code, setCode] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const id = parseGameId(code);
    if (id) router.push(`/${id}`).catch(logFailedPromise);
  }

  return (
    <div className="w-100 h-100 flex justify-center items-center relative bg-main-dark pa2 pv4-l ph3-l shadow-5 br3">
      <HomeButton className="absolute top-1 right-1" />

      <div className="flex flex-column items-center w-100" style={{ maxWidth: "24rem" }}>
        <Txt size={TxtSize.LARGE} value={t("joinGame")} />
        <Txt className="mt2 tc" value={t("joinHint")} />

        <form className="w-100 mt4 flex flex-column" onSubmit={onSubmit}>
          <TextInput
            autoFocus
            className="w-100 mb3"
            placeholder={t("joinPlaceholder")}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button primary disabled={!code.trim()} size={ButtonSize.LARGE} text={t("join")} />
        </form>
      </div>
    </div>
  );
}
