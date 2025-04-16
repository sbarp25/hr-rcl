import { useState, useEffect } from "react";
import { FaRegEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
  Button,
  Switch,
} from "@nextui-org/react";
import Loader from "../../components/Loader";
import Search from "../../components/Search";
import Filter from "../../components/Filter";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";
import DropDownComp from "../../components/Dropdown";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../utils/LocalStorageUtil";

const Employees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [employeeDataPerPage, setEmployeeDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [originalEmployeeData, setOriginalEmployeeData] = useState([]);
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Employees", href: "/Employees" },
  ];

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/v1/users/list", {
          // const response = await axiosInstance.post("/api/v1/auth/get/all", {
          pageIndex: currentPage,
          pageSize: employeeDataPerPage,
        });

        if (response?.data?.responseCode === "200") {
          setOriginalEmployeeData(response?.data?.datalist || []);
          setEmployeesData(response?.data?.datalist || []);
          setTotalPages(response.data.totalPages);
          setTotalRecords(response.data.totalRecords);
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
  }, [currentPage, employeeDataPerPage]);

  const menu = LocalStorageUtil.getItem("menu");

  /**To check create status */
  const hasemployeecreateaccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 1)
  );
  /**To read the Data */
  const hasaccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 2)
  );
  /**To check edit status */
  const hasEmployeeEditAccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 3)
  );
  /**To check Delete Access */
  const hasEmployeeDeleteAccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 4)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/");
    }
  }, []);
  const handleRedirect = () => {
    navigate("/AddEmployees");
  };

  const handleAction = async (action, employeeId) => {
    switch (action) {
      case "edit":
        try {
          if (hasEmployeeEditAccess) {
            toast.success("You have edit access");
            navigate(`/Employees/Edit/${employeeId}`);
          } else {
            toast.error("Access Denied");
            return;
          }
        } catch (error) {
          toast.error(error);
          return;
        }
        console.log(`Editing employee ID: ${employeeId}`);
        break;
      case "delete":
        try {
          if (hasEmployeeDeleteAccess) {
            console.log(`Deleting employee ID: ${employeeId}`);
            const response = await axiosInstance.delete(
              `/api/v1/employee/delete/${employeeId}`
            );
            if (response.data.responseCode === "204") {
              toast.success(response.data.message);
              setEmployeesData(
                employeesData.filter((e) => e.id !== employeeId)
              );
            } else {
              toast.error(response.data.message);
            }
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

  const handleApplyFilters = (result) => {
    console.log("Filter result:", result); // Add this debug line

    if (result.data) {
      // Filter component returned filtered data
      setEmployeesData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      // Reset case - refetch original data
      const fetchEmployees = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.post("/api/v1/users/list", {
            pageIndex: currentPage,
            pageSize: employeeDataPerPage,
          });

          if (response?.data?.responseCode === "200") {
            setOriginalEmployeeData(response?.data?.datalist || []);
            setEmployeesData(response?.data?.datalist || []);
            setTotalPages(response.data.totalPages);
            setTotalRecords(response.data.totalRecords);
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
    }
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
                <Filter
                  onApplyFilters={handleApplyFilters}
                  url="/api/v1/users/list"
                />
              </div>
              <Button
                isDisabled={!hasemployeecreateaccess}
                className="flex gap-2 items-center rounded-2xl bg-black hover:bg-gray-200 text-white hover:text-black hover:border border-gray-500 py-2 px-4"
                onPress={handleRedirect}>
                <AiOutlineUserAdd className="text-xl" />
                Add Employees
              </Button>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg p-2">
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
                  <TableRow
                    key={employee.rclId}
                    className="h-14 border-b-2 border-gray-300">
                    <TableCell>
                      {(currentPage - 1) * employeeDataPerPage + index + 1}
                    </TableCell>
                    <TableCell>{employee.rclId}</TableCell>
                    <TableCell>{employee.fullName}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.departmentName}</TableCell>
                    <TableCell>{employee.postionName}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-4">
                        {/* <Switch isSelected={isSelected} onValueChange={setIsSelected}> */}
                        <FaRegEye
                          className={`  ${
                            hasEmployeeEditAccess
                              ? "text-green-500 hover:text-green-700 cursor-pointer "
                              : ""
                          }`}
                          title="Edit"
                          onClick={() => handleAction("edit", employee.rclId)}
                        />
                        <MdDelete
                          className={`${
                            hasEmployeeDeleteAccess
                              ? "text-red-500 cursor-pointer hover:text-red-700"
                              : ""
                          }`}
                          title="Delete"
                          onClick={() => handleAction("delete", employee.rclId)}
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
                Showing {employeeDataPerPage} of {totalRecords}
              </span>
            </div>
            <Pagination
              showControls
              total={totalPages}
              page={currentPage}
              onChange={handlePageChange}
            />
            <div className="flex justify-center items-center">
              <span className="text-xs">Lines Per Page :</span>
              <DropDownComp
                items={dropdownItems}
                onSelect={setEmployeeDataPerPage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Employees;
