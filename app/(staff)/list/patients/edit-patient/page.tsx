import PatientForm from "@/components/forms/PatientForm";
import HeaderBox from "@/components/HeaderBox";
import { getPatient } from "@/lib/actions/patient.actions";
import { SearchParamProps } from "@/types";

async function EditPatientPage({ searchParams }: SearchParamProps) {
  const searchParam = await searchParams;
  const patientId = searchParam.patientId;

  const patient = await getPatient(patientId as string);

  const primaryPhysicianId = patient?.primaryPhysician?.$id;

  return (
    <div className="w-full flex flex-col gap-7">
      <HeaderBox
        title="Edit Patient"
        subtitle="Fill the form with the correct information"
      />
      <PatientForm
        type="update"
        data={patient}
        primaryPhysicianId={primaryPhysicianId}
      />
    </div>
  );
}

export default EditPatientPage;
