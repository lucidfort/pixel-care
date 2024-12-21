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
      const { firstName, lastName } = data.primaryPhysician.user;
      return (
        <Link
          href={`/list/doctors/${data.primaryPhysician.$id}`}
          className="flex flex-col gap-2"
        >
          <p className="whitespace-nowrap">
            {firstName} {lastName}{" "}
          </p>
        </Link>
      );
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row: { original: data } }) => {
      const { firstName, lastName } = data.patient.user;

      return (
        <Link
          href={`/list/patients/${data.patient.$id}`}
          className="flex flex-col gap-2"
        >
          <p className="whitespace-nowrap">
            {firstName} {lastName}{" "}
          </p>
        </Link>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Schedule",
    cell: ({ row: { original: data } }) => (
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(data.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row: { original: data } }) => <StatusBadge status={data.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row: { original: data } }) => {
      return <AppointmentTableActions data={data} />;
    },
  },
];
