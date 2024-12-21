import HeaderBox from "@/components/HeaderBox";
import StatCard from "@/components/StatCard";
import { DataTable } from "@/components/table/DataTable";
import { patientColumns } from "@/components/table/columns/patientColumns";
import { Button } from "@/components/ui/button";

import { getAllPatients } from "@/lib/actions/patient.actions";
import { calculateAgeCategory } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

const PatientsList = async () => {
  const patients = await getAllPatients();

  const age: any[] = patients?.documents.map((doc: any) =>
    calculateAgeCategory(doc.user.birthDate)
  );

  const minors = age.filter((a) => a === "Minor").length;
  const adults = age.filter((a) => a === "Adult").length;
  const elders = age.filter((a) => a === "Elder").length;

  return (
    <div className="relative flex flex-col gap-4 py-2">
      <HeaderBox title="All Patients" subtitle="" />

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
      <div className="flex items-end justify-end">
        <Button variant="secondary" className="bg-green-500" asChild>
          <Link href={`/list/patients/add-patient`}>
            <Plus />
            Add Patient
          </Link>
        </Button>
      </div>
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
