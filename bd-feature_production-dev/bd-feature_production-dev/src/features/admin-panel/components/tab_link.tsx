"use client";

import { cn } from "@/utils/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { TabKey } from "../config/tab_config";

type RenderChildren = (options: { isActive: boolean }) => React.ReactNode;

interface TabLinkProps {
  tabkey: TabKey;
  children: React.ReactNode | RenderChildren;
  className?: string;
  activeClassName?: string;
}

const Tablink: React.FC<TabLinkProps> = ({
  children,
  tabkey,
  activeClassName,
  className,
}) => {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const newParams = new URLSearchParams(searchParams.toString());

  newParams.set("tab", tabkey);

  newParams.delete("editId");

  const href = `/dashboard/?${newParams.toString()}`;

  const isActive = currentTab === tabkey;

  // default premium-like base styles for links: block layout with focus treatment
  const base =
    "block rounded-3xl text-sm font-medium transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const content =
    typeof children === "function"
      ? (children as RenderChildren)({ isActive })
      : children;

  return (
    <Link
      href={href}
      className={cn(base, className, isActive && activeClassName)}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </Link>
  );
};

export default Tablink;
