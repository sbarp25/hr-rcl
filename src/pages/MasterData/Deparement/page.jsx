import { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";

const Department = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch departments data
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/departments/get/all");
        if (response.data.responseCode === "200") {
          setDepartmentsData(response.data.datalist);
        } else {
          toast.error("Failed to fetch departments.");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Error fetching departments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newDepartment = {
      name: departmentName,
      description: departmentDescription,
      isDeleted: false,
      createdBy: "Odinson",
    };

    try {
      const response = await axiosInstance.post(
        "/departments/register",
        newDepartment,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseCode === "201") {
        setDepartmentName("");
        setDepartmentDescription("");
        setDepartmentsData((prev) => [...prev, response.data]);
        toast.success("Department added successfully!");
      } else {
        toast.error("Failed to add department.");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Error adding department.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action, departmentId) => {
    switch (action) {
      case "edit":
        console.log(`Editing department ID: ${departmentId}`);
        break;
      case "delete":
        try {
          console.log(`Deleting position ID: ${departmentId}`);
          const response = await axiosInstance.delete(
            `/departments/delete/${departmentId}`
          );
          if (response.data.responseCode === "204") {
            toast.success("Position deleted successfully!");
          } else {
            toast.error("Failed to delete the position.");
          }
        } catch (error) {
          console.error("Error deleting position:", error);
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
          <h1 className="page-title">Departments</h1>
          <button
            className="button hover:button-hover"
            onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Show Department" : "Add Department"}
          </button>
        </div>

        {showAddForm ? (
          <form
            className="mb-6 p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto"
            onSubmit={handleAddDepartment}>
            <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
              Add New Department
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col flex-1 gap-4">
                <input
                  type="text"
                  placeholder="Department Name"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="input border rounded-lg px-4 py-2 focus:outline-none w-full"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={departmentDescription}
                  onChange={(e) => setDepartmentDescription(e.target.value)}
                  className="input border rounded-lg px-4 py-2 h-24 focus:outline-none resize-none w-full"
                  required></textarea>
              </div>

              <div className="flex flex-col md:w-1/4 justify-end md:justify-start">
                <button
                  type="submit"
                  className="button bg-bgprimary text-white rounded-lg px-6 py-2 hover:bg-bgprimaryhover transition w-full md:w-auto">
                  Add Department
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
                    Department Name
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
                {departmentsData.length > 0 ? (
                  departmentsData
                    .filter((position) => !position.isDeleted)
                    .map((department, index) => (
                      <tr
                        key={department.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}>
                        <td className="border border-gray-300 px-4 py-2">
                          {department.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 sm:overflow-y-hidden">
                          <div className="max-h-32 overflow-y-auto">
                            {department.description}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-center gap-4">
                            <HiPencilSquare
                              className="text-green-500 cursor-pointer hover:text-green-700"
                              title="Edit"
                              onClick={() =>
                                handleAction("edit", department.id)
                              }
                            />
                            <MdDelete
                              className="text-red-500 cursor-pointer hover:text-red-700"
                              title="Delete"
                              onClick={() =>
                                handleAction("delete", department.id)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 py-4">
                      No departments found.
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

export default Department;
