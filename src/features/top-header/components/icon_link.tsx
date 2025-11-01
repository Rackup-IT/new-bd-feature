import { cn } from "@/utils/utils";
import Link from "next/link";

interface IconLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

const IconLink: React.FC<IconLinkProps> = (props) => {
  return (
    <Link
      href={props.href}
      className={cn("inline-flex items-center px-3 h-full", props.className)}
    >
      {props.children}
    </Link>
  );
};

export default IconLink;
