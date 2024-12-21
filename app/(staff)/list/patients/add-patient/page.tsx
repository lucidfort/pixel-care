import AuthForm from "@/components/forms/AuthForm";
import PatientForm from "@/components/forms/PatientForm";
import HeaderBox from "@/components/HeaderBox";
import React from "react";

function AddPatientPage() {
  return (
    <div className="w-full flex flex-col gap-7">
      <HeaderBox
        title="Add New Patient"
        subtitle="Fill the form with the correct information"
      />

      <PatientForm type="create" />
    </div>
  );
}

export default AddPatientPage;
