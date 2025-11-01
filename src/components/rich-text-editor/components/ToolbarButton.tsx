import { ReactNode } from "react";
import { cn } from "../../../utils/utils";

interface ToolbarButtonProps {
  title: string;
  icon: ReactNode;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

const ToolbarButton = ({
  title,
  icon,
  onClick,
  isActive = false,
  className = "",
}: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "p-2 rounded-md",
        isActive ? "bg-gray-300" : "hover:bg-gray-200",
        className
      )}
    >
      {icon}
    </button>
  );
};

export default ToolbarButton;
