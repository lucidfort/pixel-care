"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AppointmentModalProps } from "@/types";
import clsx from "clsx";
import { CalendarClock } from "lucide-react";
import { useState } from "react";
import AppointmentForm from "../forms/AppointmentForm";

const AppointmentModal = ({
  type,
  patientId,
  data,
  className,
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("")}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div
            className={clsx("capitalize flex items-center gap-2", {
              "text-green-500": type === "schedule" || type === "create",
              "text-red-500": type === "cancel",
            })}
          >
            <CalendarClock className={cn("", className)} />
            <span>{type}</span>
          </div>
        </DialogTrigger>

        <DialogContent
          aria-describedby="appointment-form"
          className="shad-dialog sm:max-w-2xl"
        >
          <DialogHeader className="mb-4 space-y-3">
            <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
            <DialogDescription>
              {type === "create"
                ? "Request a new appointment in 10 seconds"
                : `Please fill in the following details to ${type} an appointment`}
            </DialogDescription>
          </DialogHeader>

          <AppointmentForm
            type={type}
            data={data}
            setOpen={setOpen}
            patientId={patientId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentModal;
