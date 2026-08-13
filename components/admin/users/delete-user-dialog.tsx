"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteUser } from "@/actions/admin/role";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface DeleteUserDialogProps {
  fullname: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  userId: string;
}

export default function DeleteUserDialog({
  open,
  onOpenChange,
  fullname,
  userId,
}: DeleteUserDialogProps) {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const canDelete = confirmation === "DELETE";

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmation("");
    }

    onOpenChange(open);
  };

  const handleDelete = async (userId: string) => {
    if (!canDelete) {
      return;
    }

    setLoading(true);

    await deleteUser(userId);

    setConfirmation("");

    setLoading(false);
    onOpenChange(false);
  };

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle>Permanently delete user</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently remove{" "}
            <span className="font-medium text-foreground">{fullname}</span> and
            is irreversible. All their posts and comments will remain but be
            disassociated.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-1.5">
          <p className="text-muted-foreground text-sm">
            Type{" "}
            <span className="font-mono font-semibold text-foreground">
              DELETE
            </span>{" "}
            to confirm.
          </p>

          <Input
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="DELETE"
            value={confirmation}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={!canDelete || loading}
            onClick={() => handleDelete(userId)}
          >
            {loading ? (
              <span className="flex items-center gap-1">
                Deleting <Loader2 className="animate-spin" size={16} />
              </span>
            ) : (
              "Delete user"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
