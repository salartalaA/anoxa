"use client";

import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditPostDialog } from "./edit-post-dialog";

export function PostActions() {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost">
              <Ellipsis size={20} />
            </Button>
          }
        />

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              closeOnClick={false}
              onClick={() => setEditOpen(true)}
            >
              <Pencil size={20} />
              <span className="mr-auto">Edit Post</span>
            </DropdownMenuItem>

            <DropdownMenuItem variant="destructive">
              <Trash2 size={20} />
              Delete Post
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="hidden">
        <EditPostDialog onOpenChange={setEditOpen} open={editOpen} />
      </div>
    </>
  );
}
