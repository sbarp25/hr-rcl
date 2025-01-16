import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { MdDelete } from "react-icons/md";
import { Pagination } from "@nextui-org/react";
import ValidationComponent from "../../components/ValidationComponent";
const Employees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [editEmployee, setEditEmployee] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 11;
  const startIndex = (currentPage - 1) * noticesPerPage;
  const endIndex = startIndex + noticesPerPage;

  const paginatedEmployees = employeesData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/v1/auth/get/all");
        // const response = await axiosInstance.get("/auth/getAllUser");
        if (response.data.responseCode === "200") {
          setEmployeesData(response.data.datalist);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching Employees:", error);
        toast.error("Error fetching Employees.", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);
  const handleAction = async (action, employee) => {
    switch (action) {
      case "edit":
        console.log(`Editing employee ID: ${employee}`);
        break;
      // Start Of Delete Operation
      case "delete":
        try {
          console.log(`Deleting position ID: ${employee}`);
          const response = await axiosInstance.delete(
            `/api/v1/employee/delete/${employee}`
          );
          if (response.data.responseCode === "204") {
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Error deleting position:", error);
          toast.error("Error deleting position.", error);
        }
        break;
      // End Of Delete Operation
      default:
        console.log("Unknown action");
    }
  };
  return (
    <>
      <ValidationComponent>
        {isLoading && (
          <Loader message="Please wait while the work is being done" />
        )}
        <div className="p-4 md:p-8 max-h-[95vh] overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="page-title">Employees</h1>
            <a className="button hover:button-hover" href="/AddEmployees">
              Add Employees
            </a>
          </div>
          {editEmployee && <div>Editing Employee</div>}
          <div className="bg-white shadow-md rounded-lg overflow-x-auto max-h-[95vh] overflow-y-auto">
            <table className="table-fixed w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="border border-gray-300 px-2 py-1 w-16">S.N</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Employee Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Employee Email
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Employee Department
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Employee Position
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.length > 0 ? (
                  paginatedEmployees
                    .filter((position) => !position.isDeleted)
                    .map((employee, index) => (
                      <tr
                        key={employee.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}>
                        <td className="border border-gray-300 px-2 py-1 text-center w-16">
                          {startIndex + index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {employee.fullName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="max-h-32 overflow-y-auto">
                            {employee.email}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="max-h-32 overflow-y-auto">
                            {employee.departmentName}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="max-h-32 overflow-y-auto">
                            {employee.postionName}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-center gap-4">
                            <HiPencilSquare
                              className="text-green-500 cursor-pointer hover:text-green-700"
                              title="Edit"
                              onClick={() => handleAction("edit", employee)}
                            />
                            <MdDelete
                              className="text-red-500 cursor-pointer hover:text-red-700"
                              title="Delete"
                              onClick={() => handleAction("delete", employee)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-gray-500 py-4">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div>
            <Pagination
              initialPage={1}
              total={Math.ceil(employeesData.length / noticesPerPage)}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </ValidationComponent>
    </>
  );
};

export default Employees;
