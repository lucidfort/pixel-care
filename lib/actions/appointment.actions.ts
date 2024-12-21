"use server";

import { monthlyAppointments } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { CreateAppointmentProps, ReportType, Status } from "@/types";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";
import { Query } from "node-appwrite";
import {
  APPOINTMENT_COLLECTION_ID,
  DATABASE_ID,
  databases,
} from "../appwrite.config";
import { db } from "../database.config";
import { parseStringify } from "../utils";

export const createAppointment = async (
  appointment: CreateAppointmentProps
) => {
  try {
    const newAppointment = await db.appointments.create(appointment);

    if (newAppointment) {
      revalidatePath("/list/appointments");
      revalidatePath(`/doctor/${appointment.primaryPhysician}/overview`);
      revalidatePath(`/doctor/${appointment.primaryPhysician}/appointments`);
      revalidatePath(`/patient/${appointment.patient}/overview`);
    }

    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async (query?: string[]) => {
  try {
    const appointments = query
      ? await db.appointments.list(query)
      : await db.appointments.list([Query.orderDesc("$createdAt")]);

    const documents = appointments.documents;

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount++;
        } else if (appointment.status === "pending") {
          acc.pendingCount++;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount++;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      documents: documents,
      ...counts,
    };

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await db.appointments.get(appointmentId);
    const report = await getReport({ appointmentId });

    const data = {
      appointment: appointment,
      report: report.documents[0],
    };

    return parseStringify(data);
  } catch (error) {
    console.log("An error occurred while fetching appointment", error);
  }
};

export const getPatientAppointments = async (id: string) => {
  try {
    const appointments = await databases.listDocuments(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      [Query.equal("patient", [id])]
    );

    return parseStringify(appointments.documents);
  } catch (error) {
    console.error(`Error fetching patient: ${id} appointments`, error);
  }
};

export const getDoctorAppointments = async (id: string) => {
  try {
    const appointments = await db.appointments.list([
      Query.equal("primaryPhysician", id),
    ]);

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointment) => {
        if (appointment.status === "scheduled") {
          acc.scheduledCount++;
        } else if (appointment.status === "pending") {
          acc.pendingCount++;
        } else if (appointment.status === "cancelled") {
          acc.cancelledCount++;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      documents: appointments.documents,
      ...counts,
    };

    return parseStringify(data);
  } catch (error) {
    console.error(`Error fetching doctor: ${id} appointments`, error);
  }
};

export const getAppointmentsPerMonth = async (year: number) => {
  // const oneWeekAgo = new Date();

  // oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  //  const appointmentsPerDay: number[] = new Array(7).fill(0);

  //  appointments.documents.forEach((appointment: any) => {
  //    const dayIndex = new Date(appointment.$createdAt);
  //    const dayOfWeek = dayIndex.getDay();

  //    appointmentsPerDay[dayOfWeek]++;
  //  });

  try {
    const appointments = await db.appointments.list([
      Query.select(["$createdAt", "status"]),
    ]);

    // Reset monthly appointments data to avoid stale data in repeated calls
    monthlyAppointments.forEach((month) => {
      month.scheduled = 0;
      month.cancelled = 0;
    });

    appointments.documents.forEach((appointment) => {
      const appointmentDate = new Date(appointment.$createdAt);

      if (appointmentDate.getFullYear() === year) {
        const month = appointmentDate.toLocaleString("en-NG", {
          month: "short",
        });

        // Find the corresponding month object
        const monthData = monthlyAppointments.find((mA) => mA.name === month);

        if (monthData) {
          if (appointment?.status === "scheduled") {
            monthData.scheduled++;
          } else if (appointment?.status === "cancelled") {
            monthData.cancelled++;
          }
        }
      }
    });

    return parseStringify(monthlyAppointments);
  } catch (error) {
    console.error(
      "An error occurred while fetching appointments per week",
      error
    );
  }
};

export const updateAppointment = async ({
  appointmentId,
  data,
}: {
  appointmentId: string;
  data: {
    schedule?: Date;
    status?: Status;
    primaryPhysician?: string;
    cancellationReason?: string;
  };
}) => {
  try {
    const updatedAppointment = await db.appointments.update(
      appointmentId,
      data
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not updated");
    }

    revalidatePath("/list/appointments(.*)");
    revalidatePath("/list/patients(.*)");
    revalidatePath(`/doctor/${data?.primaryPhysician}/overview`);
    revalidatePath(`/doctor/${data?.primaryPhysician}/appointments`);

    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const cancelOutdatedAppointments = async () => {
  try {
    const pendingAppointments = await db.appointments.list([
      Query.lessThanEqual("schedule", formatDateTime(new Date()).dateTime),
      Query.equal("status", "pending"),
      Query.select(["$id", "status", "cancellationReason"]),
    ]);

    let pA: Appointment[] = [];

    pendingAppointments.documents.forEach(async (pending) => {
      const cancelAllPendingAppointments = await db.appointments.update(
        pending.$id,
        {
          status: "cancelled",
          cancellationReason: "Appointment wasn't confirmed",
        }
      );

      pA.push(cancelAllPendingAppointments as Appointment);

      revalidatePath("/", "layout");
    });

    return parseStringify(pA);
  } catch (error) {
    console.log("Error updating appointment status", error);
  }
};

// REPORT ACTIONS
export const createReport = async (data: ReportType) => {
  try {
    const report = await db.reports.create(data);

    revalidatePath(`/list/appointments/${data.appointment}`);

    return parseStringify(report);
  } catch (error: any) {
    console.error("Error creating patient", error?.code);
  }
};

export const getReport = async ({
  appointmentId,
  reportId,
}: {
  appointmentId?: string;
  reportId?: string;
}) => {
  try {
    const report = appointmentId
      ? await db.reports.list([Query.equal("appointment", appointmentId)])
      : await db.reports.get(reportId!);

    return parseStringify(report);
  } catch (error) {
    console.error("Error fetching report", error);
  }
};
export const updateReport = async (id: string, data: ReportType) => {
  try {
    const updatedReport = await db.reports.update(id, data);

    if (updatedReport) {
      revalidatePath(`/list/appointments/${data?.appointment}/*`);
      revalidatePath(`/doctor/appointments/${data?.appointment}`);
    }

    return parseStringify(updatedReport);
  } catch (error) {
    console.error("Error updating report", error);
  }
};
export const deleteReport = async (id: string) => {
  try {
    const report = await db.reports.get(id);
    const deletedReport = await db.reports.delete(id);

    if (deletedReport)
      revalidatePath(`/list/appointments/${report.appointment.$id}`);

    return parseStringify(deletedReport);
  } catch (error) {
    console.error("Error deleting report", error);
  }
};
