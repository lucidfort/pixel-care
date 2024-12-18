import { z } from "zod";

export const authFormValidation = (type: "sign-in" | "sign-up") =>
  z.object({
    // sign up
    firstName:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be at most 50 characters"),
    lastName:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(50, "Name must be at most 50 characters"),
    confirmPassword:
      type === "sign-in" ? z.string().optional() : z.string().min(8),
    phone:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .refine(
              (phone) => /^\+\d{10,15}$/.test(phone),
              "Invalid phone number"
            ),
    birthDate: type === "sign-in" ? z.string().optional() : z.coerce.date(),
    gender:
      type === "sign-in"
        ? z.string().optional()
        : z.enum(["male", "female", "other"]),
    address:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .min(5, "Address must be at least 5 characters")
            .max(500, "Address must be at most 500 characters"),
    occupation:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .min(2, "Occupation must be at least 2 characters")
            .max(500, "Occupation must be at most 500 characters"),
    emergencyContactName:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .min(2, "Contact name must be at least 2 characters")
            .max(50, "Contact name must be at most 50 characters"),
    emergencyContactNumber:
      type === "sign-in"
        ? z.string().optional()
        : z
            .string()
            .refine(
              (emergencyContactNumber) =>
                /^\+\d{10,15}$/.test(emergencyContactNumber),
              "Invalid phone number"
            ),
    primaryPhysician:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(2, "Select at least one doctor"),
    identificationNumber:
      type === "sign-in"
        ? z.string().optional()
        : z.string().min(11, { message: "please input correct Nin" }),
    identificationDocument:
      type === "sign-in"
        ? z.string().optional()
        : z.custom<File[]>().optional(),
    bloodType:
      type === "sign-in"
        ? z.string().optional()
        : z.string({ message: "bloodType is required" }),
    allergies: z.string().optional(),
    currentMedication: z.string().optional(),
    familyMedicalHistory: z.string().optional(),
    pastMedicalHistory: z.string().optional(),
    treatmentConsent:
      type === "sign-in"
        ? z.boolean().optional()
        : z
            .boolean()
            .default(false)
            .refine((value) => value === true, {
              message: "You must consent to treatment in order to proceed",
            }),
    disclosureConsent:
      type === "sign-in"
        ? z.boolean().optional()
        : z
            .boolean()
            .default(false)
            .refine((value) => value === true, {
              message: "You must consent to disclosure in order to proceed",
            }),
    privacyConsent:
      type === "sign-in"
        ? z.boolean().optional()
        : z
            .boolean()
            .default(false)
            .refine((value) => value === true, {
              message: "You must consent to privacy in order to proceed",
            }),
    profilePhoto: z.string().optional(),

    // both
    email: z.string().email("Invalid email address"),
    password:
      type === "sign-in"
        ? z.string()
        : z
            .string()
            .min(10, "Please increase password security")
            .refine(
              (password) =>
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{9,}$/.test(
                  password
                ),
              "Please increase your password security"
            ),
  });

export const patientValidation = z.object({
  firstName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 50 characters"),
  lastName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(20, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  birthDate: z.coerce.date(),
  gender: z.enum(["male", "female", "other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be at most 500 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ),
  bloodType: z.string({ message: "bloodType is required" }),
  primaryPhysician: z.string({ message: "Please select a doctor" }),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
  identificationNumber: z
    .string()
    .min(11, { message: "Please input correct NIN" }),
  identificationDocument: z.custom<File[] | string>().optional(),
});

export const staffValidation = (type: "create" | "update") =>
  z.object({
    firstName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 50 characters"),
    lastName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must be at most 50 characters"),
    email: z.string().email("Invalid email address"),
    password:
      type === "create"
        ? z
            .string()
            .min(8, "Please increase password security")
            .refine(
              (password) =>
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{9,}$/.test(
                  password
                ),
              "Please increase password security"
            )
        : z.string().optional(),
    confirmPassword:
      type === "create" ? z.string().min(8) : z.string().optional(),
    phone: z
      .string()
      .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
    birthDate: z.coerce.date(),
    gender: z.enum(["male", "female", "other"]),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(100, "Address must be at most 500 characters"),
    department: z.string({ message: "Department is required" }),
    bloodType: z.string({ message: "bloodType is required" }),
    position: z.string().optional(),
    img: z.custom<File[]>().optional(),
  });

export const UpdatePatientFormValidation = z.object({
  fname: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  lname: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  birthDate: z.coerce.date(),
  gender: z.enum(["male", "female", "other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters"),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters"),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    ),
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters"),
  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters"),
  allergies: z.string().optional(),
  currentMedication: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  pastMedicalHistory: z.string().optional(),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select a doctor"),
  schedule: z.coerce.date(),
  appointmentReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(1000, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select a doctor"),
  schedule: z.coerce.date(),
  appointmentReason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select a doctor"),
  schedule: z.coerce.date(),
  appointmentReason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export const MessageValidation = z.object({
  title: z.string().min(2),
  recipient: z.string(),
  message: z.string().min(30),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "schedule":
      return ScheduleAppointmentSchema;

    case "cancel":
      return CancelAppointmentSchema;

    default:
      return CreateAppointmentSchema;
  }
}

export const ReportValidation = z.object({
  visitationReason: z.string(),
  bloodPressure: z.coerce.number(),
  heartRate: z.coerce.number(),
  temperature: z.coerce.number(),
  generalAppearance: z.string(),
  primaryDiagnosis: z.string(),
  medicationsPrescribed: z.string(),
  nextAppointment: z.coerce.date().optional(),
  differentialDiagnosis: z.string().optional(),
  laboratoryTests: z.string().optional(),
  lifestyleRec: z.string().optional(),
});

export const adminValidation = z.object({
  email: z.string().email("Invalid email address"),
});
