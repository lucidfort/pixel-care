"use client";

import { Patient } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { Button } from "../../ui/button";
import ListTableActions from "../ListTableActions";

export const patientColumns: ColumnDef<Patient>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row: { original: data } }) => {
      return (
        <div className="flex items-center gap-2 text-16-semibold min-w-[130px]">
          <Image
            src={
              data.user.identificationDocumentUrl ||
              "/assets/icons/noAvatar.png"
            }
            alt="image"
            width={46}
            height={46}
            className="rounded-full object-cover object-center"
          />
          {data.user.firstName} {data.user.lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row: { original: data } }) => {
      return (
        <div className="text-16-regular min-w-[100px]">{data.user.email}</div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row: { original: data } }) => {
      return (
        <div className="text-16-regular min-w-[100px]">{data.user.phone}</div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row: { original: data } }) => {
      return (
        <div className="text-16-regular min-w-[100px]">{data.user.address}</div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row: { original: data } }) => {
      return <ListTableActions table="patient" id={data.$id} />;
    },
  },
];
