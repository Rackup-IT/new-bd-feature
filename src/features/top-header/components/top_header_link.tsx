import { cn } from "@/utils/utils";
import Link from "next/link";

interface TopHeaderLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
  href: string;
  className?: string;
}

const TopheaderLink = ({
  href,
  label,
  className,
  ...rest
}: TopHeaderLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center  text-xs transition border-r border-gray-300 text-black hover:bg-gray-200 py-3.5 px-2.5",
        className
      )}
      {...rest}
    >
      {label}
    </Link>
  );
};

export default TopheaderLink;
