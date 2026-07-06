import React from "react";
import { useTranslation } from "react-i18next";
import HowToPlayContent from "~/components/howToPlayContent";
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
      <div className="flex flex-column pa2 content-modal">
        <Txt className="ttu txt-accent mb3" size={TxtSize.MEDIUM} value={t("howToPlay")} />
        <HowToPlayContent />
      </div>
    </Modal>
  );
}
