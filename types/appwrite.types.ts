import { Models } from "node-appwrite";
import { Gender, Status } from ".";

declare type Labels = "doctor" | "nurse" | "intern" | "patient" | "admin";

export interface User extends Models.Document {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  phone: string;
  gender: Gender;
  address: string;
  bloodType: string;
  label: Labels;
  identificationDocumentId: string | undefined;
  identificationDocumentUrl: string | undefined;
}

export interface Patient extends Models.Document {
  user: User;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: Doctor;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationNumber: string | undefined;
  privacyConsent: boolean;
}

export interface Staff extends Models.Document {
  user: User;
  userId: string;
  department: string;
  position: string | undefined;
  // role: 'doctor' | 'nurse' | 'intern'
}

export interface Doctor extends Staff {
  role: "doctor";
}
export interface Nurse extends Staff {
  role: "nurse";
}
export interface Intern extends Staff {
  role: "intern";
}

export interface Appointment extends Models.Document {
  patient: Patient;
  primaryPhysician: Doctor;
  schedule: Date;
  status: Status;
  appointmentReason: string;
  note: string | null;
  cancellationReason: string | null;
}

export interface Report extends Models.Document {
  visitationReason: string;
  vitals: JSON;
  generalAppearance: string;
  primaryDiagnosis: string;
  medicationsPrescribed: string;
  nextAppointment: Date;
  differentialDiagnosis: string | null;
  laboratoryTests: string | null;
  lifestyleRec: string | null;
  appointment: string;
}

export interface AlertProps {
  message: string;
  $id: string;
  patientId: string;
  read: boolean;
}
