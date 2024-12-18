import ActiveShapePie from "@/components/charts/ActiveShapePie";
import HeaderBox from "@/components/HeaderBox";
import InfoCard from "@/components/InfoCard";
import AppointmentModal from "@/components/modals/AppointmentModal";
import { patientAppointmentColumns } from "@/components/table/columns/patientAppointmentColumns";
import { DataTable } from "@/components/table/DataTable";
import { getPatientAppointments } from "@/lib/actions/appointment.actions";
import { getPatient } from "@/lib/actions/patient.actions";
import { SearchParamProps } from "@/types";
import { Appointment } from "@/types/appwrite.types";

const SinglePatientPage = async ({ params }: SearchParamProps) => {
  const p = await params;
  const patientId = p.patientId;

  const patient = await getPatient(patientId);
  const appointments = await getPatientAppointments(patientId);

  const data = [
    { value: 0, name: "Pending", fill: "#79b5ec" },
    { value: 0, name: "Scheduled", fill: "#24ae7c" },
    { value: 0, name: "Cancelled", fill: "#f37877" },
  ];

  appointments.forEach((appointment: Appointment) => {
    if (appointment?.status === "pending") {
      data[0].value++;
    }

    if (appointment?.status === "scheduled") {
      data[1].value++;
    }

    if (appointment?.status === "cancelled") {
      data[2].value++;
    }
  });

  return (
    <div className="flex gap-14 flex-col">
      <div className="flex flex-col md:flex-row gap-4 h-fit">
        {/* LEFT */}
        <div className="w-full lg:w-[67%] md:w-[56%]">
          <InfoCard page="patient" data={patient} />
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-[44%] lg:w-[35%]">
          <div className="stat-card h-[50vh]">
            <ActiveShapePie data={data} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex-between">
          <HeaderBox title="Appointments" subtitle="" />

          <AppointmentModal type="create" id={patientId} />
        </div>

        <DataTable
          role="primaryPhysician"
          columns={patientAppointmentColumns}
          data={appointments}
        />
      </div>
    </div>
  );
};

export default SinglePatientPage;
