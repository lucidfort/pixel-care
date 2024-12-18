"use client";

import { Appointment } from "@/types/appwrite.types";
import { ColumnDef } from "@tanstack/react-table";

import AppointmentModal from "@/components/modals/AppointmentModal";
import StatusBadge from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/utils";

export const patientAppointmentColumns: ColumnDef<Appointment>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>,
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row: { original: data } }) => {
      const { firstName, lastName } = data.primaryPhysician;

      return (
        <div className="font-semibold text-base min-w-[100px]">
          Dr. {firstName} {lastName}
        </div>
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
    cell: ({ row: { original: data } }) => (
      <div className={data.status === "cancelled" ? "hidden" : "block"}>
        <AppointmentModal type="cancel" data={data} />
      </div>
    ),
  },
];
