import Sidebar from "../components/common/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-full scroll-smooth bg-[#F7F7F7]">
      <Sidebar />
      <main className="w-full h-screen flex flex-col bg-[#F7F7F7] py-3 pr-3 ">
        <div className="w-full h-full  flex bg-[#FFFFFF] border border-[#DCDCDC] rounded-[10px] flex-col gap-y-3 py-4 px-4 sm:px-5 ">
          {children}
        </div>
      </main>
    </div>
  );
}
