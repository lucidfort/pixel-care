"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Alert, AlertDescription } from "../ui/alert";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import CustomFormField, { FormFieldType } from "./CustomFormField";

import { createStaff, updateStaff } from "@/lib/actions/staff.actions";
import { staffValidation } from "@/lib/validation";

import { MessageCircleWarning } from "lucide-react";

import { BloodTypes, GenderOptions } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { Gender, StaffFormProps } from "@/types";
import Image from "next/image";
import { FileUploader } from "../FileUploader";
import { Button } from "../ui/button";
import { SelectItem } from "../ui/select";

const StaffForm = ({ data, type, table }: StaffFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const validation = staffValidation(type);

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      firstName: data?.user.firstName ?? "",
      lastName: data?.user.lastName ?? "",
      phone: data?.user.phone ?? "",
      email: data?.user.email ?? "",
      password: "",
      confirmPassword: "",
      birthDate: data?.user.birthDate
        ? new Date(data?.user.birthDate)
        : new Date(),
      gender: "male" as Gender,
      bloodType: data?.user.bloodType ?? "",
      address: data?.user.address ?? "",
      department: data?.department ?? "",
      position: data?.position ?? "",
      identificationDocument: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof validation>) => {
    setIsLoading(true);

    try {
      const staffData = {
        firstName: values.firstName!,
        lastName: values.lastName!,
        phone: values.phone!,
        email: values.email!,
        birthDate: new Date(values.birthDate!),
        gender: values.gender! as Gender,
        address: values.address!,
        bloodType: values.bloodType!,
        department: values.department!,
        position: values.position,
        identificationDocument:
          (values.identificationDocument as File[]) || undefined,
        label: table,
      };

      if (type === "create") {
        if (values.password !== values.confirmPassword) {
          setPasswordError(true);
          setIsLoading(false);
          return;
        }

        const newStaff = await createStaff({
          ...staffData,
          password: values.password!,
        });

        if (newStaff || newStaff !== undefined) {
          form.reset();
          router.push(`/list/${table}s`);

          toast({
            title: `${table} created successfully`,
          });
        } else {
          toast({
            title: "An error occurred. Pleas try again.",
          });
        }
      }

      if (type === "update") {
        const response = await updateStaff({
          data: { ...staffData },
          userId: data?.user.$id!,
          id: data?.$id!,
        });

        if (response.success === true) {
          router.push(`/list/${table}s`);

          toast({
            title: "Update Successful",
          });
        } else {
          toast({
            title: response?.message,
          });
        }
      }
    } catch (error) {
      console.error("Form submission error: ", error);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
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
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
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
            fieldType={FormFieldType.INPUT}
            name="address"
            label="Address"
            placeholder="14th Street, New York"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            name="birthDate"
            label="Date of Birth"
          />
        </div>

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

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="department"
            label="Department"
            placeholder="Cardiology"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="position"
            label="Position"
            placeholder="Head Surgeon"
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

        {type === "create" && (
          <>
            <div className="flex flex-col sm:flex-row gap-6">
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
          </>
        )}

        {passwordError && (
          <Alert>
            <MessageCircleWarning className="h-4 w-4" />
            <AlertDescription>
              Passwords do not match. Please re-enter.
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
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="animate-spin"
              />
            </div>
          ) : type === "create" ? (
            <span className="capitalize">Create {table}</span>
          ) : (
            <span className="capitalize">Update {table}</span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default StaffForm;
