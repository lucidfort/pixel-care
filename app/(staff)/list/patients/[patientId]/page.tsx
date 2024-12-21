import ActiveShapePie from "@/components/charts/ActiveShapePie";
import HeaderBox from "@/components/HeaderBox";
import InfoCard from "@/components/InfoCard";
import AppointmentModal from "@/components/modals/AppointmentModal";
import StatCard from "@/components/StatCard";
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
    { value: 0, name: "Pending Appointments", fill: "pending" },
    { value: 0, name: "Scheduled Appointments", fill: "appointments" },
    { value: 0, name: "Cancelled Appointments", fill: "cancelled" },
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
        <div className="w-full md:w-[43%] xl:w-1/3 flex flex-wrap sm:flex-row gap-4 md:flex-col">
          {data.map((d) => (
            <StatCard
              key={d.name}
              count={d.value}
              label={d.name}
              type={d.fill as "pending" | "appointments" | "cancelled"}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex-between">
          <HeaderBox title="Appointments" subtitle="" />

          <AppointmentModal type="create" patientId={patientId} />
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
