import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import { Button, Input } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { IoMdAdd } from "react-icons/io";
import { IoReturnDownBack } from "react-icons/io5";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import ValidationComponent from "../../../components/ValidationComponent";
import { BsFilter } from "react-icons/bs";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";

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
        const response = await axiosInstance.post(
          "/api/v1/departments/get/all"
        );
        if (response.data.responseCode === "200") {
          setDepartmentsData(response.data.datalist);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error(
          "Error fetching departments.",
          error.response?.data?.message
        );
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
        "/api/v1/departments/register",
        newDepartment
      );
      if (response.data.responseCode === "201") {
        setDepartmentName("");
        setDepartmentDescription("");
        setDepartmentsData((prev) => [...prev, response.data]);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Error adding department.", error.response?.data?.message);
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
        `/api/v1/departments/update/${editingDepartmentId}`,
        updatedPosition,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "200") {
        toast.success(response.data.message);
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
      toast.error(error.response?.data?.messages);
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
            `/api/v1/departments/delete/${department.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.responseCode === "204") {
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Error deleting position:", error);
          setShowEditForm(true);
          toast.error(error.response?.data?.message);
        }
        break;
      default:
        console.log("Unknown action");
    }
  };
  const columns = [
    { key: "name", label: "Department Name" },
    { key: "description", label: "Description" },
    { key: "actions", label: "Actions" },
  ];
  const getKeyValue = (obj, key) => (key in obj ? obj[key] : null);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "MasterData", href: "" },
    { label: "Department", href: "/master-data/Department" },
  ];
  return (
    <>
      <ValidationComponent>
        {isLoading && (
          <Loader message="Please wait while the work is being done" />
        )}
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className=" flex justify-between">
              <div className=" flex flex-col">
                <BreadcrumbsComponent items={breadcrumbItems} />
                <h2 className="page-title">Departments</h2>
              </div>
            </div>

            <Button
              className="button bg-green-700 tracking-normal
  hover:bg-green-900"
              onPress={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? (
                <>
                  <IoReturnDownBack className="text-white h-24 w-24" />
                  <span className="text-white font-Poppins text-xl">
                    Return
                  </span>
                </>
              ) : (
                <>
                  <IoMdAdd className="text-white h-24 w-24" />
                  <span className="text-white font-Poppins text-xl">Add</span>
                </>
              )}
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
                    id="name"
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
              className="mb-6 p-4 bg-white shadow-md rounded-lg  mx-auto"
              onSubmit={handleAddDepartment}>
              <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
                Add New Department
              </h2>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col flex-1 gap-4">
                  <Input
                    id="name"
                    type="text"
                    label="Department Name"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="rounded-xl shadow-md  focus:outline-none w-full"
                    required
                  />
                  <Textarea
                    id="description"
                    label="Description"
                    value={departmentDescription}
                    onChange={(e) => setDepartmentDescription(e.target.value)}
                    className="border rounded-xl shadow-md focus:outline-none resize-none w-full"
                    required></Textarea>
                </div>
              </div>
              <div className="flex flex-col md:w-1/4 justify-end md:justify-start">
                <button
                  type="submit"
                  className=" bg-bgprimary text-white rounded-lg  p-2  hover:bg-bgprimaryhover transition w-full md:w-auto mt-6">
                  Submit
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
              <Table aria-label="Department Table">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key} className="">
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={departmentsData}>
                  {(department) => (
                    <TableRow key={Department.id}>
                      {(columnKey) => (
                        <TableCell className="justify-between">
                          {columnKey === "actions" ? (
                            <div className="flex justify-center mr-8">
                              <HiPencilSquare
                                className="text-green-500 cursor-pointer hover:text-green-700 text-xl mr-2"
                                title="Edit"
                                onClick={() => handleAction("edit", department)}
                              />
                              <MdDelete
                                className="text-red-500 cursor-pointer hover:text-red-700 text-xl ml-2"
                                title="Delete"
                                onClick={() =>
                                  handleAction("delete", department)
                                }
                              />
                            </div>
                          ) : columnKey === "description" ? (
                            <div className="max-w-[60vw]">
                              {getKeyValue(department, columnKey)}
                            </div>
                          ) : (
                            getKeyValue(department, columnKey)
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </ValidationComponent>
    </>
  );
};

export default Department;
