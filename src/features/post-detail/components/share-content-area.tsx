export default function ShareContentArea() {
  return (
    <div className="clear-both flex-row sm:flex-col flex items-start gap-0 sm:gap-2 sm:items-left h-10 mb-2 w-full">
      <div className="flex grow relative mr-2 h-10 bg-gray-50 border-none rounded-full pr-11 max-[300px]:hidden sm:hidden">
        <div className="bg-transparent border border-solid !border-transparent cursor-text !rounded-l-full w-0 grow text-xs !overflow-hidden truncate focus:text-clip text-black py-2.5 !pl-3 !pr-0 z-0">
          https://theconversation.com/historic-ruling-finds-climate-change-imperils-all-forms-of-life-and-puts-laggard-nations-on-notice-261848
        </div>
        {/* When click on button make the opacity of button to 0 */}
        <button className="bg-black border-none cursor-pointer rounded-full text-white absolute right-0 top-0 w-10 h-10 p-3 z-10 ease-in-out transition-all duration-300 opacity-100">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.0"
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
            ></path>
          </svg>
        </button>
        {/* To visible this copioed widget you need to add these classes when click on the button  */}
        {/* !w-full !opacity-100 z-20 !text-white */}
        <div className="absolute top-0 bottom-0 right-0 bg-green-600 rounded-full !flex flex-row items-center text-center text-transparent py-2 leading-none w-10 text-xs transition-all duration-300 ease-in-out opacity-0 ">
          <span className="grow"></span>
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.0"
            stroke="currentColor"
            className="size-4 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            ></path>
          </svg>
          <span className="leading-none text-xs text-left grow">
            Link copied
          </span>
        </div>
      </div>

      <div className="sm:hidden">
        <button className="bg-black border-none cursor-pointer text-white !flex flex-row shrink-0 items-center rounded-full text-center py-3 px-3 max-[300px]:grow">
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.0"
            stroke="currentColor"
            className="flex-none size-4 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
            ></path>
          </svg>
          <span className="leading-none text-xs font-bold mx-1 grow text-left mt-1">
            Share article
          </span>
        </button>
      </div>
    </div>
  );
}
