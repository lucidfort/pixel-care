/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from "react";
import { Appointment, Patient, Staff, User } from "./appwrite.types";

declare type SearchParamProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

declare type Gender = "male" | "female" | "other";
declare type Labels = "doctor" | "nurse" | "intern" | "patient" | "admin";
declare type Status = "pending" | "scheduled" | "cancelled";

declare interface SigninProps {
  email: string;
  password: string;
  admin?: boolean;
}

type Users = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  bloodType: string;
  label: Labels;
  identificationDocument?: File[] | undefined;
};

declare interface PatientType extends Users {
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  bloodType: string;
  primaryPhysician: string;
  identificationNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;

  disclosureConsent: boolean;
  privacyConsent: boolean;
  treatmentConsent: boolean;
}

declare interface SignupParams extends PatientType {
  privacyConsent: boolean;
  treatmentConsent: boolean;
  disclosureConsent: boolean;

  password: string;
}

declare interface StaffProps extends Users {
  password: string;
  department: string;
  position?: string;
  label: "doctor" | "nurse" | "intern";
}

declare interface Patient extends SignupParams {
  $id: string;
}

declare interface SiderbarProps {
  patient: Patient; // TODO: WORK ON THIS TYPE DEFINITION
  unreadAlerts: number;
  location: "admin" | "patient";
}

declare interface FooterProps {
  user: { id: string; name: string; email: string; role: string };
  type?: "mobile" | "desktop";
}

declare type CreateAppointmentProps = {
  schedule: Date;
  appointmentReason: string;
  status: Status;
  note: string | undefined;
  primaryPhysician: string;
  patient: string;
};

declare type ReportType = {
  visitationReason: string;
  vitals: string;
  generalAppearance: string;
  primaryDiagnosis: string;
  medicationsPrescribed: string;
  nextAppointment: Date | null;
  differentialDiagnosis?: string;
  laboratoryTests?: string;
  lifestyleRec?: string;
  appointment: string;
};

declare type InfoColumnProps = {
  data?: Appointment;
  patient?: Patient;
};

declare type HeaderBoxProps = {
  title: string;
  subtitle: string | string[];
  className?: string;
};

declare interface MutateButtonProps {
  type: "create" | "update" | "delete";
  table: "patient" | "doctor" | "nurse" | "intern";
  className?: string;
  spanClassName?: string;
}

declare type AppointmentModalProps = {
  type: "schedule" | "create" | "cancel";
  role?: "appointment" | "report";
  data?: any;
  patientId?: string;

  className?: string;
};

declare interface AppointmentFormProps {
  patientId?: string;
  data?: any;
  type: "create" | "schedule" | "cancel";
  path?: string;
  setOpen?: (open: boolean) => void;
}

declare interface StaffFormProps {
  type: "create" | "update";
  data?: Staff;
  table: "doctor" | "nurse" | "intern";
}

declare interface PatientFormProps {
  type: "create" | "update";
  data?: Patient;
}

declare interface ReportFormProps {
  type: "create" | "update";
  data?: any;
  appointmentId: string;
}

declare interface PasskeyInitStateType {
  open: boolean;
  isLoading: boolean;
  form: {
    email: string;
    passkey: string;
  };
  phase: {
    email: boolean;
    passkey: boolean;
  };
  error: {
    animate: boolean;
    message: string;
  };
}

declare type REDUCER_ACTION_TYPE =
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_ISLOADING"; payload: boolean }
  | { type: "SET_FORM_DATA"; payload: Partial<PasskeyInitStateType["form"]> }
  | { type: "SET_PHASE"; payload: Partial<PasskeyInitStateType["phase"]> }
  | { type: "SET_ERROR"; payload: Partial<PasskeyInitStateType["error"]> };
