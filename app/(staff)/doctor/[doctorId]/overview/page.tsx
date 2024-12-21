import ScheduleCalendar from "@/components/ScheduleCalendar";
import { getDoctorAppointments } from "@/lib/actions/appointment.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { extractName } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { redirect } from "next/navigation";

interface Item {
  patient: { lastName: string; firstName: string };
  schedule: string;
}

const DoctorsOverviewPage = async ({ params }: SearchParamProps) => {
  const p = await params;
  const id = p.doctorId;

  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) redirect("/sign-in");

  const { lastName } = extractName(loggedInUser?.name);

  const appointments = await getDoctorAppointments(id);

  const calendarEvents = appointments?.documents?.map((item: Item) => ({
    title: `${item?.patient?.firstName} ${item?.patient?.lastName}`,
    start: new Date(item?.schedule),
    end: endTime(new Date(item?.schedule)),
  }));

  return (
    <div className="flex gap-14 flex-col w-full">
      <h2 className="header">Hello Dr. {lastName}</h2>

      <div className="h-full w-full">
        <ScheduleCalendar event={calendarEvents} />
      </div>
    </div>
  );
};

export default DoctorsOverviewPage;

const endTime = (date: Date) => {
  const day = date.setHours(date.getHours() + 1);
  const end = new Date(day);

  return end;
};
