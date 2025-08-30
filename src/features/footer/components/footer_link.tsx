import Link from "next/link";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink = ({ href, children }: FooterLinkProps) => {
  return (
    <Link href={href} className="mb-2 hover:underline underline-offset-8">
      {children}
    </Link>
  );
};

export default FooterLink;
