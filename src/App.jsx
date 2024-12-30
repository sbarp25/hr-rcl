import { Layout } from "./components/Layout/Layout";

import Dashboard from "./pages/Dashboard/page.jsx";
import { Routes, Route } from "react-router-dom";
import Notices from "./pages/Notices/page.jsx";
import Login from "./pages/Login/page.jsx";
import Ekye from "./pages/Ekye/page.jsx";
import LeaveRequest from "./pages/Leave/LeaveRequest/page.jsx";
import Attendance from "./pages/Attendance/Attendance/page.jsx";
import AttendanceRequest from "./pages/Attendance/Request/page.jsx";
import Employees from "./pages/Employees/page.jsx";
import Department from "./pages/MasterData/Deparement/page.jsx";
import Position from "./pages/MasterData/Position/page.jsx";
import Menu from "./pages/MasterData/Menu/page.jsx";
import Roles from "./pages/MasterData/Roles/page.jsx";
import HandBook from "./pages/Handbook/page.jsx";
import LeaveStatus from "./pages/Leave/LeaveStatus/page.jsx";
import Settings from "./pages/Setting/page.jsx";
function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Attendance" element={<Attendance />} />
          <Route path="/Attendance/Request" element={<AttendanceRequest />} />

          <Route path="/Employees" element={<Employees />} />

          <Route path="master-data/Department" element={<Department />} />
          <Route path="master-data/Position" element={<Position />} />
          <Route path="master-data/Menu" element={<Menu />} />
          <Route path="master-data/Roles" element={<Roles />} />

          <Route path="/HandBook" element={<HandBook />} />
          <Route path="/Notice" element={<Notices />} />

          <Route path="/Leave/status" element={<LeaveStatus />} />
          <Route path="/Leave/Request" element={<LeaveRequest />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
