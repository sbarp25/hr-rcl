import { useState, useEffect } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../lib/axios-Instance";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
  Button,
  Switch,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react";
import Loader from "../../components/Loader";
import Search from "../../components/Search";
import Filter from "../../components/Filter";
import BreadcrumbsComponent from "../../components/BreadCrumbsComp";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoIosPeople } from "react-icons/io";
import DropDownComp from "../../components/Dropdown";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../utils/LocalStorageUtil";
import SkeletonLoader from "../../components/SkeletonLoader";

const Employees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setDeleteIsLoading] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [employeeDataPerPage, setEmployeeDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [originalEmployeeData, setOriginalEmployeeData] = useState([]);
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const breadcrumbItems = [{ label: "Employees", href: "/Employees" }];

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/v1/users/list", {
        // const response = await axiosInstance.post("/api/v1/auth/get/all", {
        pageIndex: currentPage,
        pageSize: employeeDataPerPage,
      });

      if (response?.data?.responseCode === "200") {
        setOriginalEmployeeData(response?.data?.datalist || []);
        setEmployeesData(response?.data?.datalist || []);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Error fetching employees.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, employeeDataPerPage]);

  const menu = LocalStorageUtil.getItem("menu");

  /**To check create status */
  const hasemployeecreateaccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 9)
  );
  /**To read the Data */
  const hasaccess = true;
  // const hasaccess = menu?.some((menu) =>
  //   menu?.actions?.some((action) => action.actionId === 10)
  // );
  /**To check edit status */
  const hasEmployeeEditAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 11)
  );
  /**To check Delete Access */
  const hasEmployeeDeleteAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 12)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);
  const handleRedirect = () => {
    if (hasemployeecreateaccess) {
      navigate("/AddEmployees");
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };
  const onDelete = async () => {
    setDeleteIsLoading(true);
    try {
      if (hasEmployeeDeleteAccess) {
        const response = await axiosInstance.delete(
          `/api/v1/auth/toggle/${deletingId}`
        );
        if (response.data.responseCode === "204") {
          toast.success(response.data.message);
          fetchEmployees();
          onClose();
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error deleting employee.");
    } finally {
      setDeleteIsLoading(false);
    }
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
      default:
        console.log("Unknown action");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApplyFilters = (result) => {
    console.log("Filter result:", result); // Add this debug line

    if (result.data) {
      // Filter component returned filtered data
      setEmployeesData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      // Reset case - refetch original data
      const fetchEmployees = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.post("/api/v1/users/list", {
            pageIndex: currentPage,
            pageSize: employeeDataPerPage,
          });

          if (response?.data?.responseCode === "200") {
            setOriginalEmployeeData(response?.data?.datalist || []);
            setEmployeesData(response?.data?.datalist || []);
            setTotalPages(response.data.totalPages);
            setTotalRecords(response.data.totalRecords);
          } else {
            toast.error(response?.data?.message);
          }
        } catch (error) {
          console.error("Error fetching employees:", error);
          toast.error("Error fetching employees.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchEmployees();
    }
  };

  const handleApplySearch = (result) => {
    if (result.data) {
      // Search component returned filtered data
      setEmployeesData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      fetchEmployees();
    }
  };

  return (
    <>
      {isDeleteLoading && <Loader />}
      <div className="px-4 md:px-8 space-y-4">
        {/* Breadcrumbs and Header */}
        <div className="flex flex-col">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center page-title -pl-2">
              <IoIosPeople className="text-2xl" />
              <span className="page-title">Employees</span>
            </div>
            <div className="flex gap-x-4">
              <div className="flex items-center space-x-4">
                <Search
                  onApplySearch={handleApplySearch}
                  url="/api/v1/users/list"
                  searchFields={[
                    "fullName",
                    "email",
                    "rclId",
                    "Department",
                    "position",
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
                className="flex gap-2 items-center rounded-2xl bg-black hover:bg-gray-200 text-white hover:text-black hover:border border-gray-500 py-2 px-4"
                onPress={handleRedirect}>
                <AiOutlineUserAdd className="text-xl" />
                Add Employees
              </Button>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg p-2 max-h-[80vh] overflow-y-auto">
          <div className=" rounded-lg  text-left">
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
                items={isLoading ? [] : employeesData}
                isLoading={isLoading}
                loadingContent={<SkeletonLoader />}>
                {employeesData
                  .filter((employee) => employee.isActive)
                  .map((employee, index) => (
                    <TableRow
                      key={employee.rclId}
                      className="h-14 border-b-2 border-gray-300">
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
                          <HiPencilSquare
                            className={`  ${
                              hasEmployeeEditAccess
                                ? "text-orange-500 hover:text-orange-700 cursor-pointer "
                                : ""
                            }`}
                            title="Edit"
                            onClick={() => handleAction("edit", employee.rclId)}
                          />
                          <MdDelete
                            className={`${
                              hasEmployeeDeleteAccess
                                ? "text-red-500 cursor-pointer hover:text-red-700"
                                : ""
                            }`}
                            title="Delete"
                            onClick={() =>
                              handleAction("delete", employee.rclId)
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {!isLoading && (!employeesData || employeesData.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No Data available
            </div>
          )}
          {/* Pagination */}
          <div className="mt-4 flex justify-between">
            <div className="text-sm font-medium text-gray-600  flex items-center">
              <span className="mr-1">Showing:</span>
              <span className="font-bold text-gray-800 mx-1">
                {/* {employeeDataPerPage} */}
                {totalRecords < employeeDataPerPage
                  ? totalRecords
                  : employeeDataPerPage}
              </span>
              <span className="mr-1">of</span>
              <span className="font-bold text-gray-800">{totalRecords}</span>
            </div>

            <Pagination
              showControls
              total={totalPages}
              page={currentPage}
              onChange={handlePageChange}
            />
            <div className="flex justify-center items-center">
              <span className="text-xs mr-2">Lines Per Page :</span>
              <DropDownComp
                items={dropdownItems}
                onSelect={setEmployeeDataPerPage}
              />
            </div>
          </div>
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
                <p>Are you sure you want to delete this employee ?</p>
                <div className="flex gap-2 justify-end mt-4">
                  <Button
                    className="bg-black text-white"
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
    </>
  );
};

export default Employees;
