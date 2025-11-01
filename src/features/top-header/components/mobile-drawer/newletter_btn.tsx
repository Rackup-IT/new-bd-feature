import Link from "next/link";

const NewsLetterBtn = () => {
  return (
    <div className="m-4 flex">
      <Link
        href="/ca/newsletters/canada-7?utm_campaign=System&utm_content=newsletter&utm_medium=TopBar&utm_source=theconversation.com"
        className="box-border inline-block max-w-40 grow items-center rounded-full bg-black p-2 text-center text-xs font-bold text-white visited:text-white hover:bg-black hover:text-white sm:hidden lg:px-5 lg:py-2"
      >
        Newsletters
      </Link>
    </div>
  );
};

export default NewsLetterBtn;
