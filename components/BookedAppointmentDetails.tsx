import Image from "next/image";
import { formatDateTime } from "@/lib/utils";

const BookedAppointmentDetails = ({ appointment }: { appointment: any }) => {
  const appointmentInfo = appointment;

  const { schedule } = appointmentInfo.appointment;
  const { firstName, lastName } = appointmentInfo.appointment.primaryPhysician;

  return (
    <section className="request-details">
      <p>Requested Appointment Details</p>
      <div className="flex items-center gap-3">
        <Image
          src={"/assets/images/dr-cruz.png"}
          alt="doctor"
          width={100}
          height={100}
          className="size-6"
        />
        <p className="whitespace-nowrap">
          Dr. {firstName} {lastName}
        </p>
      </div>

      <div className="flex gap-2">
        <Image
          src="/assets/icons/calendar.svg"
          alt="calendar"
          width={24}
          height={24}
        />
        <p>{formatDateTime(schedule).dateTime}</p>
      </div>
    </section>
  );
};

export default BookedAppointmentDetails;
