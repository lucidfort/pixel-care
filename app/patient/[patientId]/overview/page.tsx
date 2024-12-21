import HeaderBox from "@/components/HeaderBox";
import { DataTable } from "@/components/table/DataTable";
import { patientAppointmentColumns } from "@/components/table/columns/patientAppointmentColumns";
import { Button } from "@/components/ui/button";
import { getPatientAppointments } from "@/lib/actions/appointment.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Link from "next/link";

const PatientAppointmentsPage = async () => {
  const loggedInUser = await getLoggedInUser();

  const appointments = await getPatientAppointments(loggedInUser.patientId);

  return (
    <div className="w-full">
      <HeaderBox
        title="Your Appointments"
        subtitle="Note the dates of your upcoming appointments"
      />

      <div className="flex-end w-full mt-8 mb-4">
        <Button
          variant="secondary"
          className="bg-green-500 cursor-pointer"
          asChild
        >
          <Link href={`/patient/${loggedInUser?.patientId}/new-appointment`}>
            Book Appointment
          </Link>
        </Button>
      </div>

      <DataTable
        columns={patientAppointmentColumns}
        data={appointments}
        role="primaryPhysician"
      />
    </div>
  );
};

export default PatientAppointmentsPage;
