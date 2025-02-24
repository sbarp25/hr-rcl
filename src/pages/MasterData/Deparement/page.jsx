import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import { Button, Input, Pagination, Tooltip } from "@nextui-org/react";
import { Textarea } from "@nextui-org/input";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BiData } from "react-icons/bi";
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
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import DropDownComp from "../../../components/Dropdown";
import Filter from "../../../components/Filter";
import Search from "../../../components/Search";

const Department = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [departmentPerPage, setDepartmentPerPage] = useState(10);

  const [departmentDataPerPage, setDepartmentDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const accessToken = localStorage.getItem("accessToken");

  const [originalDepartmentsData, setOriginalDepartmentsData] = useState([]);

  const handleApplyFilters = (filters) => {
    // If no filters, show all original data
    if (!filters.department && !filters.position) {
      setDepartmentsData(originalDepartmentsData);
      return;
    }

    // Apply filtering
    const filteredData = originalDepartmentsData.filter((dept) => {
      return (
        (!filters.department || dept.name === filters.department) &&
        (!filters.position || dept.positionName === filters.position)
      );
    });

    setDepartmentsData(filteredData);
  };
  // Fetch departments data
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/v1/departments/list", {
          pageIndex: currentPage,
          pageSize: departmentDataPerPage,
        });
        if (response.data.responseCode === "200") {
          setOriginalDepartmentsData(response?.data?.datalist || []); // Store original data
          setDepartmentsData(response?.data?.datalist || []); // Initially set filtered data to original data
          setTotalPages(response.data.totalPages);
          setTotalRecords(response.data.totalRecords);
        } else {
          toast.error(response?.data?.data?.message);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("Error fetching departments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [currentPage, departmentDataPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

    const updatedDepartment = {
      data: {
        departmentName: departmentName,
        description: departmentDescription,
      },
    };

    try {
      const response = await axiosInstance.put(
        `/api/v1/departments/update/${editingDepartmentId}`,
        updatedDepartment,
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

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "MasterData", href: "" },
    { label: "Department", href: "/master-data/Department" },
  ];
  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
  return (
    <>
      <ValidationComponent>
        {isLoading && (
          <Loader message="Please wait while the work is being done" />
        )}
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className=" flex justify-between">
              <div className=" flex flex-col space-y-4">
                <BreadcrumbsComponent items={breadcrumbItems} />

                <h2 className="page-title ">
                  <div className="flex items-center gap-2">
                    <BiData />
                    Department
                  </div>
                </h2>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Search />
              <Filter
                onApplyFilters={handleApplyFilters}
                url="/api/v1/departments/list"
              />
              <Button
                className="button bg-black font-md tracking-normal"
                onPress={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? (
                  <>
                    <IoReturnDownBack className="text-white text-base" />
                    <span className="text-white font-normal text-xs">
                      Return
                    </span>
                  </>
                ) : (
                  <>
                    <IoIosAddCircleOutline className="text-white text-base" />
                    <span className="text-white font-normal text-xs">
                      Add Department
                    </span>
                  </>
                )}
              </Button>
            </div>
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
          <div className="bg-white rounded-lg p-2">
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
              <div className="bg-white shadow-md rounded-lg overflow-y-auto max-h-[74vh]">
                <Table aria-label="Department Table ">
                  <TableHeader>
                    <TableColumn className="text-lg">S.N</TableColumn>
                    <TableColumn className="text-lg">
                      Department Name
                    </TableColumn>
                    <TableColumn className="text-lg">Description</TableColumn>
                    <TableColumn className="text-lg">User Action</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {departmentsData.map((department, index) => (
                      <TableRow
                        key={department.rclId}
                        className="h-20 justify-center items-center border-b-2 border-gray-300">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{department.name}</TableCell>
                        <TableCell>
                          {" "}
                          <Tooltip content={department.description}>
                            {truncateText(department.description, 30)}
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <div className="flex">
                            <HiPencilSquare
                              className="text-yellow-500 cursor-pointer hover:text-green-700 text-xl mr-2"
                              title="Edit"
                              onClick={() => handleAction("edit", department)}
                            />
                            <MdDelete
                              className="text-red-500 cursor-pointer hover:text-red-700 text-xl ml-2"
                              title="Delete"
                              onClick={() => handleAction("delete", department)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between">
            <div className="text-xs">
              <span>
                Showing {departmentPerPage} of {totalRecords}
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
                onSelect={setDepartmentPerPage}
              />
            </div>
          </div>
        </div>
      </ValidationComponent>
    </>
  );
};

export default Department;
