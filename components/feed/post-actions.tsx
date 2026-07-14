"use client";

import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deletePost } from "@/actions/posts";
import type { Post } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditPostDialog } from "./edit-post-dialog";

export function PostActions({ post }: { post: Post }) {
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async (postId: string) => {
    await deletePost(postId);

    toast.success("Post deleted successfully!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });
  };

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

            <DropdownMenuItem
              onClick={() => handleDelete(post.id)}
              variant="destructive"
            >
              <Trash2 size={20} />
              Delete Post
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="hidden">
        <EditPostDialog
          open={editOpen}
          post={post}
          setOpenState={setEditOpen}
        />
      </div>
    </>
  );
}
