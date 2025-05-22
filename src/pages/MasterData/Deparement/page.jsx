import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Pagination,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
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
import BreadcrumbsComponent from "../../../components/ui/BreadCrumbsComp.jsx";
import DropDownComp from "../../../components/ui/Dropdown.jsx";
import Filter from "../../../components/Filter";
import Search from "../../../components/Search";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import SkeletonLoader from "../../../components/Loader/SkeletonLoader.jsx";
import truncateText from "../../../utils/truncateText";
import Loader from "../../../components/Loader/Loader.jsx";
const Department = () => {
  const [departmentsData, setDepartmentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentPerPage, setDepartmentPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [expandedRow, setExpandedRow] = useState(null);
  const dropdownItems = [5, 10, 20, 30, 50, 100];
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const accessToken = localStorage.getItem("accessToken");
  const [departmentId, setDepartmentId] = useState(null);
  const navigate = useNavigate();
  const [originalDepartmentsData, setOriginalDepartmentsData] = useState([]);

  const handleApplyFilters = (result) => {
    if (result.data) {
      setDepartmentsData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      setDepartmentsData(originalDepartmentsData);
    }
  };

  // Fetch departments data
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/v1/departments/list", {
        pageIndex: currentPage,
        pageSize: departmentPerPage,
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
  useEffect(() => {
    fetchDepartments();
  }, [currentPage, departmentPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAction = async (action, department) => {
    switch (action) {
      // Start Of Edit Operation
      case "edit":
        if (hasDepartmentEditAccess) {
          navigate(`/master-data/Department/Edit/${department.id}`);
          console.log(`Editing Department ID: ${department.id}`);
        } else {
          toast.error("Access denied");
        }
        break;
      // End Of Edit Operation
      case "delete":
        if (hasDepartmentDeleteAccess) {
          setDepartmentId(department.id);
          console.log(`Deleting position ID: ${department.id}`);
          onOpen();
        } else {
          toast.error("Currently You dont have access to this setting.");
        }
        break;
      default:
        console.log("Unknown action");
    }
  };

  const onDelete = async () => {
    setIsDeleteLoading(true);
    try {
      if (hasDepartmentDeleteAccess) {
        const response = await axiosInstance.delete(
          `/api/v1/departments/delete/${departmentId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.responseCode === "204") {
          onClose();
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
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "MasterData", href: "" },
    { label: "Department", href: "/master-data/Department" },
  ];

  const menu = LocalStorageUtil.getItem("menu");

  /**To check create status */
  const hasDepartmentCreateAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 43)
  );

  /**To read the Data */
  const hasaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 44)
  );
  // const hasaccess = true;
  /**To check edit status */
  const hasDepartmentEditAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 45)
  );
  /**To check Delete Access */
  const hasDepartmentDeleteAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 46)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const gotoAdd = () => {
    if (hasDepartmentCreateAccess) {
      navigate("/master-data/Department/Add");
    } else {
      toast.error("You don't have Create Access");
    }
  };

  const toggleExpandedRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  const handleApplySearch = (result) => {
    if (result.data) {
      // Search component returned filtered data
      setDepartmentsData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      fetchDepartments();
    }
  };
  return (
    <>
      {isDeleteLoading ? (
        <Loader />
      ) : (
        <>
          <div className="px-2 md:px-8 space-y-4">
            {/**Header Section */}
            <div className="flex flex-col space-y-4">
              <div className="text-sm">
                <BreadcrumbsComponent items={breadcrumbItems} />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center page-title -pl-2">
                  <BiData className="text-2xl" />
                  <span className="page-title">Department</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-x-4 w-full sm:w-auto">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                    <Search
                      onApplySearch={handleApplySearch}
                      url="/api/v1/departments/list"
                      searchFields={[
                        "fullName",
                        "email",
                        "rclId",
                        "Department",
                        "position",
                      ]}
                      placeholder="Search Departments..."
                    />
                    <Filter
                      onApplyFilters={handleApplyFilters}
                      url="/api/v1/departments/list"
                      fieldNames={{
                        departmentField: "id",
                        fromDateField: "createdAt",
                        toDateField: "createdto",
                        positionField: "positionId",
                      }}
                      className="w-full sm:w-auto"
                    />
                  </div>
                  <Button
                    className="flex bg-black text-white w-full sm:w-auto"
                    onPress={gotoAdd}>
                    <div className="flex justify-center items-center gap-2">
                      <IoIosAddCircleOutline className="text-white text-xl" />
                      <span className="text-white font-normal">
                        Add Department
                      </span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg max-h-[80vh] overflow-y-auto space-y-4 p-2">
              {/* Large screens - Full table */}
              <div className="hidden lg:block">
                <div className=" rounded-lg max-h-[80vh]  text-left">
                  <Table bordered aria-label="Department Table">
                    <TableHeader>
                      <TableColumn>S.N</TableColumn>
                      <TableColumn>Department Name</TableColumn>
                      <TableColumn>Description</TableColumn>
                      <TableColumn>Team Lead</TableColumn>
                      <TableColumn>Associate Team Lead</TableColumn>
                      <TableColumn>User Action</TableColumn>
                    </TableHeader>
                    <TableBody
                      items={isLoading ? [] : departmentsData}
                      isLoading={isLoading}
                      loadingContent={<SkeletonLoader />}>
                      {departmentsData
                        .filter((department) => !department.isDeleted)
                        .map((department, index) => (
                          <TableRow
                            key={department.rclId}
                            className="h-14 justify-center items-center border-b-2 border-gray-300">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{department.name}</TableCell>
                            <TableCell>
                              {department.description.length < 15 ? (
                                department.description
                              ) : (
                                <Tooltip content={department.description}>
                                  {truncateText(department.description, 15)}
                                </Tooltip>
                              )}
                            </TableCell>
                            <TableCell>{department.teamLeadName}</TableCell>
                            <TableCell>
                              {department.associateTeamLeadName}
                            </TableCell>
                            <TableCell>
                              <div className="flex">
                                <HiPencilSquare
                                  className={`${
                                    hasDepartmentEditAccess
                                      ? "text-orange-500 cursor-pointer hover:text-orange-700 text-xl mr-2"
                                      : "text-xl mr-2"
                                  }`}
                                  title="Edit"
                                  onClick={() =>
                                    handleAction("edit", department)
                                  }
                                />
                                <MdDelete
                                  className={`${
                                    hasDepartmentDeleteAccess
                                      ? "text-red-500 cursor-pointer hover:text-red-700 text-xl ml-2"
                                      : "text-xl ml-2"
                                  }`}
                                  title="Delete"
                                  onClick={() =>
                                    handleAction("delete", department)
                                  }
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Medium screens - Simplified table */}
              <div className="hidden md:block lg:hidden">
                <div className="shadow-md rounded-lg max-h-[80vh]  text-left">
                  <Table bordered aria-label="Department Table">
                    <TableHeader>
                      <TableColumn>Department</TableColumn>
                      <TableColumn>Description</TableColumn>
                      <TableColumn>Team Lead</TableColumn>
                      <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {departmentsData
                        .filter((department) => !department.isDeleted)
                        .map((department, index) => (
                          <TableRow
                            key={department.rclId}
                            className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {department.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ID: {department.rclId}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {department.description.length < 15 ? (
                                department.description
                              ) : (
                                <Tooltip content={department.description}>
                                  {truncateText(department.description, 15)}
                                </Tooltip>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{department.teamLeadName}</span>
                                {department.associateTeamLeadName && (
                                  <span className="text-xs text-gray-500">
                                    Associate:{" "}
                                    {department.associateTeamLeadName}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex">
                                <HiPencilSquare
                                  className={`${
                                    hasDepartmentEditAccess
                                      ? "text-yellow-500 cursor-pointer hover:text-green-700 text-xl mr-2"
                                      : "text-xl mr-2"
                                  }`}
                                  title="Edit"
                                  onClick={() =>
                                    handleAction("edit", department)
                                  }
                                />
                                <MdDelete
                                  className={`${
                                    hasDepartmentDeleteAccess
                                      ? "text-red-500 cursor-pointer hover:text-red-700 text-xl ml-2"
                                      : "text-xl ml-2"
                                  }`}
                                  title="Delete"
                                  onClick={() =>
                                    handleAction("delete", department)
                                  }
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Small screens - Card-like view */}
              <div className="block md:hidden">
                <div className="space-y-4">
                  {departmentsData
                    .filter((department) => !department.isDeleted)
                    .map((department, index) => (
                      <div
                        key={department.rclId}
                        className="border rounded-lg overflow-hidden shadow-sm">
                        <div
                          className="flex justify-between items-center p-3 cursor-pointer bg-gray-50"
                          onClick={() => toggleExpandedRow(department.rclId)}>
                          <div className="font-medium">{department.name}</div>
                          <div className="flex items-center gap-2">
                            <FaChevronDown
                              size={16}
                              className={`transition-transform ${
                                expandedRow === department.rclId
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>
                        <div
                          className={`${
                            expandedRow === department.rclId
                              ? "block"
                              : "hidden"
                          } p-3 space-y-2 text-sm`}>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Department ID:</div>
                            <div>{department.rclId}</div>
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="font-medium">Description:</div>
                            <div className="bg-gray-50 p-2 rounded">
                              {department.description}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Team Lead:</div>
                            <div>{department.teamLeadName || "N/A"}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Associate Lead:</div>
                            <div>
                              {department.associateTeamLeadName || "N/A"}
                            </div>
                          </div>
                          <div className="flex justify-end gap-4 mt-2">
                            <Button
                              size="sm"
                              color="warning"
                              className={`${
                                !hasDepartmentEditAccess
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onPress={() =>
                                hasDepartmentEditAccess &&
                                handleAction("edit", department)
                              }
                              disabled={!hasDepartmentEditAccess}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              className={`${
                                !hasDepartmentDeleteAccess
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onPress={() =>
                                hasDepartmentDeleteAccess &&
                                handleAction("delete", department)
                              }
                              disabled={!hasDepartmentDeleteAccess}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}

                  {(!departmentsData || departmentsData.length === 0) &&
                    !isLoading && (
                      <div className="p-8 text-center text-gray-500">
                        No Data available
                      </div>
                    )}
                </div>
              </div>

              {/* Pagination - Responsive for all screens */}
              {departmentsData && departmentsData.length > 0 && (
                <div className="mt-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 relative z-10 bg-white pb-4">
                  <div className="text-sm font-medium text-gray-600 flex items-center">
                    <span className="mr-1">Showing:</span>
                    <span className="font-bold text-gray-800 mx-1">
                      {totalRecords < departmentPerPage
                        ? totalRecords
                        : departmentPerPage}
                    </span>
                    <span className="mr-1">of</span>
                    <span className="font-bold text-gray-800">
                      {totalRecords}
                    </span>
                  </div>

                  <div className="w-full sm:w-auto flex justify-center order-1 sm:order-2">
                    <Pagination
                      showControls
                      total={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      size="sm"
                    />
                  </div>
                  <div className="flex justify-center items-center order-3">
                    <span className="text-xs mr-2">Lines Per Page:</span>
                    <DropDownComp
                      items={dropdownItems}
                      onSelect={setDepartmentPerPage}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={true}
            isKeyboardDismissDisabled={false}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody>
                    <p>Are you sure you want to delete this department?</p>
                    <div className="flex gap-2 justify-end mt-4">
                      <Button color="danger" onPress={() => onDelete()}>
                        Delete
                      </Button>
                      <Button onPress={onClose}>Cancel</Button>
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </>
  );
};

export default Department;
