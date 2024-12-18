import Image from "next/image";
import Link from "next/link";

import { SearchParamProps } from "@/types";
import { Button } from "@/components/ui/button";
import { getAppointment } from "@/lib/actions/appointment.actions";

import BookedAppointmentDetails from "@/components/BookedAppointmentDetails";

const Success = async ({ params, searchParams }: SearchParamProps) => {
  const searchP = await searchParams;
  const p = await params;

  const appointmentId = searchP?.appointmentId as string;
  const appointment = await getAppointment(appointmentId);

  return (
    <div className="success-img">
      <section className="flex flex-col items-center">
        <Image
          src="/assets/gifs/success.gif"
          height={300}
          width={280}
          alt="Success"
          unoptimized={true}
        />

        <h2 className="header mb-6 text-center max-w-[600px]">
          Your <span className="text-green-500">appointment request</span> has
          been successfully submitted
        </h2>

        <p>We will be in touch shortly to confirm</p>
      </section>

      <BookedAppointmentDetails appointment={appointment} />

      <Button variant="outline" className="shad-primary-btn" asChild>
        <Link href={`/patient/${p.patientId}/new-appointment`}>
          New Appointment
        </Link>
      </Button>

      <p className="copyright">&copy; 2024 PixelCare</p>
    </div>
  );
};

export default Success;
