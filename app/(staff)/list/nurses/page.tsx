import HeaderBox from "@/components/HeaderBox";
import { DataTable } from "@/components/table/DataTable";

import { nurseColumns } from "@/components/table/columns/nurseColumns";
import { Button } from "@/components/ui/button";
import { getStaffs } from "@/lib/actions/staff.actions";
import { Plus } from "lucide-react";
import Link from "next/link";

const NursesList = async () => {
  const nurses = await getStaffs({ role: "nurse" });

  return (
    <div className="relative flex flex-col gap-4 py-2">
      <HeaderBox title="All Nurses" subtitle="" />

      <div className="flex items-end justify-end">
        <Button variant="secondary" className="bg-green-500" asChild>
          <Link href={"/list/nurses/add-nurse"}>
            <Plus />
            Add Nurse
          </Link>
        </Button>
      </div>

      <div className="relative flex flex-col space-y-20">
        <DataTable
          role="firstName"
          columns={nurseColumns}
          data={nurses.documents}
        />
      </div>
    </div>
  );
};

export default NursesList;
