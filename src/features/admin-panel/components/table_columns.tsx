"use client";

import Img from "next/image";
import Link from "next/link";

import { DBResponseSchema } from "../validation/blog/db_response";
import StatusDropDown from "./status_dropdown";
import { Column } from "./table";

interface createTableColumnsProps {
  onStatusChange: (row: DBResponseSchema, newStatus: string) => void;
  onDelete: (row: DBResponseSchema) => void;
  loadingPostId?: string | null;
  successPostId?: string | null;
}

export default function createTableColumns(
  props: createTableColumnsProps
): Column<DBResponseSchema>[] {
  return [
    {
      header: "ID",
      cell: (_, idx) => idx + 1,
    },
    {
      header: "Image",
      cell: (row) => (
        <div className="size-[100px] relative">
          <Img
            className="object-cover"
            src={row.image}
            alt="Post image"
            fill
            sizes="80px"
            priority
          />
        </div>
      ),
    },
    {
      header: "Title",
      cell: (row) => row.title,
    },
    {
      header: "Writer",
      cell: (row) => row.writter,
    },
    {
      header: "Section",
      cell: (row) => row.section,
    },
    {
      header: "Edition",
      cell: (row) => row.edition,
    },
    {
      header: "Edit",
      cell: (row) => (
        <Link href={`/dashboard/?tab=create-blog&editId=${row.slug}`}>
          Edit
        </Link>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <StatusDropDown
          current={row.status || "Draft"}
          onChange={(newStatus) => props.onStatusChange(row, newStatus)}
          onDelete={() => props.onDelete(row)}
          isLoading={props.loadingPostId === row._id}
          showSuccess={props.successPostId === row._id}
          lastUpdated={row.updatedAt}
        />
      ),
    },
  ];
}
