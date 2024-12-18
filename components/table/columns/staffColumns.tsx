"use client";

import { Staff } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
        <Link
          href={`/list/doctors/${data.$id}`}
          className="w-full flex items-center gap-2"
        >
          <Image
            src={"/assets/icons/noAvatar.png"}
            alt="image"
            width={26}
            height={26}
          />
          {data?.firstName} {data?.lastName}
        </Link>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => <div className="hidden sm:flex">Role</div>,
    cell: ({ row: { original: data } }) => {
      return <div className="hidden sm:flex capitalize">{data?.role}</div>;
    },
  },
  {
    accessorKey: "department",
    header: () => <div className="hidden md:flex">Department</div>,
    cell: ({ row: { original: data } }) => {
      return <div className="hidden md:flex">{data.department}</div>;
    },
  },
  {
    accessorKey: "position",
    header: () => <div className="hidden lg:flex">Position</div>,
    cell: ({ row: { original: data } }) => {
      return <div className="hidden lg:flex">{data.position}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row: { original: data } }) => {
      return <ListTableActions table={data?.role} id={data.$id} />;
    },
  },
];
