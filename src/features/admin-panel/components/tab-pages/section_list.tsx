"use client";

import {
  openModalOverlayForAddSection,
  openModalOverlayForSectionEdit,
} from "@/store/slice/modal_overlay_slice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  useDeleteSectionApi,
  useGetSectionsApi,
} from "../../hooks/api/useSectionApi";
import { DBResponseSchema } from "../../validation/section/db_response";
import AddSectionDialog from "../add_section_dialog";
import Table, { Column } from "../table";

const SectionList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mutate, data, isPending, error: apiError } = useGetSectionsApi();
  const { mutate: mutateDelete, data: deleteData } = useDeleteSectionApi();
  const isDialogOpen = useAppSelector((state) => state["model-overlay"].isOpen);

  const columns: Column<DBResponseSchema>[] = [
    {
      header: "ID",
      cell: (_, idx) => idx + 1,
    },
    {
      header: "Title",
      cell: (row) => row.title,
    },
    {
      header: "Edition",
      cell: (row) => row.edition,
    },
    {
      header: "Edit",
      cell: (section) => (
        <button
          onClick={() => dispatch(openModalOverlayForSectionEdit(section))}
          className="bg-amber-400 px-4 py-1 rounded-md cursor-pointer"
        >
          Edit
        </button>
      ),
    },
    {
      header: "Delete",
      cell: (props) => (
        <button
          onClick={() => mutateDelete(props._id!)}
          className="bg-red-400 px-4 py-1 rounded-md cursor-pointer"
        >
          Delete
        </button>
      ),
    },
  ];

  useEffect(() => {
    mutate();
  }, [deleteData, mutate]);

  if (isPending || !data) {
    return <p>Loading...</p>;
  }

  if (apiError) {
    return <p>{apiError.message}</p>;
  }

  return (
    <>
      <div className="relative w-full h-full">
        <Table<DBResponseSchema> columns={columns} data={data!} rowKey="_id" />
        {data.length === 0 && <p>No sections found</p>}
        <button
          onClick={() => {
            dispatch(openModalOverlayForAddSection());
          }}
          className="absolute bottom-0 right-0 bg-amber-500 size-14 rounded-full text-lg cursor-pointer"
        >
          +
        </button>
      </div>
      {isDialogOpen && <AddSectionDialog />}
    </>
  );
};

export default SectionList;
