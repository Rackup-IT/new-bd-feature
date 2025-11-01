"use client";

import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3Icon } from "@heroicons/react/24/solid";

import { cn } from "@/utils/utils";
import { Section } from "../../../store/slice/section_slice";
import SectionCard from "./section_card";

interface SortableSectionItemProps {
  id: string;
  section: Section;
  index: number;
}

export default function SortableSectionItem(props: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.id,
    animateLayoutChanges: defaultAnimateLayoutChanges,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-start gap-4 w-fit transition-shadow duration-300",
        isDragging && "shadow-2xl rounded-lg"
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "flex items-center justify-center w-12 h-12 mt-4 bg-gray-100 rounded-lg cursor-grab",
          "hover:bg-gray-200 transition-colors",
          isDragging && "bg-gray-300"
        )}
        aria-label="Drag handle"
      >
        <Bars3Icon className="w-6 h-6 text-gray-500" />
      </div>

      {/* Section Card */}
      <div className="flex-grow">
        <div className="text-sm font-medium text-gray-500 mb-1">
          Position: {props.index + 1}
        </div>
        <div className={cn(isDragging && "opacity-50")}>
          <SectionCard section={props.section} />
        </div>
      </div>
    </div>
  );
}
