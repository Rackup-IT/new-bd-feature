"use client";

import { cn } from "../../../utils/utils";

interface TopBarItemProps {
  tab: string;
  isActive: boolean;
  onClick: () => void;
}

export default function TopBarItem(props: TopBarItemProps) {
  return (
    <li
      onClick={props.onClick}
      className={cn(
        "px-2 rounded-md cursor-pointer list-none",
        props.isActive ? "bg-amber-200" : "bg-gray-100"
      )}
    >
      {props.tab}
    </li>
  );
}
