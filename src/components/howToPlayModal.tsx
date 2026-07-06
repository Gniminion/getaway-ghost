import React from "react";
import { useTranslation } from "react-i18next";
import Button, { ButtonSize } from "~/components/ui/button";
import { Modal } from "~/components/ui/modal";
import Txt, { TxtSize } from "~/components/ui/txt";

interface Props {
  onClose: () => void;
}

export default function HowToPlayModal(props: Props) {
  const { onClose } = props;
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-column pa2" style={{ maxWidth: "28rem" }}>
        <Txt className="ttu txt-accent mb3" size={TxtSize.MEDIUM} value={t("howToPlay")} />
        <Txt className="f6 mh-30vh overflow-auto" value={t("howToPlayText")} />
        <Button className="mt3 w-100" size={ButtonSize.MEDIUM} text={t("close")} onClick={onClose} />
      </div>
    </Modal>
  );
}
