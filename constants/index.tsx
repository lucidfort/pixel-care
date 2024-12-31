import { Gender } from "@/types";
import { FormFieldType } from "@/components/forms/CustomFormField";
import {
  Activity,
  BarChart3,
  BarChart4,
  Bed,
  BellDot,
  Clock10,
  Folder,
  GraduationCap,
  Hospital,
  Megaphone,
  Settings,
  SquareChevronDown,
  Stethoscope,
  User2,
  Users2,
} from "lucide-react";

export const GenderOptions = ["male", "female", "other"];

export const SidebarLinks = (id?: string, role?: string) => [
  {
    route: role === "admin" ? "/admin/overview" : `/${role}/${id}/overview`,
    label: "Overview",
    icon: <BarChart3 />,
    visibility: ["patient", "admin", "doctor"],
  },
  {
    route: `/${role}/${id}/new-appointment`,
    label: "New Appointment",
    icon: <SquareChevronDown />,
    visibility: ["patient"],
  },
  {
    route: `/doctor/${id}/appointments`,
    label: "Appointments",
    icon: <SquareChevronDown />,
    visibility: ["doctor"],
  },
  {
    route: `/doctor/${id}/patients`,
    label: "Patients",
    icon: <Bed />,
    visibility: ["doctor"],
  },
  {
    route: "/list/patients",
    label: "Patients",
    icon: <Bed />,
    visibility: ["admin"],
  },
  {
    route: "/list/staffs",
    label: "Staffs",
    icon: <Users2 />,
    visibility: ["admin"],
  },
  {
    route: "/list/doctors",
    label: "Doctors",
    icon: <Stethoscope />,
    visibility: ["admin"],
  },
  {
    route: "/list/nurses",
    label: "Nurses",
    icon: <Hospital />,
    visibility: ["admin"],
  },
  {
    route: "/list/interns",
    label: "Interns",
    icon: <GraduationCap />,
    visibility: ["admin"],
  },
  {
    route: "/list/appointments",
    label: "Appointments",
    icon: <Clock10 />,
    visibility: ["admin"],
  },
];

export const AuthFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  bloodType: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};

export const SigninInputs = [
  {
    name: "email",
    label: "Email",
    fieldType: FormFieldType.INPUT,
    iconSrc: "/assets/icons/email.svg",
    iconAlt: "email",
  },
  {
    name: "password",
    label: "Password",
    fieldType: FormFieldType.PASSWORD,
  },
];

export const HealthQuotes = [
  "It is health that is real wealth and not pieces of gold and silver",
  "The first wealth is health",
  "The groundwork of all happiness is health",
  "Your body hears everything your mind says",
  "Take care of your body. It's the the only place you have to live",
];

export const BloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];

export const monthlyAppointments = [
  {
    name: "Jan",
    scheduled: 0,
    cancelled: 0,
  },
  {
    name: "Feb",
    scheduled: 0,
    cancelled: 0,
  },
  {
    name: "Mar",
    scheduled: 0,
    cancelled: 0,
  },
  {
    name: "Apr",
    scheduled: 0,
    cancelled: 0,
  },
  {
    name: "May",
    scheduled: 0,
    cancelled: 0,
  },
  {
    name: "Jun",
    scheduled: 0,
    cancelled: 0,
  },
  {
    name: "Jul",
    scheduled: 0,
    cancelled: 0,
  },
  {
    name: "Aug",
    scheduled: 0,
    cancelled: 0,
  },
  {
    name: "Sep",
    scheduled: 0,
    cancelled: 0,
  },
  {
    name: "Oct",
    scheduled: 0,
    cancelled: 0,
  },
  {
    name: "Nov",
    scheduled: 0,
    cancelled: 0,
  },
  {
    name: "Dec",
    scheduled: 0,
    cancelled: 0,
  },
];
