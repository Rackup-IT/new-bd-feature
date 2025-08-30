import MostReadItem from "./most_read_item";

const MostReadList = () => {
  return (
    <>
      <div className="mt-12 mb-4 first:mt-0 lg:first:mt-12">
        <h2 className="font-bold font-sans-heading text-2xl leading-7 lg:text-3xl xl:text-4xl">
          Most read this week
        </h2>
      </div>
      <section className="mb-4 mt-12">
        <div
          role="link"
          className="grid gap-4 sm:gap-6 md:grid-flow-col md:grid-rows-[repeat(3,auto)]"
        >
          <MostReadItem />
          <MostReadItem />
          <MostReadItem />
          <MostReadItem />
          <MostReadItem />
          <MostReadItem />
        </div>
      </section>
    </>
  );
};

export default MostReadList;
