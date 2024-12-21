import HeaderBox from "@/components/HeaderBox";
import StatusBadge from "@/components/StatusBadge";
import AppointmentModal from "@/components/modals/AppointmentModal";
import DeleteReportModal from "@/components/modals/DeleteReportModal";
import { Button } from "@/components/ui/button";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { calculateDate, cn, formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { Appointment } from "@/types/appwrite.types";
import Link from "next/link";

const AppointmentInfo = async ({ params }: SearchParamProps) => {
  const param = await params;
  const loggedInUser = await getLoggedInUser();
  const appointmentId = param.appointmentId;

  const { appointment, report } = await getAppointment(appointmentId);
  const vitals = report && JSON.parse(report?.vitals);

  const { AppointmentInfo, ReportInfo } = appointmentInfoCards({
    vitals,
    report,
    appointment,
  });

  const { isDatePresent, daysUntilDate } = calculateDate(appointment?.schedule);

  return (
    <div className="flex gap-4 flex-col">
      {appointment?.status !== "cancelled" && (
        <div className="flex-between flex-wrap bg-cover bg-pending px-5 py-3 gap-6 w-full">
          {isDatePresent && (
            <div className="flex items-end justify-end gap-6">
              <AppointmentModal type="schedule" data={appointment} />
              <AppointmentModal type="cancel" data={appointment} />
            </div>
          )}

          {daysUntilDate <= 0 && (
            <div className="flex items-end flex-wrap md:justify-end gap-6">
              {!report ? (
                <Button variant={"secondary"} asChild>
                  <Link
                    href={`/list/appointments/${appointmentId}/generate-report`}
                  >
                    Generate Report
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant={"secondary"} asChild>
                    <Link
                      href={`/list/appointments/${appointmentId}/edit-report?reportId=${report.$id}`}
                    >
                      Edit Report
                    </Link>
                  </Button>

                  <DeleteReportModal
                    id={report?.$id}
                    role={loggedInUser.role}
                  />
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        {/* LEFT */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="stat-card bg-cancelled w-full max-h-fit">
            <HeaderBox title="Appointment Details" subtitle="" />

            {AppointmentInfo.map((info) => (
              <div key={info.label} className="flex items-center gap-4">
                <span className="text-gray-400 w-24">{info.label}:</span>
                {info.data}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        {appointment.status !== "cancelled" && (
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="stat-card bg-pending flex flex-col px-4 py-5 gap-4">
              <HeaderBox title={`Doctor's Report`} subtitle="" />

              {ReportInfo.map((info) => (
                <div key={info.label} className="flex items-center gap-4">
                  <span className="text-gray-400 w-28 xl:w-40">
                    {info.label}:
                  </span>
                  {info.data}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentInfo;

const appointmentInfoCards = ({
  vitals,
  report,
  appointment,
}: {
  vitals: any;
  report: any;
  appointment: Appointment;
}) => {
  const AppointmentInfo = [
    {
      label: "Date",
      data: formatDateTime(appointment?.schedule).dateTime,
    },
    {
      label: "Doctor",
      data: `${appointment?.primaryPhysician.user.firstName} ${appointment?.primaryPhysician.user.lastName}`,
    },
    {
      label: "Patient",
      data: `${appointment?.patient.user?.firstName} ${appointment?.patient?.user.lastName}`,
    },
    {
      label: "Status",
      data: <StatusBadge status={appointment?.status} />,
    },
    {
      label: "Appointment Reason",
      data: appointment?.appointmentReason,
    },
    {
      label: "Cancellation Reason",
      data: appointment?.cancellationReason || "-",
    },
    {
      label: "Patient's Note",
      data: appointment?.note || "-",
    },
  ];

  const ReportInfo = [
    {
      label: "Appearance",
      data: report?.generalAppearance || "-",
    },
    {
      label: "Visitation Reason",
      data: report?.visitationReason || "-",
    },
    {
      label: "Temperature",
      data: vitals?.temperature || "-",
    },
    {
      label: "Heart Rate",
      data: vitals?.heartRate || "-",
    },
    {
      label: "Blood Pressure",
      data: vitals?.bloodPressure || "-",
    },
    {
      label: "Laboratory Tests",
      data: report?.laboratoryTests || "-",
    },
    {
      label: "Lifestyle Recommended",
      data: report?.lifestyleRec || "-",
    },
    {
      label: "Primary Diagnosis",
      data: report?.primaryDiagnosis || "-",
    },
    {
      label: "Differential Diagnosis",
      data: report?.differentialDiagnosis || "-",
    },
    {
      label: "Medications Prescribed",
      data: report?.medicationsPrescribed || "-",
    },
    {
      label: "Next Appointment",
      data: report?.nextAppointment
        ? formatDateTime(report?.nextAppointment).dateTime
        : "-",
    },
  ];

  return { AppointmentInfo, ReportInfo };
};
