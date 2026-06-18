import { cn } from "@/lib/utils";

export type JerseyType = "general" | "mountain" | "point" | "young";

interface Props {
  type: JerseyType;
  className?: string;
}

const JerseyIcon = ({ type, className }: Props) => {
  if (type === "general") {
    return <JerseySvg className={cn("text-amber-400", className)} />;
  }

  if (type === "point") {
    return <JerseySvg className={cn("text-green-400", className)} />;
  }

  if (type === "young") {
    return <JerseySvg className={cn("text-white", className)} />;
  }

  if (type === "mountain") {
    return <PolkaJerseySvg className={className} />;
  }
};

const JerseySvg = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_48_29)">
        <path
          d="M17 11.9646L17 11.9315C17 11.6747 17.3653 11.6266 17.4317 11.8746L18.0023 14.004C18.1453 14.5375 18.6936 14.8541 19.2271 14.7111L20.6446 14.3313C21.178 14.1884 21.4946 13.64 21.3517 13.1066L19.9306 7.80297C19.6398 6.36413 18.4665 5.24521 17 5.03544C16.8367 5.01208 16.6698 5 16.5 5L15 5L9 5L7.5 5C7.33024 5 7.1633 5.01208 7 5.03544C5.54533 5.24352 4.37921 6.34606 4.07665 7.76804L2.64988 13.0928C2.50694 13.6263 2.82353 14.1746 3.35699 14.3176L4.06673 14.5077L4.77648 14.6979C5.30994 14.8409 5.85828 14.5243 6.00122 13.9908L6.56825 11.8746C6.63472 11.6266 7 11.6747 7 11.9315L7 11.9646L7 20C7 20.5523 7.44771 21 8 21L16 21C16.5523 21 17 20.5523 17 20L17 11.9646Z"
          fill="currentColor"
        />
        <path
          d="M9 4.5C9 3.94772 9.44772 3.5 10 3.5H14C14.5523 3.5 15 3.94772 15 4.5V5.5H9V4.5Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_48_29">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const PolkaJerseySvg = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_52_313)">
        <path
          d="M17 11.9646L17 11.9315C17 11.6747 17.3653 11.6266 17.4317 11.8746L18.0023 14.004C18.1453 14.5375 18.6936 14.8541 19.2271 14.7111L20.6446 14.3313C21.178 14.1884 21.4946 13.64 21.3517 13.1066L19.9306 7.80297C19.6398 6.36413 18.4665 5.24521 17 5.03544C16.8367 5.01208 16.6698 5 16.5 5L15 5L9 5L7.5 5C7.33024 5 7.1633 5.01208 7 5.03544C5.54533 5.24352 4.37921 6.34606 4.07665 7.76804L2.64988 13.0928C2.50694 13.6263 2.82353 14.1746 3.35699 14.3176L4.06673 14.5077L4.77648 14.6979C5.30994 14.8409 5.85828 14.5243 6.00122 13.9908L6.56825 11.8746C6.63472 11.6266 7 11.6747 7 11.9315L7 11.9646L7 20C7 20.5523 7.44771 21 8 21L16 21C16.5523 21 17 20.5523 17 20L17 11.9646Z"
          fill="white"
        />
        <path
          d="M9 4.5C9 3.94772 9.44772 3.5 10 3.5H14C14.5523 3.5 15 3.94772 15 4.5V5.5H9V4.5Z"
          fill="white"
        />
        <circle cx="14.25" cy="7.25" r="1.25" fill="#D61F26" />
        <circle cx="9.75" cy="7.25" r="1.25" fill="#D61F26" />
        <circle cx="6.25" cy="8.25" r="1.25" fill="#D61F26" />
        <circle cx="4.75" cy="11.75" r="1.25" fill="#D61F26" />
        <circle cx="17.75" cy="8.25" r="1.25" fill="#D61F26" />
        <circle cx="19.25" cy="11.75" r="1.25" fill="#D61F26" />
        <circle cx="9.75" cy="11.25" r="1.25" fill="#D61F26" />
        <circle cx="14.25" cy="11.25" r="1.25" fill="#D61F26" />
        <circle cx="9.75" cy="15.25" r="1.25" fill="#D61F26" />
        <circle cx="9.75" cy="19.25" r="1.25" fill="#D61F26" />
        <circle cx="14.25" cy="15.25" r="1.25" fill="#D61F26" />
        <circle cx="14.25" cy="19.25" r="1.25" fill="#D61F26" />
      </g>
      <defs>
        <clipPath id="clip0_52_313">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default JerseyIcon;
