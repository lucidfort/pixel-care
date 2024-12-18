import ReportForm from "@/components/forms/ReportForm";
import HeaderBox from "@/components/HeaderBox";
import { SearchParamProps } from "@/types";

export default async function GenerateReportPage({ params }: SearchParamProps) {
  const param = await params;
  const appointmentId = param.appointmentId;

  return (
    <div className="flex flex-col gap-12 overflow-hidden">
      <HeaderBox
        title="Generate Report"
        subtitle="Carefully write your observations and prescriptions"
      />
      <ReportForm type="create" appointmentId={appointmentId} />
    </div>
  );
}
