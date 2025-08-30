"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import Backdrop from "./backdrop";
import Overlay from "./overlay";

interface MergeModelProps {
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
  onBakcdropClick?: () => void;
  className?: string;
  useBackdrop?: boolean;
}

const MergedModel: React.FC<MergeModelProps> = ({
  useBackdrop = true,
  ...props
}) => {
  const [isMouted, setIsMouted] = useState(false);

  useEffect(() => {
    setIsMouted(true);
    return () => setIsMouted(false);
  }, []);

  if (!isMouted) return null;
  return (
    <>
      {useBackdrop &&
        createPortal(
          <Backdrop
            closeOnOutsideClick={props.closeOnOutsideClick!}
            onBakcdropClick={props.onBakcdropClick!}
          />,
          document.getElementById("backdrop")!
        )}
      {createPortal(
        <Overlay className={props.className!}>{props.children}</Overlay>,
        document.getElementById("overlay")!
      )}
    </>
  );
};

export default MergedModel;
