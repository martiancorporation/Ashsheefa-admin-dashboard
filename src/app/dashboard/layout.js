import Sidebar from "../components/common/Sidebar";
import EmergencySosAlert from "../components/common/EmergencySosAlert";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-full scroll-smooth bg-[#F7F7F7]">
      {/* SOS popup lives at the layout level so it appears on every page/drawer,
          letting the admin dismiss it (and silence the alarm) from anywhere. */}
      <EmergencySosAlert />
      <Sidebar />
      <main className="flex-1 min-w-0 h-screen flex flex-col bg-[#F7F7F7] py-3 pr-3">
        <div className="w-full h-full flex bg-[#FFFFFF] border border-[#DCDCDC] rounded-[10px] flex-col gap-y-3 py-4 px-4 sm:px-5 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
