"use client";

import { cn } from "@/utils/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { TabKey } from "../config/tab_config";

interface TabLinkProps {
  tabkey: TabKey;
  children: React.ReactNode;
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

  // default premium-like base styles for links: padded, rounded, subtle shadow
  const base =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-shadow";

  return (
    <Link
      href={href}
      className={cn(base, className, isActive && activeClassName)}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
};

export default Tablink;
