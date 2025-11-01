"use client";

import {
  addSectionListFromDB,
  setSectionLoading,
} from "@/store/slice/section_slice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { useGetPageApi } from "../hooks/api/usePageApi";
import SortableSectionItem from "./sortable_section_item";
import { useTabContext } from "./tab_context";

export default function SectionList() {
  const dispatch = useAppDispatch();
  const sections = useAppSelector((s) => s.secion.list);
  const { activeTab, edition } = useTabContext();
  const { mutate, data, isPending } = useGetPageApi(edition, activeTab.navLink);

  useEffect(() => {
    dispatch(setSectionLoading());
    mutate();
  }, [edition, activeTab.navLink, dispatch, mutate]);

  useEffect(() => {
    if (data && data.sections.length > 0) {
      dispatch(addSectionListFromDB(data.sections));
    } else if (data) {
      dispatch(addSectionListFromDB([]));
    }
  }, [data, dispatch]);

  return (
    <div className="flex flex-row flex-wrap gap-8 overflow-y-auto h-[calc(100vh-180px)] p-1">
      {isPending || !sections
        ? // Skeleton loading state
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-[350px] h-[400px] bg-gray-100 rounded-lg p-4 animate-pulse"
            >
              <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))
        : sections.map((sec, idx) => (
            <SortableSectionItem
              key={sec._id}
              id={sec._id}
              index={idx}
              section={sec}
            />
          ))}
    </div>
  );
}
