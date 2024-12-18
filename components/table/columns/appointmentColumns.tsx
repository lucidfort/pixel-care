"use client";

import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import AppointmentTableActions from "../AppointmentTableActions";

export const appointmentColumns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row: { original: data } }) => {
      const { firstName, lastName } = data.primaryPhysician;
      return (
        <Link
          href={`/list/appointments/${data.$id}`}
          className="flex flex-col gap-2"
        >
          <p className="whitespace-nowrap">
            {firstName} {lastName}{" "}
          </p>
          <p className="whitespace-nowrap md:hidden">
            {formatDateTime(data.schedule).dateOnly}
          </p>
        </Link>
      );
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row: { original: data } }) => {
      const { firstName, lastName } = data.patient;
      return (
        <div className="whitespace-nowrap">
          {firstName} {lastName}
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: () => <div className="hidden md:flex">Appointment</div>,
    cell: ({ row }) => (
      <p className="text-14-regular min-w-[100px] hidden md:flex">
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div>
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row: { original: data } }) => {
      return <AppointmentTableActions data={data} />;
    },
  },
];
