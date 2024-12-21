import HeaderBox from "@/components/HeaderBox";
import { doctorColumns } from "@/components/table/columns/doctorColumns";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { getStaffs } from "@/lib/actions/staff.actions";
import Link from "next/link";

import { Plus } from "lucide-react";
const DoctorsList = async () => {
  const doctors = await getStaffs({ role: "doctor" });

  return (
    <div className="relative flex flex-col gap-4 py-2">
      <HeaderBox title="All Doctors" subtitle="" />

      <div className="flex items-end justify-end">
        <Button variant="secondary" className="bg-green-500" asChild>
          <Link href={"/list/doctors/add-doctor"}>
            <Plus />
            Add Doctor
          </Link>
        </Button>
      </div>

      <div className="relative flex flex-col space-y-20">
        <DataTable
          role="firstName"
          columns={doctorColumns}
          data={doctors.documents}
        />
      </div>
    </div>
  );
};

export default DoctorsList;
