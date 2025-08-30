"use client";
import Image from "next/image";

import { cn } from "@/utils/utils";
import DialogOverlay from "../../../components/overlay/merge_modal";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { closeModalOverlay } from "../../../store/slice/modal_overlay_slice";
import { addPostToSection } from "../../../store/slice/section_slice";
import useAvaiblePosts from "../hooks/useAvaiblePosts";
import useToggleSelection from "../hooks/useToggleSelection";

export default function PostDialog() {
  const dispatch = useAppDispatch();
  const { isOpen, sectionId } = useAppSelector(
    (state) => state["model-overlay"]
  );
  const { selectedIds, clear, toggle, isSelected } =
    useToggleSelection<string>();
  const { avaiblePost } = useAvaiblePosts();

  if (!isOpen || !sectionId) return null;

  const handleAdd = () => {
    const posts = avaiblePost.filter((p) => selectedIds.has(p._id!));
    dispatch(addPostToSection({ sectionId, posts }));
    dispatch(closeModalOverlay());
    clear();
  };

  return (
    <DialogOverlay>
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Posts</h2>
          <button
            onClick={handleAdd}
            className="bg-purple-500 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        </header>

        <ul className="space-y-2 max-h-60 overflow-auto">
          {avaiblePost.length > 0 ? (
            avaiblePost.map((p) => (
              <li
                key={p._id}
                className={cn(
                  "flex space-x-3 items-center cursor-pointer hover:bg-gray-100 px-2 py-1 rounded",
                  isSelected(p._id!) && "bg-gray-100"
                )}
                onClick={() => toggle(p._id!)}
              >
                <div className="size-16 min-w-16 min-h-16 rounded-md overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    height={100}
                    width={100}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="font-medium line-clamp-2">{p.title}</h1>
                  <p className="text-xs text-gray-500">Sayem Mohaimin</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">13 March 2025</p>
                </div>
              </li>
            ))
          ) : (
            <p>No avaible posts</p>
          )}
        </ul>
      </div>
    </DialogOverlay>
  );
}
