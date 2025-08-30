import Link from "next/link";

interface SocialMediaLinkProps {
  title: string;
  href: string;
  children?: React.ReactNode;
}

const SocialMediaLink = ({ title, href, children }: SocialMediaLinkProps) => {
  return (
    <Link title={title} rel="me" href={href}>
      <div className="group flex size-14 rounded-full bg-white hover:bg-linkedin lg:size-11">
        {children}
      </div>
    </Link>
  );
};

export default SocialMediaLink;
