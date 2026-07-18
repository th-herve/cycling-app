"use client";
import { FaCheck, FaClone } from "react-icons/fa6";
import { Badge } from "../ui/badge";
import { useState } from "react";

interface Props {
  content: string;
}

const ClipboardCopy = ({ content }: Props) => {
  const [ok, setOk] = useState(false);

  const onClick = () => {
    navigator.clipboard.writeText(content).then(() => setOk(true));
  };

  return (
    <Badge className="gap-4 text-xl" variant="secondary">
      <div className="truncate max-w-60 md:max-w-full">{content}</div>
      <div className="border-muted-foreground h-5 border-l" />
      <div
        className="text-muted-foreground cursor-pointer hover:text-white"
        onClick={onClick}
      >
        {ok ? <FaCheck className="size-4" /> : <FaClone className="size-4" />}
      </div>
    </Badge>
  );
};

export default ClipboardCopy;
