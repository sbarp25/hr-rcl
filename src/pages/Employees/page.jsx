import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
const Employees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeDescription, setEmployeeDescription] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(false);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newEmployee = {
      data: {
        name: employeeName,
        description: employeeDescription,
      },
    };
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axiosInstance.post(
        "/employees/register",
        newEmployee,
        {
          headers: {
            "Content-Type": "application/json",
            accessToken: accessToken,
          },
        }
      );
      if (response.data.responseCode === "201") {
        setEmployeeName("");
        setEmployeeDescription("");
        setEmployeesData((prev) => [...prev, response.data]);
        toast.success("Employee added successfully!");
      } else {
        toast.error("Failed to add employee.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Error adding employee.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action, employeeId) => {
    switch (action) {
      case "edit":
        console.log(`Editing employee ID: ${employeeId}`);
        break;
      case "delete":
        try {
          console.log(`Deleting position ID: ${employeeId}`);
          const response = await axiosInstance.delete(
            `/employees/delete/${employeeId}`
          );
          if (response.data.responseCode === "204") {
            toast.success("Position deleted successfully!");
          } else {
            toast.error("Failed to delete the position.");
          }
        } catch (error) {
          console.error("Error deleting position:", error);
          setEditEmployee(true);
          toast.error("Error deleting position.");
        }
        break;
      default:
        console.log("Unknown action");
    }
  };
  return (
    <>
      {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )}
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="page-title">Employees</h1>
          <button
            className="button hover:button-hover"
            onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Show Employees" : "Add Employees"}
          </button>
        </div>
        {editEmployee && <div>Editing Employee</div>}
        {showAddForm ? (
          <form
            className="mb-6 p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto"
            onSubmit={handleAddEmployee}>
            <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
              Add New Employee
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col flex-1 gap-4">
                <input
                  type="text"
                  placeholder="Employee Name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="input border rounded-lg px-4 py-2 focus:outline-none w-full"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={employeeDescription}
                  onChange={(e) => setEmployeeDescription(e.target.value)}
                  className="input border rounded-lg px-4 py-2 h-24 focus:outline-none resize-none w-full"
                  required></textarea>
              </div>

              <div className="flex flex-col md:w-1/4 justify-end md:justify-start">
                <button
                  type="submit"
                  className="button bg-bgprimary text-white rounded-lg px-6 py-2 hover:bg-bgprimaryhover transition w-full md:w-auto">
                  Add employee
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="border border-gray-300 px-4 py-2">
                    Employee Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employeesData.length > 0 ? (
                  employeesData
                    .filter((position) => !position.isDeleted)
                    .map((employee, index) => (
                      <tr
                        key={employee.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}>
                        <td className="border border-gray-300 px-4 py-2">
                          {employee.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 sm:overflow-y-hidden">
                          <div className="max-h-32 overflow-y-auto">
                            {employee.description}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-center gap-4">
                            <HiPencilSquare
                              className="text-green-500 cursor-pointer hover:text-green-700"
                              title="Edit"
                              onClick={() => handleAction("edit", employee.id)}
                            />
                            <MdDelete
                              className="text-red-500 cursor-pointer hover:text-red-700"
                              title="Delete"
                              onClick={() =>
                                handleAction("delete", employee.id)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 py-4">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Employees;
