import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-[#F4F7F6] text-ink-800 overflow-x-hidden">
      {/* Dynamic Ambient Background Glow Blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-glow-orb -top-24 -left-20 h-96 w-96 bg-teal-300/30" />
        <div className="ambient-glow-orb top-1/3 -right-24 h-[30rem] w-[30rem] bg-teal-200/20" style={{ animationDelay: "2s" }} />
        <div className="ambient-glow-orb -bottom-32 left-1/3 h-96 w-96 bg-cyan-200/25" style={{ animationDelay: "4s" }} />
      </div>

      <Sidebar />
      
      <div className="relative z-10 md:pl-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-8 max-w-7xl w-full mx-auto">
          <div key={location.pathname} className="animate-fadeUp duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
