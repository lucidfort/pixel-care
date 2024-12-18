import { Eye, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import AppointmentModal from "../modals/AppointmentModal";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const AppointmentTableActions = ({ data }: { data?: any }) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" className="h-8 w-8 p-0" asChild>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black flex flex-col gap-3">
        <DropdownMenuItem
          className="cursor-pointer text-base space-x-2"
          onClick={() => router.push(`/list/appointments/${data.$id}`)}
        >
          <Eye /> <span>View</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer text-base space-x-2"
        >
          <AppointmentModal type="schedule" data={data} />
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer text-base text-red-500 space-x-2"
        >
          <AppointmentModal type="cancel" id={data.$id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppointmentTableActions;
