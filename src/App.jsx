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

import LeaveStatus from "./pages/Leave/LeaveStatus/page.jsx";
import Settings from "./pages/Setting/page.jsx";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import AddEmployees from "./pages/Employees/AddEmployees/page.jsx";
import ValidateLink from "./pages/resetpassword/validatelink/page.jsx";
import AuthLayout from "./components/AuthLayout/AuthLayout.jsx";
import AdminEkye from "../src/pages/Ekye/AdminEkye/page.jsx";
import EkyeAction from "./components/Ekye/EkyeAction.jsx";
import View from "../src/pages/Ekye/AdminEkye/EkyeView/page.jsx";
import LocationComponent from "./components/LocationComponent.jsx";
import SalaryDetails from "./pages/Salary/page.jsx";
import SalaryEdit from "./pages/Salary/SalaryDetail/Page.jsx";
import AdvanceSalary from "./pages/Salary/AdvanceSalary/Page.jsx";
import PrivateRoutes from "./utils/ProtectedRoutes.jsx";
import AddDepartment from "./pages/MasterData/Deparement/AddDepartment/Page.jsx";
import EditDepartment from "./pages/MasterData/Deparement/EditDepartment/page.jsx";
import EditEmployees from "./pages/Employees/EditEmployees/Page.jsx";
import AddPosition from "./pages/MasterData/Position/AddPosition/Page.jsx";
import EditPosition from "./pages/MasterData/Position/EditPosition/Page.jsx";
import LeaveView from "./pages/Leave/LeaveView/Page.jsx";
import MobileNavigation from "./components/MobileNavigation.jsx";
import ForgetPassword from "./pages/ForgetPassword/Page.jsx";
import ResetForGetPassword from "./pages/ForgetPassword/ValidatePassword/Page.jsx";
import ChangePassword from "./pages/Setting/ChangePassword/Page.jsx";
import ViewEKYE from "./pages/Setting/ViewEKYE/Page.jsx";
import UserLayout from "./components/Layout/UserLayout.jsx";
import Bank from "./pages/Bank/Page.jsx";
import GetBankDetails from "./pages/Bank/GetBank/Page.jsx";
import RequestWorkFromHome from "./pages/WorkFromHome/RequestWorkFromHome/Page.jsx";
import WorkFromHomeStatus from "./pages/WorkFromHome/WorkFromHomeStatus/Page.jsx";
import ViewWorkFromHome from "./pages/WorkFromHome/ViewWorkFromHome/Page.jsx";
import AddRoles from "./pages/MasterData/Roles/AddRoles/Page.jsx";
import EditRole from "./pages/MasterData/Roles/EditRoles/Page.jsx";
import SelfLeaveStatus from "./pages/Leave/LeaveRequest/Leave/page.jsx";
import UserMobileSidebar from "./components/Sidebar/UserMobileSidebar.jsx";
// import HandBook from "./pages/HandBook/page.jsx";

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
  const authRoutes = [
    "/login",
    "/",
    "/rstpwd",
    "/resetpwd",
    "/EKYE",
    "/forgetPassword",
    "/forget-password",
  ];
  const userRoutes = [
    "/settings",
    "/settings/ViewEKYE",
    "/settings/Change",
    "/Salary",
    "/SalaryEdit",
    "/AdvanceSalary",
    "/Bank",
    "/Bank/AddBank",
  ];
  const isUserRoutes = userRoutes.includes(location.pathname);
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <>
      <LocationComponent />
      <ToastContainer autoClose={1500} />
      {isAuthRoute ? (
        <AuthLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/rstpwd" element={<ValidateLink />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/EKYE" element={<Ekye />} />
            </Route>
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="/forget-password" element={<ResetForGetPassword />} />
          </Routes>
        </AuthLayout>
      ) : isUserRoutes ? (
        <UserLayout>
          <div className="flex md:hidden mb-1">
            <UserMobileSidebar />
          </div>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/ViewEKYE" element={<ViewEKYE />} />
              <Route path="/settings/Change" element={<ChangePassword />} />
              <Route path="/Salary" element={<SalaryDetails />} />
              <Route path="/SalaryEdit" element={<SalaryEdit />} />
              <Route path="/AdvanceSalary" element={<AdvanceSalary />} />
              <Route path="/Bank" element={<GetBankDetails />} />
              <Route path="/Bank/AddBank" element={<Bank />} />
            </Route>
          </Routes>
        </UserLayout>
      ) : (
        <Layout>
          <div className="flex md:hidden mb-1">
            <MobileNavigation />
          </div>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
              {/* <Route path="/Attendance" element={<Attendance />} /> */}
              <Route
                path="/Attendance/Request"
                element={<AttendanceRequest />}
              />
              <Route path="/Employees" element={<Employees />} />
              <Route path="/AddEmployees" element={<AddEmployees />} />
              <Route path="/Employees/Edit/:id" element={<EditEmployees />} />
              <Route path="/master-data/Department" element={<Department />} />
              <Route
                path="/master-data/Department/Add"
                element={<AddDepartment />}
              />
              <Route
                path="/master-data/Department/Edit/:id"
                element={<EditDepartment />}
              />
              <Route path="/master-data/Position" element={<Position />} />
              <Route
                path="/master-data/AddPosition"
                element={<AddPosition />}
              />
              <Route
                path="/master-data/Position/Edit/:id"
                element={<EditPosition />}
              />
              <Route path="/master-data/Roles" element={<Roles />} />
              <Route path="/master-data/Roles/add" element={<AddRoles />} />
              <Route
                path="/master-data/Roles/edit/:roleId"
                element={<EditRole />}
              />
              {/* <Route path="/HandBook" element={<HandBook />} /> */}
              <Route path="/Notice" element={<Notices />} />
              <Route path="/Leave/status" element={<LeaveStatus />} />
              <Route path="/Leave/Request" element={<SelfLeaveStatus />} />
              <Route path="/Leave/addRequest" element={<LeaveRequest />} />
              <Route path="/Leave/view/:id" element={<LeaveView />} />
              <Route path="/AdminEkye" element={<AdminEkye />} />
              <Route path="/EkyeAction/:rclId" element={<EkyeAction />} />
              <Route path="/View/:rclId" element={<View />} />
              <Route path="/WFH" element={<RequestWorkFromHome />} />
              <Route path="/WFH/Status" element={<WorkFromHomeStatus />} />
              <Route path="/WRH/view/:rclId" element={<ViewWorkFromHome />} />
            </Route>
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default App;
