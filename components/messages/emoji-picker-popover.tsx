import { type Dispatch, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function EmojiPickerPopOver({
  setMessage,
}: {
  setMessage: Dispatch<React.SetStateAction<string>>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="flex w-fit items-center justify-center">
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger render={<Button className="h-10" variant="outline" />}>
          😁
        </PopoverTrigger>

        <PopoverContent className="w-fit p-0">
          <EmojiPicker
            className="h-[342px]"
            onEmojiSelect={({ emoji }) => {
              setMessage((prev) => prev + emoji);
              setIsOpen(false);
            }}
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </PopoverContent>
      </Popover>
    </main>
  );
}
