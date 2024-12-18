import ReportForm from "@/components/forms/ReportForm";
import HeaderBox from "@/components/HeaderBox";
import { SearchParamProps } from "@/types";

import { getReport } from "@/lib/actions/appointment.actions";

export default async function EditReportPage({
  params,
  searchParams,
}: SearchParamProps) {
  const param = await params;
  const searchParam = await searchParams;

  const appointmentId = param.appointmentId;
  const reportId = searchParam.reportId;

  const reportData = await getReport({ reportId: reportId as string });

  return (
    <div className="flex flex-col gap-12 overflow-hidden">
      <HeaderBox
        title="Edit Report"
        subtitle="Carefully write your observations and prescriptions"
      />
      <ReportForm
        type="update"
        appointmentId={appointmentId}
        data={reportData}
      />
    </div>
  );
}
