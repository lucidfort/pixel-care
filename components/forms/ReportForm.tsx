"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ReportValidation } from "@/lib/validation";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { createReport, updateReport } from "@/lib/actions/appointment.actions";
import { ReportFormProps } from "@/types";
import { Button } from "../ui/button";
import CustomFormField, { FormFieldType } from "./CustomFormField";

export default function ReportForm({
  type,
  data,
  appointmentId,
}: ReportFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const vitals = data && JSON.parse(data?.vitals);

  const form = useForm<z.infer<typeof ReportValidation>>({
    resolver: zodResolver(ReportValidation),
    defaultValues: {
      heartRate: vitals?.heartRate ?? "",
      bloodPressure: vitals?.bloodPressure ?? "",
      temperature: vitals?.temperature ?? "",
      visitationReason: data?.visitationReason ?? "",
      generalAppearance: data?.generalAppearance ?? "",
      primaryDiagnosis: data?.primaryDiagnosis ?? "",
      medicationsPrescribed: data?.medicationsPrescribed ?? "",
      nextAppointment: data?.nextAppointment
        ? new Date(data.nextAppointment)
        : undefined,
      differentialDiagnosis: data?.differentialDiagnosis ?? "",
      laboratoryTests: data?.laboratoryTests ?? "",
      lifestyleRec: data?.lifestyleRec ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof ReportValidation>) {
    setIsLoading(true);

    try {
      const reportData = {
        visitationReason: values.visitationReason,
        vitals: JSON.stringify({
          heartRate: values.heartRate,
          bloodPressure: values.bloodPressure,
          temperature: values.temperature,
        }),
        generalAppearance: values.generalAppearance,
        primaryDiagnosis: values.primaryDiagnosis,
        medicationsPrescribed: values.medicationsPrescribed,
        nextAppointment: values.nextAppointment
          ? new Date(values.nextAppointment)
          : null,
        differentialDiagnosis: values.differentialDiagnosis,
        laboratoryTests: values.laboratoryTests,
        lifestyleRec: values.lifestyleRec,
        appointment: appointmentId,
      };

      if (type === "create" && appointmentId) {
        const newReport = await createReport(reportData);

        if (newReport) {
          form.reset();

          toast({
            description: "Report has been filed",
          });
        }
      }

      if (type === "update" && appointmentId) {
        const updatedReport = await updateReport(data.$id, reportData);

        if (updatedReport) {
          toast({
            description: "Report has been updated",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to file report. Please try again",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <div className="flex flex-col xl:flex-row gap-6">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="visitationReason"
            label="Visitation Reason"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="generalAppearance"
            label="General Appearance"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="laboratoryTests"
            label="Laboratory Tests"
          />
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="bloodPressure"
            label="Blood Pressure"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="temperature"
            label="Temperature"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="heartRate"
            label="Heart Rate"
          />
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="primaryDiagnosis"
            label="Primary Diagnosis"
            placeholder=""
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="differentialDiagnosis"
            label="Differential Diagnosis"
            placeholder="Systematic Examination(breathing ...)"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="lifestyleRec"
            label="Lifestyle Recommended"
          />
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="medicationsPrescribed"
            label="Medications Prescribed"
          />

          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="nextAppointment"
            label="Next Appointment"
            showTimeSelect
            dateFormat="MM/dd/yyyy - h:mm aa"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="shad-primary-btn w-full"
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
            <>{type === "create" ? "File Report" : "Update Report"}</>
          )}
        </Button>
      </form>
    </Form>
  );
}
