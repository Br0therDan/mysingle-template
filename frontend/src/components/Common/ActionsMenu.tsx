import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FiEdit, FiTrash } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

import type { ItemPublic, RolePublic, UserPublic } from "../../client";
// (Assuming these are already refactored to ShadCN UI)
import EditItem from "../Items/EditItem";
import EditRole from "../Admin/EditRole";
import DeleteAlert from "./DeleteAlert"; // (Refactored version of "Delete")
import EditUser from "../Admin/EditUser";

interface ActionsMenuProps {
  type: "User" | "Item" | "Role";
  value: ItemPublic | UserPublic | RolePublic;
  disabled?: boolean;
}

export default function ActionsMenu({
  type,
  value,
  disabled,
}: ActionsMenuProps) {
  // For "Edit"
  const [editOpen, setEditOpen] = useState(false);

  // For "Delete"
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            disabled={disabled}
            className="p-2"
            aria-label="Actions"
          >
            <BsThreeDotsVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <FiEdit className="mr-2 h-4 w-4" />
            Edit {type}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-red-600"
          >
            <FiTrash className="mr-2 h-4 w-4" />
            Delete {type}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {type === "User" ? (
        <EditUser
          user={value as UserPublic}
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
        />
      ) : type === "Item" ? (
        <EditItem
          item={value as ItemPublic}
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
        />
      ) : type === "Role" ? (
        <EditRole
          role={value as RolePublic}
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
        />
      ): null }

      <DeleteAlert
        type={type}
        id={value.id}
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
