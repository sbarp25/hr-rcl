import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
// import { toast } from "sonner";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import { FaEllipsisV, FaEye } from "react-icons/fa";
import {
  hasCreateAccess,
  hasUpdateAccess,
  hasDeleteAccess,
  MENU_NAMES,
  hasViewone,
  hasReadAccess,
} from "../../utils/permissionUtils";
import Search from "../../components/Search";
import Filter from "../../components/Filter";
import BreadcrumbsComponent from "../../components/ui/BreadCrumbsComp.jsx";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";
import DropDownComp from "../../components/ui/Dropdown.jsx";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../components/Loader/SkeletonLoader.jsx";
import { useEmployeeDelete, useEmployeefetch } from "../../hooks/useAuth.js";

const Employees = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [filteredPagination, setFilteredPagination] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [employeeDataPerPage, setEmployeeDataPerPage] = useState(10);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const breadcrumbItems = [{ label: "Employees", href: "/Employees" }];

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  /**Permission Checking */
  // const hasaccess = true;
  const hasaccess = hasReadAccess(MENU_NAMES.EMPLOYEES);
  /**To check edit status */
  const hasEmployeeEditAccess = hasUpdateAccess(MENU_NAMES.EMPLOYEES);
  /**To check Delete Access */
  const hasEmployeeDeleteAccess = hasDeleteAccess(MENU_NAMES.EMPLOYEES);
  const hasSingle = hasViewone(MENU_NAMES.EMPLOYEES);

  const { data, isLoading, refetch } = useEmployeefetch(
    currentPage,
    employeeDataPerPage
  );

  // Filtered employees
  const employees = filteredData || data?.datalist || [];
  let totalPages = filteredPagination?.totalPages || data?.totalPages || 1;
  let totalRecords =
    filteredPagination?.totalRecords || data?.totalRecords || 0;
  const filteredEmployees = employees.filter((employee) => employee.isActive);

  /**To check create status */
  const hasemployeecreateaccess = hasCreateAccess(MENU_NAMES.EMPLOYEES);

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    setFilteredData(null);
    setFilteredPagination(null);
  }, [currentPage, employeeDataPerPage]);

  const handleRedirect = () => {
    if (hasemployeecreateaccess) {
      navigate("/AddEmployees");
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };

  const deleteMutation = useEmployeeDelete();

  const onDelete = () => {
    try {
      if (hasEmployeeDeleteAccess && deletingId) {
        deleteMutation.mutate(deletingId);
        refetch();
        onClose();
      }
    } catch {}
  };
  const handleAction = async (action, employeeId) => {
    switch (action) {
      case "edit":
        try {
          if (hasEmployeeEditAccess) {
            navigate(`/Employees/Edit/${employeeId}`);
          } else {
            toast.error("Currently You dont have access to this setting.");
          }
        } catch (error) {
          toast.error(error);
          return;
        }
        break;
      case "delete":
        if (hasEmployeeDeleteAccess) {
          setDeletingId(employeeId);
          onOpen();
        } else {
          toast.error("Currently You dont have access to this setting.");
        }
        break;
      case "view":
        if (hasSingle) {
          navigate(`/Employees/view/${employeeId}`);
        } else {
          toast.error("Currently You dont have access to this setting.");
        }
        break;
      default:
        console.log("Unknown action");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setEmployeeDataPerPage(null);
    setFilteredData(null);
  };

  const handleApplyFilters = (result) => {
    if (result.data) {
      setFilteredData(result.data);
      setFilteredPagination({
        totalPages: result.totalPages,
        totalRecords: result.totalRecords,
      });
    } else {
      setFilteredData(null);
      setFilteredPagination(null);
      refetch();
    }
  };

  const handleApplySearch = (result) => {
    if (result.data) {
      setFilteredData(result.data);
      setFilteredPagination({
        totalPages: result.totalPages,
        totalRecords: result.totalRecords,
      });
    } else {
      setFilteredData(null);
      setFilteredPagination(null);
      refetch();
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      {/* {isDeleteLoading && <Loader />} */}
      <div className="px-4 md:px-8 space-y-4 ">
        {/* Breadcrumbs and Header */}
        <div className="flex flex-col space-y-4">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex items-center page-title -pl-2">
              <IoIosPeople className="text-2xl" />
              <span className="page-title">Employees</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Search
                  onApplySearch={handleApplySearch}
                  url="/api/v1/users/list"
                  searchFields={[
                    "fullName",
                    "email",
                    "rclId",
                    "departmentName",
                    "postionName",
                  ]}
                  placeholder="Search employees..."
                />
                <Filter
                  onApplyFilters={handleApplyFilters}
                  url="/api/v1/users/list"
                  fieldNames={{
                    departmentField: "departmentId",
                    fromDateField: "createdAt",
                    toDateField: "createdto",
                    positionField: "positionId",
                  }}
                  className="w-full sm:w-auto"
                />
              </div>
              <Button
                isDisabled={!hasemployeecreateaccess}
                className="flex gap-2 items-center rounded-2xl text-white bg-black dark:bg-white dark:text-black dark:hover:text-white hover:bg-active dark:hover:dark:bg-active py-2 px-4 w-full sm:w-auto"
                onPress={handleRedirect}>
                <AiOutlineUserAdd className="text-xl" />
                Add Employees
              </Button>
            </div>
          </div>
        </div>

        {/* Employee Table - Large screens */}
        <div className="hidden xl:block bg-white dark:bg-black rounded-lg p-2  overflow-y-auto">
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
            <TableBody
              items={isLoading ? [] : filteredEmployees}
              isLoading={isLoading}
              loadingState={isLoading}
              loadingContent={<SkeletonLoader />}>
              {filteredEmployees.map((employee, index) => (
                <TableRow
                  key={employee.rclId}
                  className="h-14 border-b-2 border-gray-300 dark:border-neutral-600">
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
                      <FaEye
                        className={`${
                          hasaccess
                            ? "text-black dark:text-white hover:text-green-500 dark:hover:text-green-500 cursor-pointer "
                            : "text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
                        }`}
                        title="View"
                        onClick={() => handleAction("view", employee.rclId)}
                      />
                      <HiPencilSquare
                        className={`${
                          hasEmployeeEditAccess
                            ? "text-black dark:text-white hover:text-orange-500 dark:hover:text-orange-500 cursor-pointer "
                            : "text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
                        }`}
                        title="Edit"
                        onClick={() => handleAction("edit", employee.rclId)}
                      />
                      <MdDelete
                        className={`${
                          hasEmployeeDeleteAccess
                            ? "text-black dark:text-white cursor-pointer hover:text-red-500 dark:hover:text-red-500"
                            : "text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed"
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
          {!isLoading &&
            (!filteredEmployees || filteredEmployees.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                No Data available
              </div>
            )}
        </div>

        {/* Employee Table - Medium screens */}
        <div className="hidden lg:block xl:hidden bg-white dark:bg-black rounded-lg p-2  overflow-y-auto">
          <Table bordered aria-label="List of Employees">
            <TableHeader className="bg-gray-50">
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Department</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody
              items={isLoading ? [] : filteredEmployees}
              isLoading={isLoading}
              loadingContent={<SkeletonLoader />}>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.rclId} className="">
                  <TableCell>
                    <div>
                      <div className="font-medium">{employee.fullName}</div>
                      <div className="text-sm text-black dark:text-white">
                        {employee.rclId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <div>
                      <div>{employee.departmentName}</div>
                      <div className="text-sm text-black dark:text-white">
                        {employee.postionName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button variant="light" size="sm">
                          <FaEllipsisV />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Employee Actions">
                        <DropdownItem
                          key="view"
                          className={!hasaccess ? "opacity-50" : ""}
                          onPress={() => handleAction("view", employee.rclId)}>
                          view Employee
                        </DropdownItem>
                        <DropdownItem
                          key="edit"
                          className={!hasEmployeeEditAccess ? "opacity-50" : ""}
                          onPress={() => handleAction("edit", employee.rclId)}>
                          Edit Employee
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className={`${
                            !hasEmployeeDeleteAccess ? "opacity-50" : ""
                          } text-danger`}
                          color="danger"
                          onPress={() =>
                            handleAction("delete", employee.rclId)
                          }>
                          Delete Employee
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLoading &&
            (!filteredEmployees || filteredEmployees.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                No Data available
              </div>
            )}
        </div>

        {/* Employee Cards - Small screens */}
        <div className="block lg:hidden">
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <Accordion variant="bordered">
                {filteredEmployees.map((employee) => (
                  <AccordionItem
                    key={employee.rclId}
                    title={
                      <div className="flex justify-between items-center p-3 cursor-pointer">
                        <div>
                          <div className="font-medium">{employee.fullName}</div>
                          <div className="text-sm text-black dark:text-white">
                            {employee.rclId}
                          </div>
                        </div>
                        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {employee.departmentName}
                        </div>
                      </div>
                    }>
                    <>
                      {" "}
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Email:
                          </span>
                          <span className="text-right">{employee.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Department:
                          </span>
                          <span className="text-right">
                            {employee.departmentName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-600">
                            Position:
                          </span>
                          <span className="text-right">
                            {employee.postionName}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="flat"
                          className="flex-1 bg-black text-white"
                          isDisabled={!hasaccess}
                          onPress={() => handleAction("view", employee.rclId)}>
                          <HiPencilSquare className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          className="flex-1 bg-black text-white"
                          isDisabled={!hasEmployeeEditAccess}
                          onPress={() => handleAction("edit", employee.rclId)}>
                          <HiPencilSquare className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          className="flex-1"
                          isDisabled={!hasEmployeeDeleteAccess}
                          onPress={() =>
                            handleAction("delete", employee.rclId)
                          }>
                          <MdDelete className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </>
                  </AccordionItem>
                ))}
              </Accordion>

              {(!filteredEmployees || filteredEmployees.length === 0) && (
                <div className="p-8 text-center text-gray-500 bg-white rounded-lg">
                  No Data available
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pagination - Responsive */}
        {!isLoading && filteredEmployees && filteredEmployees.length > 0 && (
          <div className="bg-white dark:bg-black rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm font-medium text-gray-600 dark:text-white flex items-center order-2 sm:order-1">
                <span className="mr-1">Showing:</span>
                <span className="font-bold text-gray-800 dark:text-white mx-1">
                  {totalRecords < employeeDataPerPage
                    ? totalRecords
                    : employeeDataPerPage}
                </span>
                <span className="mr-1">of</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {totalRecords}
                </span>
              </div>

              <div className="order-1 sm:order-2">
                <Pagination
                  showControls
                  total={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  classNames={{
                    cursor: "bg-active text-white",
                  }}
                  size="sm"
                />
              </div>

              <div className="flex justify-center items-center order-3">
                <span className="text-xs mr-2">Lines Per Page:</span>
                <DropDownComp
                  items={dropdownItems}
                  selectedValue={employeeDataPerPage}
                  onSelect={setEmployeeDataPerPage}
                />
              </div>
            </div>
          </div>
        )}
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
                <p>Are you sure you want to delete this employee?</p>
                <div className="flex gap-2 justify-end mt-4">
                  <Button
                    className="text-white bg-black dark:bg-white dark:text-black dark:hover:text-white hover:bg-active dark:hover:dark:bg-active"
                    onPress={() => onDelete()}>
                    Delete
                  </Button>
                  <Button onPress={onClose}>Cancel</Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Employees;
