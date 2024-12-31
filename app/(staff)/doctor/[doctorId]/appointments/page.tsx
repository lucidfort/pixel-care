import HeaderBox from "@/components/HeaderBox";
import { doctorAppointmentColumns } from "@/components/table/columns/doctorAppointmentColumns";
import { DataTable } from "@/components/table/DataTable";
import { getDoctorAppointments } from "@/lib/actions/appointment.actions";
import { getDoctorsPatients } from "@/lib/actions/staff.actions";
import { SearchParamProps } from "@/types";

const DoctorAppointments = async ({ params }: SearchParamProps) => {
  const p = await params;
  const appointments = await getDoctorAppointments(p.doctorId);

  const patients = await getDoctorsPatients(p.doctorId);
  console.log(patients);

  return (
    <div className="space-y-4">
      <HeaderBox title="Appointments" subtitle="" />

      <DataTable
        role="status"
        columns={doctorAppointmentColumns}
        data={appointments.documents}
      />
    </div>
  );
};

export default DoctorAppointments;
