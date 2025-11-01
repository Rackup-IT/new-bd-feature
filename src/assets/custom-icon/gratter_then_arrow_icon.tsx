import { cn } from "@/utils/utils";

interface GratterThenArrowIconProps {
  className?: string;
}

const GratterThenArrowIcon: React.FC<GratterThenArrowIconProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2.5"
      stroke="currentColor"
      aria-hidden="true"
      data-slot="icon"
      name="Arrow pointing down"
      className={cn("size-3", props.className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      ></path>
    </svg>
  );
};

export default GratterThenArrowIcon;
