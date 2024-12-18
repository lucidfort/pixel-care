"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { MessageSquareDotIcon } from "lucide-react";
import { SelectItem } from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageValidation } from "@/lib/validation";
import CustomFormField, { FormFieldType } from "../forms/CustomFormField";
import Image from "next/image";

type RecipientType = "Everyone" | "Doctors" | "Patients";

interface MessageProps {
  title: string;
  recipients: RecipientType;
  message: string;
}

const MessageModal = ({
  path,
  className,
}: {
  children?: React.ReactNode;
  path: "admin" | "patient";
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof MessageValidation>>({
    resolver: zodResolver(MessageValidation),
    defaultValues: {
      title: "",
      recipient: "Everyone",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof MessageValidation>) {
    setIsLoading(true);

    try {
      console.log(values);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("", className)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="capitalize">
            {path === "admin" && <MessageSquareDotIcon />}
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-describedby="appointment-form"
          className="shad-dialog sm:max-w-md"
        >
          <DialogHeader className="mb-4 space-y-3">
            <DialogTitle className="capitalize">Reach out</DialogTitle>
            <DialogDescription>
              Quickly send out a generalized message to all patients in a minute
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex-1"
            >
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="title"
                label="Title"
              />

              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                name="recipient"
                label="Recipients"
              >
                {["Everyone", "Doctors", "Patients"].map((recipient, index) => (
                  <SelectItem key={index} value={recipient}>
                    <div className="flex cursor-pointer items-center gap-2">
                      {recipient}
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>

              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="message"
                label="Message"
              />

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="shad-primary-btn"
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
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageModal;

//  <div>
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 name="title"
//                 value={messageFormData.title}
//                 onChange={(e) =>
//                   setMessageFormData({
//                     title: e.target.value,
//                     recipients: messageFormData.recipients,
//                     message: messageFormData.message,
//                   })
//                 }
//               />
//             </div>

//             <div>
//               <Label htmlFor="recipient">Recipients</Label>
//               <Select
//                 onValueChange={(defaultValue: RecipientType) =>
//                   setMessageFormData({
//                     title: messageFormData.title,
//                     recipients: form.,
//                     message: messageFormData.message,
//                   })
//                 }
//                 defaultValue={messageFormData.recipients}
//               >
//                 <SelectTrigger className="shad-select-trigger">
//                   <SelectValue />
//                 </SelectTrigger>

//                 <SelectContent className="shad-select-content">
//                   {["Everyone", "Doctors", "Patients"].map(
//                     (recipient, index) => (
//                       <SelectItem key={index} value={recipient}>
//                         <div className="flex cursor-pointer items-center gap-2">
//                           {recipient}
//                         </div>
//                       </SelectItem>
//                     )
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div>
//               <Label htmlFor="chat">Message</Label>
//               <Textarea
//                 cols={12}
//                 name="message"
//                 value={messageFormData.message}
//                 onChange={(e) =>
//                   setMessageFormData({
//                     title: messageFormData.title,
//                     recipients: messageFormData.recipients,
//                     message: e.target.value,
//                   })
//                 }
//               />
//             </div>
