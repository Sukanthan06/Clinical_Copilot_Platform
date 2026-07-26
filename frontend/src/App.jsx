import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Upload from "./pages/Upload.jsx";
import Profile from "./pages/Profile.jsx";
import Timeline from "./pages/Timeline.jsx";
import Chat from "./pages/Chat.jsx";
import Trials from "./pages/Trials.jsx";
import Referral from "./pages/Referral.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/trials" element={<Trials />} />
        <Route path="/referral" element={<Referral />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
