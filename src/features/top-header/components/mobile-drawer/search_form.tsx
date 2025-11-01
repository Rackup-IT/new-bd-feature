const SearchForm = ({ lang }: { lang?: string }) => {
  return (
    <div className="mx-1">
      <form
        action={`/${lang || "en"}/search`}
        acceptCharset="UTF-8"
        method="get"
        className="relative mx-2 my-3 flex basis-1/3 flex-row content-around lg:my-4"
      >
        <input
          type="text"
          name="q"
          className="box-border w-full rounded-full border border-solid border-gray-300 py-3 pl-5 pr-10 font-sans text-xs text-black placeholder:text-gray-600 focus:placeholder:text-gray-200"
          placeholder="Search analysis, research, academics…"
        />
        <div className="absolute right-0 m-2">
          <button
            type="submit"
            value="Search"
            className="mt-px cursor-pointer border-none bg-transparent px-1 py-0 text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-search size-6"
              name="Search"
              role="search"
            >
              <path d="m21 21-4.34-4.34"></path>
              <circle cx="11" cy="11" r="8"></circle>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
