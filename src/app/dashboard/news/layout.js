export default function newsLayout({ children }) {
  return (
    <main className="w-full h-full overflow-y-hidden flex flex-col ">
      <div className="w-full h-full flex bg-[#FBFBFB] flex-col gap-y-3 py-2 px-2 sm:px-2 overflow-y-scroll overscroll-y-contain eme-scroll">
        {children}
      </div>
    </main>
  );
}
