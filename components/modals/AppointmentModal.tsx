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
import { Button } from "../ui/button";

const AppointmentModal = ({
  type,
  id,
  data,
  className,
}: AppointmentModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("")}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className={clsx("capitalize", {
              "text-green-500": type === "schedule",
              "text-red-500": type === "cancel",
            })}
          >
            <>
              <CalendarClock className={cn("mr-2", className)} /> {type}
            </>
          </Button>
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
            patientId={id}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentModal;