import { Models } from "node-appwrite";
import { Gender, Status } from ".";

export interface User extends Models.Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: Date;
  gender: Gender;
  address: string;
}

export interface Patient extends User {
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
  identificationDocumentUrl: string | undefined;
}

export interface Staff extends User {
  department: string;
  position: string | undefined;
  img: string | undefined;
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
  primaryPhysician: Staff;
  schedule: Date;
  status: Status;
  appointmentReason: string;
  note: string;
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
