import Link from "next/link";

import { cn } from "../../../../utils/utils";

interface SectionLinkProps {
  href: string;
  className?: string;
  role?: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const SectionLink: React.FC<SectionLinkProps> = ({
  href,
  className,
  role,
  children,
  isActive,
  onClick,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "my-1.5 border-l-8 border-black py-0.5 pl-2",
        isActive ? "border-black" : "border-white",
        className
      )}
      role={role}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default SectionLink;
