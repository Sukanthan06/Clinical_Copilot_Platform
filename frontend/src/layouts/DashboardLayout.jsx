import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-mist-100">
      <Sidebar />
      <div className="md:pl-64">
        <Navbar />
        <main className="px-6 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
