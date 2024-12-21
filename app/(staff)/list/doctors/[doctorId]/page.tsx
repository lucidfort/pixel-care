import InfoCard from "@/components/InfoCard";
import StatCard from "@/components/StatCard";
import { doctorAppointmentColumns } from "@/components/table/columns/doctorAppointmentColumns";
import { DataTable } from "@/components/table/DataTable";
import { getDoctorAppointments } from "@/lib/actions/appointment.actions";
import { getStaff } from "@/lib/actions/staff.actions";
import { SearchParamProps } from "@/types";

const SingleDoctorPage = async ({ params }: SearchParamProps) => {
  const p = await params;

  const doctor = await getStaff({ id: p.doctorId });
  const appointments = await getDoctorAppointments(p.doctorId);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex gap-4 flex-col xl:flex-row">
        {/* LEFT */}
        <div className="w-full xl:w-2/3 flex flex-col gap-4">
          <InfoCard data={doctor} page="doctor" />
        </div>

        {/* RIGHT */}
        <div className="xl:w-1/3 flex flex-wrap gap-4 xl:flex-col">
          <StatCard
            count={appointments.pendingCount}
            label="Pending Appointments"
            type="pending"
          />
          <StatCard
            count={appointments.scheduledCountCount}
            label="Scheduled Appointments"
            type="appointments"
          />
          <StatCard
            count={appointments.cancelledCount}
            label="Cancelled Appointments"
            type="cancelled"
          />
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-24-bold mt-4">Appointments</h2>

        <DataTable
          role="status"
          columns={doctorAppointmentColumns}
          data={appointments.documents}
        />
      </section>
    </div>
  );
};

export default SingleDoctorPage;
