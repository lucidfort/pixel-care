import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import { DataTable } from "@/components/table/DataTable";
import { patientColumns } from "@/components/table/columns/patientColumns";

import { getDoctorsPatients } from "@/lib/actions/staff.actions";
import { calculateAgeCategory } from "@/lib/utils";
import { SearchParamProps } from "@/types";

const PatientsList = async ({ params }: SearchParamProps) => {
  const p = await params;
  const patients = await getDoctorsPatients(p.doctorId);

  const age: any[] = patients?.documents.map((doc: any) =>
    calculateAgeCategory(doc.user.birthDate)
  );

  const minors = age.filter((a) => a === "Minor").length;
  const adults = age.filter((a) => a === "Adult").length;
  const elders = age.filter((a) => a === "Elder").length;

  return (
    <div className="relative flex flex-col gap-4 py-2">
      <HeaderBox title="Your Patients" subtitle="" />

      <section className="admin-stat">
        <StatCard
          type="appointments"
          count={minors}
          label="Minors"
          icon="/assets/icons/minor.svg"
        />
        <StatCard
          type="pending"
          count={adults}
          label="Adults"
          icon="/assets/icons/adult.svg"
        />
        <StatCard
          type="cancelled"
          count={elders}
          label="Elders"
          icon="/assets/icons/elders.svg"
        />
      </section>

      <div className="relative flex flex-col space-y-20">
        <DataTable
          role="firstName"
          columns={patientColumns}
          data={patients.documents}
        />
      </div>
    </div>
  );
};

export default PatientsList;
