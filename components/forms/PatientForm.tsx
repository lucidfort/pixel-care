"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import CustomFormField, { FormFieldType } from "./CustomFormField";

import { patientValidation } from "@/lib/validation";

import { BloodTypes, GenderOptions } from "@/constants";
import { useDoctors } from "@/context/DoctorsContext";
import { useToast } from "@/hooks/use-toast";
import { createPatient, updatePatient } from "@/lib/actions/patient.actions";
import { Gender, PatientFormProps } from "@/types";
import { Loader2 } from "lucide-react";
import { FileUploader } from "../FileUploader";
import { Button } from "../ui/button";
import { SelectItem } from "../ui/select";

const PatientForm = ({ data, type, primaryPhysicianId }: PatientFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { doctors } = useDoctors();

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof patientValidation>>({
    resolver: zodResolver(patientValidation),
    defaultValues: {
      firstName: data?.firstName ?? "",
      lastName: data?.lastName ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      birthDate: data?.birthDate
        ? new Date(data.birthDate)
        : new Date(Date.now()),
      gender: data?.gender ?? ("male" as Gender),
      address: data?.address ?? "",
      occupation: data?.occupation ?? "",
      emergencyContactName: data?.emergencyContactName ?? "",
      emergencyContactNumber: data?.emergencyContactNumber ?? "",
      primaryPhysician: primaryPhysicianId ?? "",
      bloodType: data?.bloodType ?? "",
      identificationNumber: data?.identificationNumber ?? "",
      allergies: data?.allergies ?? "",
      currentMedication: data?.currentMedication ?? "",
      familyMedicalHistory: data?.familyMedicalHistory ?? "",
      pastMedicalHistory: data?.pastMedicalHistory ?? "",
      identificationDocument: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof patientValidation>) => {
    setIsLoading(true);

    try {
      const patientData = {
        firstName: values.firstName!,
        lastName: values.lastName!,
        email: values.email,
        phone: values.phone!,
        birthDate: new Date(values.birthDate!),
        gender: values.gender! as Gender,
        address: values.address!,
        occupation: values.occupation!,
        emergencyContactName: values.emergencyContactName!,
        emergencyContactNumber: values.emergencyContactNumber!,
        identificationNumber: values.identificationNumber!,
        identificationDocument:
          (values.identificationDocument as File[]) || undefined,
        bloodType: values.bloodType!,
        primaryPhysician: values.primaryPhysician!,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
      };

      if (type === "create") {
        const newUser = await createPatient(patientData);

        if (newUser) {
          form.reset();
          router.back();

          toast({
            description: "Registration successful",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Registration failed",
            description: "An error occurred. Please try again",
          });
        }
      }

      if (type === "update" && data) {
        const updatedPatient = await updatePatient({
          dataToUpdate: patientData,
          patientId: data.$id,
        });

        if (updatedPatient) {
          form.reset();
          router.back();

          toast({
            description: "Update successful",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Update failed",
            description: "An error occurred. Please try again",
          });
        }
      }
    } catch (error: any) {
      console.error("Form submission error: ", error);

      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred. Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <section>
          <h2 className="sub-header my-7">Personal Information</h2>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="firstName"
            label="First Name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="lastName"
            label="Last Name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email!"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="phone"
            label="Phone Number"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            name="birthDate"
            label="Date of Birth"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="address"
            label="Address"
            placeholder="14th Street, New York"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-4"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="bloodType"
            label="Blood Type"
          >
            {BloodTypes.map((type, i) => (
              <SelectItem key={i} value={type} className="shad-select-trigger">
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{type}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's name"
            className="w-48"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            className="w-48"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="primaryPhysician"
            label="Primary Physician"
            placeholder={"Select a doctor"}
          >
            {doctors
              ? doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.name}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <Image
                        src={doctor.img || "/assets/icons/noAvatar.png"}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full border border-dark-500"
                      />
                      <p>{doctor.name}</p>
                    </div>
                  </SelectItem>
                ))
              : "Loading..."}
          </CustomFormField>
        </div>

        <section>
          <h2 className="sub-header my-7">Medical Information</h2>
        </section>

        <div className="flex flex-col xl:flex-row gap-6">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin, Pollen"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="Ibuprofen 200mg, Paracetamol 500mg"
          />
        </div>

        {/* Family & Past Medications */}
        <div className="flex flex-col xl:flex-row gap-6">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Mother had brain cancer, Father had heart disease"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Appendectomy, Tonsillectomy"
          />
        </div>

        {/* IDENTIFICATION */}
        <div className="flex flex-wrap gap-4">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />

          {type === "create" && (
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="identificationDocument"
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader
                    mediaUrl={data?.identificationDocumentUrl}
                    fieldChange={field.onChange}
                  />
                </FormControl>
              )}
            />
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="shad-primary-btn w-full my-5"
        >
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : type === "create" ? (
            "Create Patient"
          ) : (
            "Update Patient"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PatientForm;
