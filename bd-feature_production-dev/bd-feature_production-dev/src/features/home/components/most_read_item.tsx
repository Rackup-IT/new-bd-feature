import Image from "next/image";
import Link from "next/link";

const MostReadItem = () => {
  return (
    <div className="flex justify-between gap-2 border-t border-gray-200 pt-4">
      <div className="break-normal font-serif text-2xl italic">1.</div>
      <Link
        href={""}
        className="group grid h-fit w-full grid-cols-3 gap-x-4 gap-y-2 sm:grid-cols-6 2xl:gap-x-8 most-read-block"
      >
        <section className="col-span-2 gap-2 sm:col-span-4">
          <span className="group-hover:text-indigo-600 group-hover:underline">
            <h5 className="font-bold font-sans-heading text-base leading-5 lg:text-lg lg:leading-6">
              <span>
                Even a day off alcohol makes a difference – our timeline maps
                the health benefits when you stop drinking
              </span>
            </h5>
          </span>
          <p className="line-clamp-3 text-3xs text-gray-600">
            Nicole Lee, Curtin University and Katinka van de Ven, UNSW Sydney
          </p>
        </section>
        <div className="relative col-span-1 hidden aspect-video sm:col-span-2 2xl:block">
          <Image
            src={
              "https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_hybrid&w=740"
            }
            alt=""
            fill
            sizes="(min-width: 2560px) 320px, (min-width: 1466px) 184px, (min-width: 1280px) 160px, (min-width: 1024px) 128px, (min-width: 768px) 192px, 160px"
            className="object-cover"
          />
        </div>
        <div className="relative col-span-1 aspect-square sm:col-span-2 2xl:hidden">
          <Image
            src={
              "https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_hybrid&w=740"
            }
            alt=""
            fill
            sizes="(min-width: 2560px) 320px, (min-width: 1466px) 184px, (min-width: 1280px) 160px, (min-width: 1024px) 128px, (min-width: 768px) 192px, 160px"
            className="object-cover"
          />
        </div>
      </Link>
    </div>
  );
};

export default MostReadItem;
