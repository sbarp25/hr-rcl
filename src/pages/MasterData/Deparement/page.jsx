import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import { Button, Pagination, Tooltip } from "@nextui-org/react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { BiData } from "react-icons/bi";
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
import { Link, useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";

const Department = () => {
  const [departmentsData, setDepartmentsData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [departmentPerPage, setDepartmentPerPage] = useState(10);

  const [departmentDataPerPage, setDepartmentDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const accessToken = localStorage.getItem("accessToken");

  const navigate = useNavigate();
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
  // const handleAddDepartment = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const newDepartment = {
  //     data: {
  //       departmentName: departmentName,
  //       description: departmentDescription,
  //     },
  //   };

  //   try {
  //     const response = await axiosInstance.post(
  //       "/api/v1/departments/register",
  //       newDepartment
  //     );
  //     if (response.data.responseCode === "201") {
  //       setDepartmentName("");
  //       setDepartmentDescription("");
  //       setDepartmentsData((prev) => [...prev, response.data]);
  //       toast.success(response.data.message);
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error adding department:", error);
  //     toast.error("Error adding department.", error.response?.data?.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // // Edit Department code
  // const handleEditdepartment = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   const updatedDepartment = {
  //     data: {
  //       departmentName: departmentName,
  //       description: departmentDescription,
  //     },
  //   };

  //   try {
  //     const response = await axiosInstance.put(
  //       `/api/v1/departments/update/${editingDepartmentId}`,
  //       updatedDepartment,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.data.responseCode === "200") {
  //       toast.success(response.data.message);
  //       setDepartmentsData((prevData) =>
  //         prevData.map((item) =>
  //           item.id === editingDepartmentId
  //             ? {
  //                 ...item,
  //                 name: departmentName,
  //                 description: departmentDescription,
  //               }
  //             : item
  //         )
  //       );
  //       // Reset form and states
  //       setDepartmentName("");
  //       setDepartmentDescription("");
  //       setShowEditForm(false);
  //       setEditingDepartmentId(null);
  //     } else {
  //       toast.error("Failed to update the position.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating position:", error);
  //     toast.error(error.response?.data?.messages);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleAction = async (action, department) => {
    switch (action) {
      // Start Of Edit Operation
      case "edit":
        if (hasDepartmentEditAccess) {
          navigate(`/master-data/Department/Edit/${department.id}`);
          console.log(`Editing Department ID: ${department.id}`);
          // setShowEditForm(true);
          // setDepartmentName(department.name || "");
          // setDepartmentDescription(department.description || "");
          // setEditingDepartmentId(department.id);
        } else {
          toast.error("Access denied");
        }
        break;
      // End Of Edit Operation
      case "delete":
        console.log(`Deleting position ID: ${department.id}`);
        try {
          if (hasDepartmentDeleteAccess) {
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
          } else {
            toast.error("Access denied");
          }
        } catch (error) {
          console.error("Error deleting position:", error);
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
  // const navigate = useNavigate();
  // const hasaccess = false;

  // useEffect(() => {
  //   if (!hasaccess) {
  //     navigate("/");
  //   }
  // }, []);
  const menu = LocalStorageUtil.getItem("menu");

  /**To check create status */
  const hasDepartmentCreateAccess = menu.some((menu) =>
    menu.actionList.some((action) => action.actionId === 9)
  );
  /**To read the Data */
  const hasaccess = menu.some((menu) =>
    menu.actionList.some((action) => action.actionId === 10)
  );
  /**To check edit status */
  const hasDepartmentEditAccess = menu.some((menu) =>
    menu.actionList.some((action) => action.actionId === 11)
  );
  /**To check Delete Access */
  const hasDepartmentDeleteAccess = menu.some((menu) =>
    menu.actionList.some((action) => action.actionId === 12)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/");
    }
  }, []);

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

              <Button className="flex bg-black text-white">
                <Link
                  to="/master-data/Department/Add"
                  className={`${
                    hasDepartmentCreateAccess ? "" : "pointer-events-none"
                  }`}>
                  <div className="flex justify-center items-center gap-2">
                    <IoIosAddCircleOutline className="text-white text-xl" />
                    <span className="text-white font-normal">
                      Add Department
                    </span>
                  </div>
                </Link>
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-2">
            <div className="bg-white shadow-md rounded-lg overflow-y-auto max-h-[74vh]">
              <Table aria-label="Department Table ">
                <TableHeader>
                  <TableColumn className="text-lg">S.N</TableColumn>
                  <TableColumn className="text-lg">Department Name</TableColumn>
                  <TableColumn className="text-lg">Description</TableColumn>
                  <TableColumn className="text-lg">Team Lead</TableColumn>
                  <TableColumn className="text-lg">
                    Associate Team Lead
                  </TableColumn>
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
                      <TableCell>{department.teamLeadName}</TableCell>
                      <TableCell>{department.associateTeamLeadId}</TableCell>
                      <TableCell>
                        <div className="flex">
                          <HiPencilSquare
                            className={`${
                              hasDepartmentEditAccess
                                ? "text-yellow-500 cursor-pointer hover:text-green-700 text-xl mr-2"
                                : "text-xl mr-2"
                            }`}
                            title="Edit"
                            onClick={() => handleAction("edit", department)}
                          />
                          <MdDelete
                            className={`${
                              hasDepartmentDeleteAccess
                                ? "text-red-500 cursor-pointer hover:text-red-700 text-xl ml-2"
                                : "text-xl ml-2"
                            }`}
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
