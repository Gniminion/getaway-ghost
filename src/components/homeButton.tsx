import React, { useState } from "react";
import Button, { ButtonSize } from "~/components/ui/button";
import MenuArea from "~/components/menuArea";

interface Props {
  className?: string;
  onClick?: () => void;
}

export default function HomeButton(props: Props) {
  const { className, onClick } = props;
  const [menuOpen, setMenuOpen] = useState(false);

  function handleClick() {
    if (onClick) {
      onClick();
    } else {
      setMenuOpen(true);
    }
  }

  if (menuOpen && !onClick) {
    return <MenuArea onClose={() => setMenuOpen(false)} />;
  }

  return (
    <Button
      className={className}
      size={ButtonSize.SMALL}
      text="☰"
      onClick={handleClick}
      style={{ aspectRatio: "1" }}
    />
  );
}
