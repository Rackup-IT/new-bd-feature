import TopBarList from "./topbar_list";

export default function TopBar() {
  return (
    <header className="mb-4 px-1 border border-gray-200 w-full h-10 rounded-lg flex justify-start items-center relative overflow-hidden">
      <TopBarList />
    </header>
  );
}
