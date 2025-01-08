import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import { Button, Input } from "@nextui-org/react";

const Department = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [departmentsData, setDepartmentsData] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");

  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  // Fetch departments data
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/departments/get/all");
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

  // Add Department code
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newDepartment = {
      data: {
        departmentName: departmentName,
        description: departmentDescription,
      },
    };

    try {
      const response = await axiosInstance.post(
        "/api/departments/register",
        newDepartment,
        {
          headers: {
            Authorization:
              "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzdXBlcmFkbWluQHJlYm9vdGVkY2wuY29tIiwiaWF0IjoxNzM1ODIwNjYxLCJleHAiOjE3MzU4MjA5NjF9.N0SS_Q656P8vm4-kCrPDwNDZ33LbPl9uI3qXaEeB4jh989t6g3cRi2-3E0w6vsUi",
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

  // Edit Department code
  const handleEditdepartment = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedPosition = {
      data: {
        departmentName: departmentName,
        description: departmentDescription,
      },
    };

    try {
      const response = await axiosInstance.put(
        `/api/departments/update/${editingDepartmentId}`,
        updatedPosition,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "200") {
        toast.success("Position updated successfully!");
        setDepartmentsData((prevData) =>
          prevData.map((item) =>
            item.id === editingDepartmentId
              ? {
                  ...item,
                  name: departmentName,
                  description: departmentDescription,
                }
              : item
          )
        );
        // Reset form and states
        setDepartmentName("");
        setDepartmentDescription("");
        setShowEditForm(false);
        setEditingDepartmentId(null);
      } else {
        toast.error("Failed to update the position.");
      }
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error("Error updating position.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action, department) => {
    switch (action) {
      // Start Of Edit Operation
      case "edit":
        console.log(`Editing position ID: ${department.id}`);
        setShowEditForm(true);
        setDepartmentName(department.name || "");
        setDepartmentDescription(department.description || "");
        setEditingDepartmentId(department.id);
        break;
      // End Of Edit Operation
      case "delete":
        console.log(`Deleting position ID: ${department.id}`);
        try {
          const response = await axiosInstance.delete(
            `/api/departments/delete/${department.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.responseCode === "204") {
            toast.success("Position deleted successfully!");
          } else {
            toast.error("Failed to delete the position.");
          }
        } catch (error) {
          console.error("Error deleting position:", error);
          setShowEditForm(true);
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
          <Button
            className="button  bg-bgprimary hover:bg-bgprimaryhover text-white"
            onPress={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Show Department" : "Add Department"}
          </Button>
        </div>
        {showEditForm && (
          <form
            className="mb-6 p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto"
            onSubmit={handleEditdepartment}>
            <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
              Edit Department
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col flex-1 gap-4">
                <Input
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
              {/* Submit and Cancel Buttons */}
              <div className="flex flex-col md:w-1/4 justify-end md:justify-start gap-y-4">
                <Button
                  type="submit"
                  className="button bg-bgprimary text-white rounded-lg px-6 py-2 hover:bg-bgprimaryhover transition w-full md:w-auto">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  className="button bg-gray-500 text-white rounded-lg px-6 py-2 hover:bg-gray-600 transition w-full md:w-auto"
                  onPress={() => setShowEditForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}
        {showAddForm ? (
          <form
            className="mb-6 p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto"
            onSubmit={handleAddDepartment}>
            <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
              Add New Department
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col flex-1 gap-4">
                <Input
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
                              onClick={() => handleAction("edit", department)}
                            />
                            <MdDelete
                              className="text-red-500 cursor-pointer hover:text-red-700"
                              title="Delete"
                              onClick={() => handleAction("delete", department)}
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
