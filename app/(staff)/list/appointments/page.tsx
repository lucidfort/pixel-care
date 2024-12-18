import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import { appointmentColumns } from "@/components/table/columns/appointmentColumns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

const AppointmentsList = async () => {
  const appointments = await getRecentAppointmentList();

  return (
    <div className="relative flex flex-col gap-4 py-2">
      <HeaderBox
        title="Recent Appointments"
        subtitle="Carefully sort through the table and schedule the appointments that
          fit."
      />

      <section className="admin-stat">
        <StatCard
          type="appointments"
          count={appointments.scheduledCount}
          label="Scheduled appointments"
          icon="/assets/icons/appointments.svg"
        />
        <StatCard
          type="pending"
          count={appointments.pendingCount}
          label="Pending appointments"
          icon="/assets/icons/pending.svg"
        />
        <StatCard
          type="cancelled"
          count={appointments.cancelledCount}
          label="Cancelled appointments"
          icon="/assets/icons/cancelled.svg"
        />
      </section>

      <DataTable
        columns={appointmentColumns}
        data={appointments.documents}
        role="status"
      />
    </div>
  );
};

export default AppointmentsList;
