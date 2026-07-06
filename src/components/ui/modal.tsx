import React, { ReactNode } from "react";
import Button from "~/components/ui/button";

interface Props {
  children: ReactNode;
  onClose: () => void;
}

export function Modal(props: Props) {
  const { children, onClose } = props;

  return (
    <div className="modal-overlay fixed absolute--fill flex items-center justify-center z-999" onClick={onClose}>
      <div
        className="modal-content bg-main-dark pa3 ba b--accent"
        onClick={(e) => e.stopPropagation()}
      >
        <Button void className="absolute right-1 top-1" text="×" onClick={onClose} />
        {children}
      </div>
    </div>
  );
}
