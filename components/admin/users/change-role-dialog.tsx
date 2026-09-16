"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { changeRole } from "@/actions/admin/role";
import type { Role } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChangeRoleDialogProps {
  currentRole: Role;
  fullname: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  userId: string;
}

export default function ChangeRoleDialog({
  currentRole,
  onOpenChange,
  open,
  fullname,
  userId,
}: ChangeRoleDialogProps) {
  const [role, setRole] = useState<Role>(currentRole);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(currentRole);
  }, [currentRole]);

  const handleChangeRole = async (userId: string) => {
    setLoading(true);

    await changeRole(role, userId);

    setLoading(false);

    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>

          <DialogDescription>Update the role for {fullname}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Select
            onValueChange={(value) => setRole(value as Role)}
            value={role.toLowerCase()}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="USER">User</SelectItem>

              <SelectItem value="MODERATOR">Moderator</SelectItem>

              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>

            <Button
              disabled={loading}
              onClick={() => handleChangeRole(userId)}
              type="button"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  Changing <Loader2 className="animate-spin" size={16} />
                </span>
              ) : (
                "Change role"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
