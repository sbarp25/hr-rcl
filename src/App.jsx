import { Layout } from "./components/Layout/Layout";

import Dashboard from "./pages/Dashboard/page.jsx";
import { Routes, Route, useLocation } from "react-router-dom";
import Notices from "./pages/Notices/page.jsx";
import Login from "./pages/Login/page.jsx";
import Ekye from "./pages/Ekye/page.jsx";
import LeaveRequest from "./pages/Leave/LeaveRequest/page.jsx";
import Attendance from "./pages/Attendance/Attendance/page.jsx";
import AttendanceRequest from "./pages/Attendance/Request/page.jsx";
import Employees from "./pages/Employees/page.jsx";
import Department from "./pages/MasterData/Deparement/page.jsx";
import Position from "./pages/MasterData/Position/page.jsx";
import Roles from "./pages/MasterData/Roles/page.jsx";
import HandBook from "./pages/Handbook/page.jsx";
import LeaveStatus from "./pages/Leave/LeaveStatus/page.jsx";
import Settings from "./pages/Setting/page.jsx";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import AddEmployees from "./pages/Employees/AddEmployees/page.jsx";
import Rstpwd from "./pages/resetpassword/page.jsx";
import ValidateLink from "./pages/resetpassword/validatelink/page.jsx";
import AuthLayout from "./components/AuthLayout/AuthLayout.jsx";
import AdminEkye from "../src/pages/Ekye/AdminEkye/page.jsx";
// import EkyeAction from "./components/EkyeAction.jsx";
// import View from "./pages/Ekye/AdminEkye/EKyeView/Page.jsx";
import EkyeAction from "./components/Ekye/EkyeAction.jsx";
import View from "../src/pages/Ekye/AdminEkye/EkyeView/page.jsx";
import LocationComponent from "./components/LocationComponent.jsx";
import LeaveApprove from "./pages/Leave/LeaveApprove/Page.jsx";
import SalaryDetails from "./pages/Salary/page.jsx";
import SalaryEdit from "./pages/Salary/SalaryDetail/Page.jsx";
import AdvanceSalary from "./pages/Salary/AdvanceSalary/Page.jsx";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let resetpasswordData = params.get("data");

    if (resetpasswordData) {
      resetpasswordData = decodeURIComponent(resetpasswordData);
      resetpasswordData = resetpasswordData.replaceAll(" ", "+");

      localStorage.setItem("resetpasswordData", resetpasswordData);

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  const location = useLocation();
  const authRoutes = ["/login", "/rstpwd", "/resetpwd", "/EKYE"];
  const isAuthRoute = authRoutes.includes(location.pathname);
  return (
    <>
      <LocationComponent />
      <ToastContainer />
      {isAuthRoute ? (
        <AuthLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/rstpwd" element={<ValidateLink />} />
            <Route path="/EKYE" element={<Ekye />} />
          </Routes>
        </AuthLayout>
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Attendance" element={<Attendance />} />
            <Route path="/Attendance/Request" element={<AttendanceRequest />} />
            <Route path="/Employees" element={<Employees />} />
            <Route path="/AddEmployees" element={<AddEmployees />} />
            <Route path="/master-data/Department" element={<Department />} />
            <Route path="/master-data/Position" element={<Position />} />
            <Route path="/master-data/Roles" element={<Roles />} />
            <Route path="/HandBook" element={<HandBook />} />
            <Route path="/Notice" element={<Notices />} />
            <Route path="/Leave/status" element={<LeaveStatus />} />
            <Route path="/Leave/Request" element={<LeaveRequest />} />
            <Route path="/Leave/apprej/:id" element={<LeaveApprove />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/AdminEkye" element={<AdminEkye />} />
            <Route path="/EkyeAction/:rclId" element={<EkyeAction />} />
            <Route path="/View/:rclId" element={<View />} />
            <Route path="/Salary" element={<SalaryDetails />} />
            <Route path="/SalaryEdit" element={<SalaryEdit />} />
            <Route path="/AdvanceSalary" element={<AdvanceSalary />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default App;
