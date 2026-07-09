import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import HowToPlayModal from "~/components/howToPlayModal";
import LanguageSelector from "~/components/languageSelector";
import Button, { ButtonSize } from "~/components/ui/button";
import { Modal } from "~/components/ui/modal";
import Txt, { TxtSize } from "~/components/ui/txt";
import { logFailedPromise } from "~/lib/errors";

interface Props {
  onClose: () => void;
}

export default function MenuArea(props: Props) {
  const { onClose } = props;
  const { t } = useTranslation();
  const router = useRouter();
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  if (howToPlayOpen) {
    return <HowToPlayModal onClose={() => setHowToPlayOpen(false)} />;
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-column items-center w-100 pa2">
        <Txt className="ttu txt-accent mb4" size={TxtSize.MEDIUM} value={t("appTitle")} />

        <div className="mb4">
          <LanguageSelector outlined />
        </div>
        <Button
          outlined
          className="mb3 w-100"
          size={ButtonSize.LARGE}
          text={t("howToPlay")}
          onClick={() => setHowToPlayOpen(true)}
        />
        <Button
          className="w-100"
          size={ButtonSize.LARGE}
          text={t("backToHome")}
          onClick={() => router.push("/").catch(logFailedPromise)}
        />
      </div>
    </Modal>
  );
}
