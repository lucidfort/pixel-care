import AppointmentForm from "@/components/forms/AppointmentForm";
import HeaderBox from "@/components/HeaderBox";
import { SearchParamProps } from "@/types";

export default async function NewAppointmentPage({ params }: SearchParamProps) {
  const param = await params;

  return (
    <div className="flex flex-col gap-12 overflow-hidden">
      <HeaderBox
        title="Book Appointment"
        subtitle="Request for an appointment in seconds and we'll back to you quickly"
      />
      <AppointmentForm
        type="create"
        patientId={param.patientId}
        path="patient"
      />
    </div>
  );
}
