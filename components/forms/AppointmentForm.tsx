"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getAppointmentSchema } from "@/lib/validation";
import { useState } from "react";

import { SelectItem } from "../ui/select";

import { useToast } from "@/hooks/use-toast";
import { AppointmentFormProps, Status } from "@/types";
import { Button } from "../ui/button";
import CustomFormField, { FormFieldType } from "./CustomFormField";

import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";

import { useDoctors } from "@/context/DoctorsContext";
import { useRouter } from "next/navigation";

export type doctorsInitState = {
  id: string;
  name: string;
  img: string;
};

export default function AppointmentForm({
  setOpen,
  type,
  data,
  patientId,
  path,
}: AppointmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { toast } = useToast();
  const { doctors } = useDoctors();

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: data ? data.primaryPhysician.$id : "",
      schedule: data ? new Date(data?.schedule) : new Date(Date.now()),
      appointmentReason: data ? data.appointmentReason : "",
      note: data?.note || "",
      cancellationReason: data?.cancellationReason || "",
    },
  });

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "cancelled";
        break;
      default:
        status = "pending";
        break;
    }

    try {
      if (type === "create" && patientId) {
        const appointmentData = {
          patient: patientId,
          primaryPhysician: values.primaryPhysician!,
          schedule: new Date(values.schedule!),
          appointmentReason: values.appointmentReason!,
          note: values.note,
          status: status as Status,
        };

        const newAppointment = await createAppointment(appointmentData);

        if (newAppointment) {
          toast({
            description: "Appointment has been created.",
          });
          setOpen && setOpen(false);

          if (path === "patient") router.push(`/patient/${patientId}/overview`);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create appointment. Please try again",
          });
        }
      }

      if (type !== "create") {
        const appointmentToUpdate = {
          appointmentId: data?.$id!,
          data:
            type === "schedule"
              ? {
                  primaryPhysician: values.primaryPhysician,
                  schedule: new Date(values.schedule!),
                  status: status as Status,
                  note: values.note,
                }
              : {
                  status: status as Status,
                  cancellationReason: values.cancellationReason,
                },
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
          toast({
            description:
              type === "schedule"
                ? "Appointment has been scheduled"
                : "Appointment has been cancelled",
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  let buttonLabel;

  switch (type) {
    case "create":
      buttonLabel = "Create Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    case "cancel":
      buttonLabel = "Cancel Appointment";
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type !== "cancel" && (
          <>
            <div className="flex flex-col xl:flex-row gap-6">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                name="primaryPhysician"
                label="Primary Physician"
                placeholder="Select a doctor"
              >
                {doctors
                  ? doctors.map((doctor: doctorsInitState) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        <div className="flex cursor-pointer items-center gap-2">
                          <Image
                            src={doctor.img || "/assets/icons/noAvatar.png"}
                            alt=""
                            width={32}
                            height={32}
                            className="rounded-full border border-dark-500"
                          />
                          <p>{doctor.name}</p>
                        </div>
                      </SelectItem>
                    ))
                  : "Loading..."}
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="schedule"
                label="Expected appointment date"
                showTimeSelect
                minDate={new Date()}
                dateFormat="MM/dd/yyyy - h:mm aa"
              />
            </div>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="appointmentReason"
              label="Reason for appointment"
              placeholder="Enter appointment reason"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="note"
              label="Notes"
              placeholder="Enter anything you think we should know"
            />
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="animate-spin"
              />
            </div>
          ) : (
            buttonLabel
          )}
        </Button>
      </form>
    </Form>
  );
}
