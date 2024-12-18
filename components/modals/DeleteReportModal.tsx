"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteReport } from "@/lib/actions/appointment.actions";
import { cn } from "@/lib/utils";

const DeleteReportModal = ({ id, role }: { id: string; role: string }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      if (role !== "admin") {
        toast({
          title: "Only administrators can delete reports",
        });
        return;
      }

      const deletedReport = await deleteReport(id);

      if (deletedReport)
        toast({
          title: "Report has been deleted",
        });
    } catch (error) {
      toast({
        title: "Error deleting report. Please try again",
      });
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={cn("text-red-500", {
            hidden: role !== "admin",
          })}
        >
          Delete Report
        </Button>
      </DialogTrigger>

      <DialogContent
        aria-describedby="delete-report"
        className="shad-dialog sm:max-w-xl"
      >
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize text-center">
            Delete Report
          </DialogTitle>
        </DialogHeader>

        <p className="text-16-regular">
          Are you sure you want to delete this report? This action cannot be
          undone
        </p>

        <DialogFooter className="flex-end flex-row gap-2">
          <Button variant={"outline"} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            className="bg-red-500"
            onClick={() => handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteReportModal;
