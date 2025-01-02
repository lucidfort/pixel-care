import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import { Clock8, LucideUsers2, Workflow } from "lucide-react";

import StatCard from "@/components/StatCard";
import ActiveShapePie from "@/components/charts/ActiveShapePie";
import BarChartContainer from "@/components/charts/BarChartContainer";
import { getUsers } from "@/lib/actions/user.actions";
import Link from "next/link";

const AdminOverviewPage = async () => {
  const users = await getUsers();
  const appointments = await getRecentAppointmentList();

  const appointmentsCount = [
    { value: appointments.pendingCount, name: "Pending", fill: "#79b5ec" },
    { value: appointments.scheduledCount, name: "Scheduled", fill: "#24ae7c" },
    { value: appointments.cancelledCount, name: "Cancelled", fill: "#f37877" },
  ];

  return (
    <div className="flex flex-1 flex-col w-full space-y-12">
      <section className="w-full space-y-4">
        <h1 className="header">Welcome Doc</h1>
        <p className="text-dark-700">
          Start the day with managing appointments
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/list/patients" className="w-full">
          <StatCard
            count={users.patientCount}
            label="Patients"
            svg={<LucideUsers2 className="size-8 w-fit text-yellow-700" />}
          />
        </Link>
        <Link href="/list/staffs" className="w-full">
          <StatCard
            count={users.staffCount}
            label="Staffs"
            svg={<Workflow className="size-8 w-fit text-green-700" />}
          />
        </Link>
        <Link href="/list/appointments" className="w-full">
          <StatCard
            count={appointments.totalCount}
            label="Appointments"
            svg={<Clock8 className="size-8 w-fit text-red-700" />}
          />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 xl:h-[70%] w-full">
        <div className="h-96 w-full rounded-2xl bg-cover py-6 px-4 shadow-lg shadow-neutral-800">
          <h2 className="text-lg text-gray-400 font-semibold">
            Appointments Status
          </h2>
          <ActiveShapePie data={appointmentsCount} />
        </div>

        <BarChartContainer />
      </div>
    </div>
  );
};

export default AdminOverviewPage;
