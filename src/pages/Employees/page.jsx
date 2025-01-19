import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import {
  Button,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import ValidationComponent from "../../components/ValidationComponent";
import { BsFilter } from "react-icons/bs";
import { AiOutlineUserAdd } from "react-icons/ai";
import DropDownComp from "../../components/Dropdown";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";

const Employees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10;
  const TotalEmployee = 30;
  const startIndex = (currentPage - 1) * employeesPerPage;
  const endIndex = startIndex + employeesPerPage;
  const paginatedEmployees = employeesData.slice(startIndex, endIndex);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Employees", href: "/Employees" },
  ];

  const dropdownItems = [10, 20, 30, 50, 100];
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/v1/auth/get/all");
        if (response.data.responseCode === "200") {
          setEmployeesData(response.data.datalist);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Error fetching employees.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

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
  // const columns = [
  //   { key: "sn", label: "S.N" },
  //   { key: "RCL-ID", label: "RCL-ID" },
  //   { key: "name", label: "Name" },
  //   { key: "email", label: "Email" },
  //   { key: "phone", label: "Phone" },
  //   { key: "department", label: "Depratment" },
  //   { key: "position", label: "Position" },
  //   { key: "action", label: "Actions" },
  // ];
  // const getKeyValue = (obj, key) => (key in obj ? obj[key] : null);

  return (
    <>
      <ValidationComponent>
        {/* {isLoading && <Loader message="Loading employees..." />} */}
        <div className="px-4 md:px-8 max-h-[85vh]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex flex-col">
              <div className="text-sm">
                <BreadcrumbsComponent items={breadcrumbItems} />
              </div>
              <h1 className="page-title">Employees</h1>
            </div>
            <div className="flex gap-x-4">
              <div className="flex items-center space-x-4">
                <Input className="w-64" type="search" placeholder="Search..." />
                <Button className="flex items-center bg-white hover:bg-gray-200 text-black py-2 px-4">
                  <BsFilter className="mr-2 text-2xl" />
                  <span className="text-lg font-bold">Filter</span>
                </Button>
              </div>
              <a
                className="flex items-center rounded-2xl bg-black hover:bg-gray-200 text-white hover:text-black hover:border border-gray-500 py-2 px-4"
                href="/AddEmployees">
                <AiOutlineUserAdd className="text-xl" />
                Add Employee
              </a>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg max-h-[80vh] overflow-x-auto text-left">
            <Table bordered aria-label="List of Employees">
              <TableHeader className="Capitalize">
                <TableColumn>S.N</TableColumn>
                <TableColumn>RCL-ID</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Department</TableColumn>
                <TableColumn>Position</TableColumn>
                <TableColumn>Action</TableColumn>
              </TableHeader>
              <TableBody>
                {paginatedEmployees.map((employee, index) => (
                  <TableRow key={employee.employeeId}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{employee.rclId}</TableCell>
                    <TableCell>{employee.fullName}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.departmentName}</TableCell>
                    <TableCell>{employee.positionName}</TableCell>
                    <TableCell>
                      {employee.Action}
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

          <div className="mt-4 flex justify-between">
            <div className="flex text-xs">
              <span>Showing:</span>
              <div className="flex justify-between gap-x-1">
                <span className="font-bold">{employeesPerPage}</span>
                <span>of</span>
                <span>{TotalEmployee}</span>
              </div>
            </div>
            <Pagination
              initialPage={1}
              total={Math.ceil(employeesData.length / employeesPerPage)}
              onChange={handlePageChange}
            />
            <div className="flex justify-center items-center">
              <span className="text-xs">Lines Per Page :</span>
              <div>
                <DropDownComp items={dropdownItems} />
              </div>
            </div>
          </div>
        </div>
      </ValidationComponent>
    </>
  );
};

export default Employees;
