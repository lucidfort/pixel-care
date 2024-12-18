import HeaderBox from "@/components/HeaderBox";
import { internColumns } from "@/components/table/columns/internColumns";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { getStaffs } from "@/lib/actions/staff.actions";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function InternListPage() {
  const interns = await getStaffs({ role: "intern" });

  if (!interns) return;

  return (
    <div className="relative flex flex-col gap-4 py-2">
      <HeaderBox
        title="All Interns"
        subtitle="List of every intern the hospital has had"
      />

      <div className="flex items-end justify-end">
        <Button variant="secondary" className="bg-green-500" asChild>
          <Link href={"/list/interns/add-intern"}>
            <Plus />
            Add Intern
          </Link>
        </Button>
      </div>
      <div className="relative flex flex-col space-y-20">
        <DataTable
          role="firstName"
          columns={internColumns}
          data={interns.documents}
        />
      </div>
    </div>
  );
}
