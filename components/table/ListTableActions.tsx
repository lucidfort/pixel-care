import { useRouter } from "next/navigation";

import { Edit, Eye, MoreHorizontal } from "lucide-react";
import DeleteUserModal from "../modals/DeleteUserModal";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ListTableActions = ({
  table,
  id,
}: {
  table: "patient" | "doctor" | "nurse" | "intern";
  id: string;
}) => {
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
          onClick={() => router.push(`/list/${table}s/${id}`)}
        >
          <Eye /> <span>View</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-base flex gap-2"
          onClick={() =>
            router.push(`/list/${table}s/edit-${table}?${table}Id=${id}`)
          }
        >
          <Edit /> Edit
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <DeleteUserModal table={table} id={id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListTableActions;
