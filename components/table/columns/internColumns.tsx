"use client";

import { Staff } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { Button } from "../../ui/button";
import ListTableActions from "../ListTableActions";

export const internColumns: ColumnDef<Staff>[] = [
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
        <div className="w-full flex items-center gap-2">
          <Image
            src={"/assets/icons/noAvatar.png"}
            alt="image"
            width={26}
            height={26}
          />
          {data?.firstName} {data?.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="hidden md:flex">Email</div>,
    cell: ({ row: { original: data } }) => {
      return <div className="hidden md:flex">{data.email}</div>;
    },
  },
  {
    accessorKey: "phone",
    header: () => <div className="hidden sm:flex">Phone</div>,
    cell: ({ row: { original: data } }) => {
      return <div className="hidden sm:flex">{data.phone}</div>;
    },
  },
  {
    accessorKey: "address",
    header: () => <div className="hidden lg:flex">Address</div>,
    cell: ({ row: { original: data } }) => {
      return <div className="hidden lg:flex">{data.address}</div>;
    },
  },
  // {
  //   accessorKey: "active",
  //   header: "Active",
  //   cell: ({ row: { original: data } }) => {
  //     return <div>{data.email}</div>;
  //   },
  // },
  // {
  //   accessorKey: "startDate",
  //   header: "Start Date",
  //   cell: ({ row: { original: data } }) => {
  //     return <div>{data.email}</div>;
  //   },
  // },
  // {
  //   accessorKey: "endDate",
  //   header: "End Date",
  //   cell: ({ row: { original: data } }) => {
  //     return <div>{data.email}</div>;
  //   },
  // },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row: { original: data } }) => {
      return <ListTableActions table="intern" id={data.$id} />;
    },
  },
];
