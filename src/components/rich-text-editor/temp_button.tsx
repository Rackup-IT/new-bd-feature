import { cn } from "../../utils/utils";

interface TempButtonProps {
  onClick: () => void;
  name: string;
  className?: string;
  isActive?: boolean;
}

const TempButton: React.FC<TempButtonProps> = (props) => {
  return (
    <button
      type="button"
      className={cn(
        "bg-gray-200 rounded-2xl px-3",
        props.isActive && "bg-amber-400",
        props.className
      )}
      onClick={props.onClick}
    >
      {props.name}
    </button>
  );
};

export default TempButton;
