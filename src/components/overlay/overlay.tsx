"use client";

import { cn } from "../../utils/utils";

interface OverlayProps {
  children: React.ReactNode;
  className: string;
}

const Overlay: React.FC<OverlayProps> = (props) => (
  <div
    className={cn(
      "z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      props.className
    )}
  >
    {props.children}
  </div>
);

export default Overlay;
