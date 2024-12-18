"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, Trash } from "lucide-react";
import { Button } from "../ui/button";

import { useToast } from "@/hooks/use-toast";
import { deletePatient } from "@/lib/actions/patient.actions";
import { deleteStaff } from "@/lib/actions/staff.actions";
import { DeleteUserModalProps } from "@/types";

const DeleteUserModal = ({ table, id }: DeleteUserModalProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();

  const deleteActionMap = {
    patient: (id: string) => deletePatient(id),
    doctor: (id: string) => deleteStaff({ role: "doctor", id }),
    nurse: (id: string) => deleteStaff({ role: "nurse", id }),
    intern: (id: string) => deleteStaff({ role: "intern", id }),
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const deletedItem = await deleteActionMap[table](id as string);

      if (deletedItem) {
        toast({
          description: (
            <>
              <span className="capitalize">{table}</span> has been deleted
            </>
          ),
        });

        setIsDeleting(false);
        setOpen(false);
      }
    } catch (error: any) {
      toast({
        description: error.message,
      });

      console.log(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center ml-2 gap-2 text-base text-red-500">
        <Trash size={17} /> Delete
      </DialogTrigger>

      <DialogContent
        aria-describedby={table ? table : "form-modal"}
        className="shad-dialog max-w-3xl flex flex-col items-center gap-6 max-h-[45rem] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="capitalize text-center">
            Delete {table}
          </DialogTitle>
        </DialogHeader>

        <form action={handleDelete} className="p-4 flex-center flex-col">
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <Button
            type="submit"
            variant="destructive"
            className="mt-4 p-2 bg-red-500 w-52"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader className="animate-spin" /> Deleting
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;
