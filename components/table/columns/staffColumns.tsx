"use client";

import { Staff } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { Button } from "../../ui/button";
import ListTableActions from "../ListTableActions";

export const staffColumns: ColumnDef<Staff>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row: { original: data } }) => {
      return (
        <div className="w-40 flex items-center h-10 gap-2">
          <Image
            src={
              data.user.identificationDocumentUrl ||
              "/assets/icons/noAvatar.png"
            }
            alt="image"
            width={26}
            height={26}
            className="w-12 h-12 rounded-full object-cover object-center"
          />
          {data?.user.firstName} {data?.user.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => "Role",
    cell: ({ row: { original: data } }) => {
      return <div className="capitalize">{data?.role}</div>;
    },
  },
  {
    accessorKey: "department",
    header: () => "Department",
    cell: ({ row: { original: data } }) => {
      return <div>{data.department}</div>;
    },
  },
  {
    accessorKey: "position",
    header: () => "Position",
    cell: ({ row: { original: data } }) =>
      data.position ? data.position : "-",
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row: { original: data } }) => {
      return <ListTableActions table={data?.role} id={data.$id} />;
    },
  },
];
