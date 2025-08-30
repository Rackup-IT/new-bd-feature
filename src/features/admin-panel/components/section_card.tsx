"use client";
import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/utils/utils";
import { useAppDispatch } from "../../../store/hooks";
import { openModalOverlay } from "../../../store/slice/modal_overlay_slice";
import {
  changeSectionTitle,
  makePostHightlight,
  removePostFromSection,
  removeSection,
  Section,
  toggleHightlightPost,
} from "../../../store/slice/section_slice";
import { Input } from "../components/input";

interface SectionCardProps {
  section: Section;
}

export default function SectionCard({ section }: SectionCardProps) {
  const dispatch = useAppDispatch();
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(section.title);

  const handleSaveTitle = () => {
    if (newTitle && newTitle.trim() !== section.title) {
      dispatch(
        changeSectionTitle({
          id: section._id,
          title: newTitle.trim(),
        })
      );
    }
    setIsEditTitle(false);
  };

  const handleCancelEdit = () => {
    setNewTitle(section.title);
    setIsEditTitle(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out w-full max-w-2xl mx-auto">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex-grow flex items-center gap-3">
          {isEditTitle ? (
            <Input
              label="Section Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
              className="text-lg font-semibold"
              autoFocus
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-800">
              {section.title}
            </h3>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditTitle ? (
            <>
              <button
                onClick={handleSaveTitle}
                className="p-2 text-green-500 hover:bg-green-100 rounded-full"
                aria-label="Save title"
              >
                <CheckIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                aria-label="Cancel edit"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditTitle(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              aria-label="Edit title"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => dispatch(toggleHightlightPost(section._id))}
            className={cn(
              "p-2 rounded-full transition-colors",
              section.hightlightPost
                ? "text-amber-500 hover:bg-amber-100"
                : "text-gray-400 hover:bg-gray-100"
            )}
            aria-label="Toggle highlight"
          >
            <StarIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <ul className="space-y-3">
          {section.posts.length > 0 ? (
            section.posts.map((p, idx) => {
              if (!p) {
                return (
                  <li
                    key={`missing-${idx}`}
                    className="flex items-center justify-between gap-4 p-2 rounded-lg bg-red-50 border-l-4 border-red-400"
                  >
                    <p className="text-red-700">
                      This post is no longer available.
                    </p>
                    <button
                      onClick={() =>
                        dispatch(
                          removePostFromSection({
                            sectionId: section._id,
                            postIndex: idx,
                          })
                        )
                      }
                      className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                      aria-label="Remove missing post"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </li>
                );
              }
              return (
                <li
                  key={p._id}
                  className={cn(
                    "flex items-center gap-4 p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50",
                    idx === 0 &&
                      section.hightlightPost &&
                      "bg-amber-100 border-l-4 border-amber-400"
                  )}
                  onClick={() =>
                    dispatch(
                      makePostHightlight({
                        sectinonId: section._id,
                        replaceIdx: idx,
                      })
                    )
                  }
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-800 line-clamp-1">
                      {p.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        removePostFromSection({
                          sectionId: section._id,
                          postId: p._id!,
                        })
                      );
                    }}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-full opacity-50 hover:opacity-100 transition-opacity"
                    aria-label="Remove post"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </li>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No posts in this section yet.</p>
            </div>
          )}
        </ul>
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={() => dispatch(openModalOverlay(section._id))}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Post
        </button>
        <button
          onClick={() => dispatch(removeSection(section._id))}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
          Delete Section
        </button>
      </div>
    </div>
  );
}
