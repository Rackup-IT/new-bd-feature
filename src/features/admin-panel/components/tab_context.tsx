"use client";

import { createContext, useContext, useState } from "react";

type NavProps = {
  navLink: string;
  navTitle: string;
};

interface TabContextValue {
  activeTab: NavProps;
  setActiveTab: React.Dispatch<React.SetStateAction<NavProps>>;
  edition: string;
  setEdition: React.Dispatch<React.SetStateAction<string>>;
}

const TabContext = createContext<TabContextValue | undefined>(undefined);

export function TabProvider({ children }: { children: React.ReactNode }) {
  // const navLink: string = "home";
  const [activeTab, setActiveTab] = useState<NavProps>({
    navLink: "home",
    navTitle: "Home",
  });
  const [edition, setEdition] = useState<string>("en");

  return (
    <TabContext.Provider
      value={{ activeTab, setActiveTab, edition, setEdition }}
    >
      {children}
    </TabContext.Provider>
  );
}

export function useTabContext(): TabContextValue {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("useTabContext must be used within TabProvider");
  return ctx!;
}
