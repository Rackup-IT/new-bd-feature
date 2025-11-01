"use client";
import { useEffect } from "react";

import { useGetSectionsApi } from "../hooks/api/useSectionApi";
import { DBResponseSchema } from "../validation/section/db_response";
import { useTabContext } from "./tab_context";
import TopbarItem from "./topbar_item";

export default function TopbarList() {
  const { activeTab, setActiveTab } = useTabContext();

  const {
    mutate: getAllSectionReq,
    data: sections,
    isPending: sectionPending,
  } = useGetSectionsApi();

  useEffect(() => {
    getAllSectionReq();
  }, [getAllSectionReq]);

  return (
    <ul className="flex space-x-3 overflow-auto w-full list-none">
      <TopbarItem
        tab="Home"
        isActive={activeTab.navLink === "home"}
        onClick={() => setActiveTab({ navLink: "home", navTitle: "Home" })}
      />
      {sectionPending && !sections ? (
        <p>loading</p>
      ) : (
        sections?.map((section: DBResponseSchema) => (
          <TopbarItem
            onClick={() =>
              setActiveTab({ navLink: section.href, navTitle: section.title })
            }
            key={section._id}
            tab={section.title}
            isActive={activeTab.navLink === section.href}
          />
        ))
      )}
    </ul>
  );
}
