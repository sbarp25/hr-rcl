import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
} from "@nextui-org/react";
import Loader from "../../components/Loader";
import Search from "../../components/Search";
import Filter from "../../components/Filter";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";

const Employees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [employeeDataPerPage, setEmployeeDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const startIndex = (currentPage - 1) * employeeDataPerPage;

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Employees", href: "/Employees" },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/v1/auth/get/all", {
          pageIndex: currentPage,
          pageSize: employeeDataPerPage,
        });

        if (response?.data?.responseCode === "200") {
          setTotalPages(response.data.totalPages);
          setTotalRecords(response.data.totalRecords);
          setEmployeesData(response?.data?.dataList || []);
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Error fetching employees.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [currentPage]);

  const handleAction = async (action, employeeId) => {
    switch (action) {
      case "edit":
        console.log(`Editing employee ID: ${employeeId}`);
        break;
      case "delete":
        try {
          console.log(`Deleting employee ID: ${employeeId}`);
          const response = await axiosInstance.delete(
            `/api/v1/employee/delete/${employeeId}`
          );
          if (response.data.responseCode === "204") {
            toast.success(response.data.message);
            setEmployeesData(employeesData.filter((e) => e.id !== employeeId));
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Error deleting employee:", error);
          toast.error("Error deleting employee.");
        }
        break;
      default:
        console.log("Unknown action");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {isLoading && <Loader message="Loading employees..." />}
      <div className="px-4 md:px-8 max-h-[85vh] space-y-4">
        {/* Breadcrumbs and Header */}
        <div className="flex flex-col space-y-4">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <div className="flex justify-between items-center">
            <h1 className="flex items-center gap-2">
              <IoIosPeople className="text-2xl" />
              <span className="page-title">Employees</span>
            </h1>
            <div className="flex gap-x-4">
              <div className="flex items-center space-x-4">
                <Search />
                <Filter />
              </div>
              <a
                className="flex gap-2 items-center rounded-2xl bg-black hover:bg-gray-200 text-white hover:text-black hover:border border-gray-500 py-2 px-4"
                href="/AddEmployees">
                <AiOutlineUserAdd className="text-xl" />
                Add Employees
              </a>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="shadow-md rounded-lg max-h-[80vh] overflow-x-auto text-left">
          <Table bordered aria-label="List of Employees">
            <TableHeader>
              <TableColumn>S.N</TableColumn>
              <TableColumn>RCL-ID</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Department</TableColumn>
              <TableColumn>Position</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {employeesData.map((employee, index) => (
                <TableRow key={employee.employeeId}>
                  <TableCell>
                    {(currentPage - 1) * employeesPerPage + index + 1}
                  </TableCell>
                  <TableCell>{employee.rclId}</TableCell>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.departmentName}</TableCell>
                  <TableCell>{employee.positionName}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-4">
                      <HiPencilSquare
                        className="text-green-500 cursor-pointer hover:text-green-700"
                        title="Edit"
                        onClick={() => handleAction("edit", employee.id)}
                      />
                      <MdDelete
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        title="Delete"
                        onClick={() => handleAction("delete", employee.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <div className="text-xs">
            <span>
              Showing {employeeDataPerPage} of {totalEmployees}
            </span>
          </div>
          <Pagination
            total={Math.ceil(totalEmployees / employeeDataPerPage)}
            initialPage={1}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default Employees;
