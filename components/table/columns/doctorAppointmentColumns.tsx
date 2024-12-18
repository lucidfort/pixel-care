"use client";

import { Appointment } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import AppointmentTableActions from "../AppointmentTableActions";

export const doctorAppointmentColumns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row: { original: data } }) => {
      const { firstName, lastName, $id } = data.patient;

      return (
        <Link
          href={`/list/patients/${$id}`}
          className="font-semibold text-base min-w-[100px]"
        >
          {firstName} {lastName}
        </Link>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row: { original: data } }) => {
      return <AppointmentTableActions data={data} />;
    },
  },
];
