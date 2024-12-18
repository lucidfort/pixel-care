"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Alert, AlertDescription } from "../ui/alert";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { SelectItem } from "../ui/select";

import { FileUploader } from "../FileUploader";

import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";
import { authFormValidation } from "@/lib/validation";

import { Loader, MessageCircleWarning } from "lucide-react";

import { AuthFormDefaultValues, GenderOptions } from "@/constants";
import { useDoctors } from "@/context/DoctorsContext";
import { useToast } from "@/hooks/use-toast";
import { Gender } from "@/types";
import { Button } from "../ui/button";
import CustomFormField, { FormFieldType } from "./CustomFormField";

export default function AuthForm({ type }: { type: "sign-in" | "sign-up" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const { doctors } = useDoctors();
  const { toast } = useToast();

  const PatientFormValidation = authFormValidation(type);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues:
      type === "sign-up"
        ? {
            ...AuthFormDefaultValues,
          }
        : {
            email: "",
            password: "",
          },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (type === "sign-in") {
        const userDetails = {
          email: values.email,
          password: values.password,
        };

        const response = await signIn(userDetails);

        if (!response.success) {
          setErrorMessage(response.error);
        }

        const loggedInUser = await getLoggedInUser();

        if (loggedInUser.role === "patient") {
          router.push(`/patient/${loggedInUser.patientId}/overview`);
        } else if (loggedInUser.role === "admin") {
          router.push("/admin/overview");
        } else {
          router.push(`/${loggedInUser.role}/${loggedInUser.$id}/overview`);
        }
      }

      if (type === "sign-up") {
        if (values.password !== values.confirmPassword) {
          setErrorMessage("Passwords do not match");
          setIsLoading(false);
          return;
        }

        const patientData = {
          firstName: values.firstName!,
          lastName: values.lastName!,
          email: values.email,
          password: values.password,
          phone: values.phone!,
          birthDate: new Date(values.birthDate!),
          gender: values.gender! as Gender,
          address: values.address!,
          occupation: values.occupation!,
          emergencyContactName: values.emergencyContactName!,
          emergencyContactNumber: values.emergencyContactNumber!,
          primaryPhysician: values.primaryPhysician!,
          allergies: values.allergies!,
          currentMedication: values.currentMedication!,
          familyMedicalHistory: values.familyMedicalHistory!,
          pastMedicalHistory: values.pastMedicalHistory!,
          identificationNumber: values.identificationNumber!,
          privacyConsent: values.privacyConsent!,
          treatmentConsent: values.treatmentConsent!,
          disclosureConsent: values.disclosureConsent!,
          bloodType: values.bloodType!,
        };

        const newPatient = await signUp(patientData);

        if (newPatient) router.push(`/patient/${newPatient.$id}/overview`);
      }
    } catch (error) {
      toast({
        title: "ERROR",
        description: "Something went wrong. Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex-1">
        <section className="space-y-3">
          <h1 className="header">
            {type === "sign-in" ? "Welcome back" : "Let's Get Started"}{" "}
          </h1>
          <p className="text-dark-700">
            {type === "sign-in"
              ? "Please enter your details"
              : "Let us know more about you"}
          </p>
        </section>

        {type === "sign-in" && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="email"
              label="Email"
              iconSrc="/assets/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PASSWORD}
              name="password"
              label="Password"
            />
          </>
        )}

        {type === "sign-up" && (
          <>
            <section>
              <h2 className="sub-header mb-7">Personal Information</h2>
            </section>

            {/* NAME */}
            <div className="flex flex-col xl:flex-row gap-6">
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
            </div>

            {/* EMAIL & PHONE */}
            <div className="flex flex-col xl:flex-row gap-6">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="email"
                label="Email"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />

              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PHONE_INPUT}
                name="phone"
                label="Phone Number"
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col xl:flex-row gap-6">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PASSWORD}
                name="password"
                label="Password"
              />

              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PASSWORD}
                name="confirmPassword"
                label="Confirm Password"
              />
            </div>

            {/* BIRTHDATE & GENDER */}
            <div className="flex flex-col xl:flex-row gap-6">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.DATE_PICKER}
                name="birthDate"
                label="Date of Birth"
                maxDate={new Date()}
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SKELETON}
                name="gender"
                label="Gender"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-11 gap-6 xl:justify-between"
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
            </div>

            {/* Address & Occupation */}
            <div className="flex flex-col xl:flex-row gap-6">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="address"
                label="Address"
                placeholder="14th Street, New York"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="occupation"
                label="Occupation"
                placeholder="Software Engineer"
              />
            </div>

            {/* Emergency Contact Info */}
            <div className="flex flex-col xl:flex-row gap-6">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="emergencyContactName"
                label="Emergency contact name"
                placeholder="Guardian's name"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PHONE_INPUT}
                name="emergencyContactNumber"
                label="Emergency Contact Number"
                placeholder="(555) 123-4567"
              />
            </div>

            <section>
              <h2 className="sub-header my-7">Medical Information</h2>
            </section>

            {/* Primary Care Physician */}
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Primary Physician"
              placeholder="Select a doctor"
            >
              {doctors
                ? doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
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

            {/* Allergy & Current Medications */}
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

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="identificationNumber"
              label="Identification Number"
              placeholder="123456789"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="image"
              label="Your image"
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader mediaUrl="" fieldChange={field.onChange} />
                </FormControl>
              )}
            />

            <section>
              <h2 className="sub-header mb-7">Consent and Privacy</h2>
            </section>

            {/* Terms & Conditions */}
            <div className="flex flex-col gap-5">
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="treatmentConsent"
                label="I consent to treatment"
              />
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="disclosureConsent"
                label="I consent to disclosure of information"
              />
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="privacyConsent"
                label="I consent to privacy policy"
              />
            </div>
          </>
        )}

        {errorMessage && (
          <Alert>
            <MessageCircleWarning className="h-4 w-4" />
            <AlertDescription className="text-red-500">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="shad-primary-btn w-full"
        >
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Loader className="animate-spin" />
            </div>
          ) : type === "sign-in" ? (
            "Sign in"
          ) : (
            "Sign up"
          )}
        </Button>

        <div className="flex-center gap-2">
          <p className="text-[13px] font-extralight">
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="text-[16px] text-blue-400"
          >
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </div>
      </form>
    </Form>
  );
}
