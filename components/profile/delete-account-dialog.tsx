"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteAccount } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DeleteAccountDialog({ userId }: { userId: string }) {
  const [confirmText, setConfirmText] = useState("");
  const [openState, setOpenState] = useState(false);

  const canDelete = confirmText === "DELETE";

  const handleDelete = async (userId: string) => {
    if (!canDelete) {
      return;
    }

    const result = await deleteAccount(userId);

    if (!result?.success && result?.message) {
      return toast.info(result?.message, {
        position: "top-right",
        className: "bg-card! text-warning!",
        closeButton: true,
      });
    }

    setConfirmText("");

    setOpenState(false);

    toast.success("Account deleted successfully!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });
  };

  return (
    <Dialog onOpenChange={setOpenState} open={openState}>
      <DialogTrigger
        render={
          <Button className="w-full py-5" variant="destructive">
            <Trash2 />
            Delete Account
          </Button>
        }
      />

      <DialogContent
        className="max-w-md overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111318] p-0 shadow-2xl shadow-black/60"
        showCloseButton={false}
      >
        <DialogHeader className="border-white/[0.06] border-b px-6 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="text-red-400" size={15} />
            </div>

            <div>
              <DialogTitle className="font-semibold text-[15px] text-white tracking-tight">
                Delete Account
              </DialogTitle>

              <DialogDescription className="sr-only">
                Confirm deleting your account permanently.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FieldGroup className="space-y-5 px-6 py-5">
          <div className="space-y-1.5 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-4">
            <p className="font-semibold text-[14px] text-red-400">
              This action cannot be undone.
            </p>

            <p className="text-[13px] text-white/50 leading-relaxed">
              Your profile and all associated data will be permanently deleted.
              There is no way to recover this account once it has been removed.
            </p>
          </div>

          <Field>
            <Label className="text-[13px] text-white/60">
              Type{" "}
              <span className="font-mono font-semibold text-white/90">
                DELETE
              </span>{" "}
              to continue
            </Label>

            <Input
              autoComplete="off"
              className="h-12 rounded-xl border-white/[0.08] bg-white/[0.04] font-mono text-[14px] text-white placeholder:text-white/20 focus-visible:border-red-500/50 focus-visible:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-destructive"
              id="delete-confirm"
              name="delete-confirm"
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              spellCheck={false}
              value={confirmText}
            />
          </Field>
        </FieldGroup>

        <DialogFooter className="px-6 pt-1 pb-6">
          <DialogClose
            render={
              <Button
                className="rounded-xl px-4 py-2.5 font-medium text-[13px] text-white/60 hover:bg-white/[0.06] hover:text-white"
                variant="ghost"
              >
                Cancel
              </Button>
            }
          />

          <Button
            // className="rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-[13px] text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-30"
            disabled={!canDelete}
            onClick={() => handleDelete(userId)}
            variant="destructive"
          >
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
