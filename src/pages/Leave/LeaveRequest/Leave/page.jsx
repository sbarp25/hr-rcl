import {
  Accordion,
  AccordionItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import BreadcrumbsComponent from "../../../../components/ui/BreadCrumbsComp.jsx";
import Filter from "../../../../components/Filter";
import Search from "../../../../components/Search";
import SkeletonLoader from "../../../../components/Loader/SkeletonLoader.jsx";
import truncateText from "../../../../utils/truncateText";
import { FaCheckCircle, FaChevronDown, FaRegEye } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import DropDownComp from "../../../../components/ui/Dropdown.jsx";
import TextAreaComp from "../../../../components/ui/TextAreaComp.jsx";
import { toast } from "sonner";
import axiosInstance from "../../../../lib/axios-Instance";
import { useEffect, useState } from "react";
import LocalStorageUtil from "../../../../utils/LocalStorageUtil";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../../components/ui/ButtonComp.jsx";
import { MdNavigateBefore } from "react-icons/md";
import {
  hasApproveAccess,
  hasCreateAccess,
  hasDeleteAccess,
  hasReadAccess,
  hasUpdateAccess,
  MENU_NAMES,
} from "../../../../utils/permissionUtils.js";
import { useLeaveByRole } from "../../../../hooks/useAuth.js";

const SelfLeaveStatus = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onOpenChange: onRejectOpenChange,
    onClose: onRejectClose,
  } = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [originalLeaveData, setOriginalLeaveData] = useState([]);

  const [leaveDataPerPage, setLeaveDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();
  const { reset, control, handleSubmit } = useForm();
  const { data: dataLeaveByRole } = useLeaveByRole();

  const handlePageChange = (page) => {
    setLeaveData([]);
    setCurrentPage(page);
  };

  const toggleExpandedRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const breadcrumbItems = [
    { label: "Leave", href: "" },
    { label: "Leave Status", href: "/Leave/Status" },
  ];

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const fetchLeave = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `/api/v1/leave_management/list`,
        { pageIndex: currentPage, pageSize: leaveDataPerPage }
      );
      if (response.data.responseCode === "200") {
        setLeaveData(response.data.datalist);
        setOriginalLeaveData(response.data.datalist);
        setTotalPages(response.data.totalPages);
        setTotalRecords(response.data.totalRecords);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeave();
    console.log("The data", dataLeaveByRole?.data?.datalist);
  }, [currentPage, leaveDataPerPage]);

  // const hasaccess = true;
  // const hasLeaveUpdateAccess = true;
  const hasaccess = hasReadAccess(MENU_NAMES.LEAVEREQUEST);
  const hasLeaveUpdateAccess = hasApproveAccess(MENU_NAMES.LEAVEREQUEST);
  const hasLeaveDeleteAccess = hasDeleteAccess(MENU_NAMES.LEAVEREQUEST);
  const hasLeaveCreateAccess = hasCreateAccess(MENU_NAMES.LEAVEREQUEST);

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  const handleApplyFilters = (result) => {
    if (result.data) {
      // Filter component returned filtered data
      setLeaveData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      // Reset case - restore original data
      setLeaveData(originalLeaveData);
    }
  };

  const onApprove = async () => {
    if (hasLeaveUpdateAccess) {
      if (!selectedLeave) return;

      setIsLoading(true);
      const updateLeave = {
        data: {
          leaveId: selectedLeave.leaveId,
          leaveStatus: "APPROVED",
        },
      };

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          toast.error("Authentication is missing.");
          return;
        }
        const response = await axiosInstance.put(
          "/api/leave/status",
          updateLeave,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response?.data?.responseCode === "200") {
          toast.success(response?.data?.message);
          fetchLeave();
          onClose();
        } else {
          const errorMessage =
            response?.data?.error?.errorList?.[0]?.errorMessage ||
            "Something went wrong";
          toast.error(errorMessage);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };

  const onReject = async (formData) => {
    if (hasLeaveUpdateAccess) {
      if (!selectedLeave) return;

      setIsLoading(true);
      const RejectLeave = {
        data: {
          leaveId: selectedLeave.leaveId,
          leaveStatus: "REJECTED",
          remark: formData.reason,
        },
      };
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          toast.error("Authentication is missing.");
          return;
        }
        const response = await axiosInstance.put(
          "/api/leave/status",
          RejectLeave,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response?.data?.responseCode === "200") {
          toast.success(response?.data?.message);
          fetchLeave();
          onRejectClose();
          reset();
        } else {
          const errorMessage =
            response?.data?.error?.errorList?.[0]?.errorMessage ||
            "Something went wrong";
          toast.error(errorMessage);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Something went wrong";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Currently You dont have access to this setting.");
    }
  };

  // Use API data if available
  const displayData = leaveData.length > 0 && leaveData;

  const getStatusClass = (status) => {
    if (status === "APPROVED")
      return "bg-green-100 border border-green-600 text-green-600";
    if (status === "REJECTED")
      return "bg-red-100 border border-red-600 text-red-600";
    return "bg-yellow-100 border border-yellow-500 text-yellow-500";
  };
  const navigateToAdd = () => {
    navigate("/Leave/addRequest");
  };

  const handleApplySearch = (result) => {
    if (result.data) {
      // Search component returned filtered data
      setLeaveData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      fetchLeave();
    }
  };
  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <div className="container px-2 md:px-8">
        {/**Page Section */}
        <div className="flex flex-col space-y-4">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <div className="flex flex-col justify-between sm:flex-row  items-start sm:items-center gap-2">
            <div className="flex items-center page-title -pl-2">
              <h1 className="page-title">Leave Status</h1>
            </div>
            <div className="flex gap-x-2 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <Search
                  onApplySearch={handleApplySearch}
                  className="w-full sm:w-auto"
                  url="/api/v1/leave_management/list"
                  searchFields={[
                    "fullName",
                    "departmentName",
                    "requestDate",
                    "leaveType",
                    "leaveStartDate",
                    "leaveEndDate",
                  ]}
                />
                <Filter
                  onApplyFilters={handleApplyFilters}
                  url="/api/v1/leave_management/list"
                  className="w-full sm:w-auto"
                />
                <ButtonComponent
                  className="bg-black text-white"
                  onPress={navigateToAdd}
                  content="Apply Leave"
                />
              </div>
            </div>
          </div>
        </div>

        {/**Table Section */}
        <div className="bg-white dark:bg-black rounded-lg p-2">
          {/* Large screens - Full table */}
          <div className="hidden lg:block">
            <div className="shadow-md rounded-lg   text-left">
              <Table bordered aria-label="Table of Leave" className="">
                <TableHeader>
                  <TableColumn>S.N</TableColumn>
                  <TableColumn>Full Name</TableColumn>
                  <TableColumn>Department</TableColumn>
                  <TableColumn>Request Date</TableColumn>
                  <TableColumn>Leave Type</TableColumn>
                  <TableColumn>Leave Start Date</TableColumn>
                  <TableColumn>Leave End Date</TableColumn>
                  <TableColumn>Status</TableColumn>
                  {/* <TableColumn>Approved by</TableColumn> */}
                </TableHeader>
                <TableBody
                  items={isLoading ? [] : leaveData}
                  isLoading={isLoading}
                  loadingContent={<SkeletonLoader />}>
                  {(item) => (
                    <TableRow
                      key={item.rclId}
                      className="h-14 border-b-2 border-gray-300">
                      <TableCell>{displayData.indexOf(item) + 1}</TableCell>
                      <TableCell>
                        {item.fullName.length < 7 ? (
                          item.fullName
                        ) : (
                          <Tooltip content={item.fullName}>
                            {truncateText(item.fullName, 7)}
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.departmentName.length < 7 ? (
                          item.departmentName
                        ) : (
                          <Tooltip content={item.departmentName}>
                            {truncateText(item.departmentName, 7)}
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>{item?.requestDate || "N/A"}</TableCell>
                      <TableCell>{item?.leaveType || "N/A"}</TableCell>
                      <TableCell>{item?.leaveStartDate || "N/A"}</TableCell>
                      <TableCell>{item?.leaveEndDate || "N/A"}</TableCell>
                      <TableCell>
                        {" "}
                        <div
                          className={`px-3 py-1.5 rounded-full text-xs font-medium text-center w-fit ${getStatusClass(
                            item?.leaveStatus
                          )}`}>
                          {item?.leaveStatus === "PENDING"
                            ? "Pending"
                            : item?.leaveStatus === "APPROVED"
                            ? "Approved"
                            : item?.leaveStatus === "REJECTED"
                            ? "Rejected"
                            : "N/A"}{" "}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Medium screens - Simplified table */}
          <div className="hidden md:block lg:hidden">
            <div className="shadow-md rounded-lg   text-left">
              <Table bordered aria-label="Table of Leave">
                <TableHeader>
                  <TableColumn>Leave</TableColumn>
                  <TableColumn>Date</TableColumn>
                  <TableColumn>Duration</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Team</TableColumn>
                </TableHeader>
                <TableBody
                  items={isLoading ? [] : leaveData}
                  isLoading={isLoading}
                  loadingContent={<SkeletonLoader />}>
                  {(item) => (
                    <TableRow key={item.rclId} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {item?.leaveType || "N/A"}
                          </span>
                          <span className="text-xs text-gray-500">
                            #{item.rclId}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>Start: {item?.leaveStartDate || "N/A"}</span>
                          <span>End: {item?.leaveEndDate || "N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span>{item?.Days || "N/A"} days</span>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`${getStatusClass(
                            item?.leaveStatus
                          )} text-center py-1 px-2 rounded-2xl* w-fit`}>
                          {item?.leaveStatus || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-md text-base ${getStatusClass(
                              item?.leaveStatus
                            )}`}>
                            {item?.teamLeaderName?.charAt(0) || "?"}
                          </div>
                          <div className="text-sm truncate max-w-20">
                            {item?.teamLeaderName || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Small screens - Card-like view */}
          <div className="block md:hidden">
            <div>
              <Accordion variant="bordered">
                {leaveData.map((leave) => (
                  <AccordionItem
                    key={leave.leaveId}
                    aria-label={`${leave.leaveType} - ${leave.leaveStatus}`}
                    title={
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium">
                          {leave.leaveType || "N/A"}
                        </span>
                        <div
                          className={`${getStatusClass(
                            leave?.leaveStatus
                          )} text-center py-1 px-2 text-xs rounded-md`}>
                          {leave?.leaveStatus || "N/A"}
                        </div>
                      </div>
                    }>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Request Date:</div>
                        <div>{leave?.requestDate || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Start Date:</div>
                        <div>{leave?.leaveStartDate || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">End Date:</div>
                        <div>{leave?.leaveEndDate || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Days:</div>
                        <div>{leave?.Days || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Team Leader:</div>
                        <div>{leave?.teamLeaderName || "N/A"}</div>
                      </div>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {!isLoading && (!leaveData || leaveData.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No Data available
            </div>
          )}

          {/**Pagination Section - Responsive for all screens */}
          {leaveData && leaveData.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm font-medium text-gray-600  flex items-center">
                <span className="mr-1">Showing:</span>
                <span className="font-bold text-gray-800 mx-1">
                  {totalRecords < leaveDataPerPage
                    ? totalRecords
                    : leaveDataPerPage}
                  {/* {leaveDataPerPage} */}
                </span>
                <span className="mr-1">of</span>
                <span className="font-bold text-gray-800">{totalRecords}</span>
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
                  onSelect={setLeaveDataPerPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        isDismissable={true}
        isKeyboardDismissDisabled={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Leave Approval</h3>
                  <p>Are you sure you want to approve this leave?</p>
                  {selectedLeave && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-gray-50 p-3 rounded-md space-y-2">
                      <div className="flex ">
                        <span className="font-medium">Team Lead:</span>
                        <span>{selectedLeave?.teamleadName}</span>
                      </div>
                      <div className="flex ">
                        <span className="font-medium">AssociateTeam Lead:</span>
                        <span>{selectedLeave?.associateteamleadName}</span>
                      </div>
                      <div className="flex ">
                        <span className="font-medium">Leave Type:</span>
                        <span>{selectedLeave?.leaveType}</span>
                      </div>
                      <div className="flex ">
                        <span className="font-medium">Start Date:</span>
                        <span>{selectedLeave?.leaveStartDate}</span>
                      </div>
                      <div className="flex ">
                        <span className="font-medium">End Date:</span>
                        <span>{selectedLeave?.leaveEndDate}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <Button
                    className="bg-black text-white"
                    onPress={() => onApprove()}>
                    Approve
                  </Button>
                  <Button onPress={onClose}>Cancel</Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectOpen}
        onOpenChange={onRejectOpenChange}
        isDismissable={true}
        size="4xl"
        isKeyboardDismissDisabled={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Leave Rejection</h3>
                  <p>Are you sure you want to reject this leave?</p>
                  {selectedLeave && (
                    <div className="bg-gray-50 p-3 rounded-md space-y-2">
                      <div className="flex ">
                        <span className="font-medium">Leave Type:</span>
                        <span>{selectedLeave?.leaveType}</span>
                      </div>
                      <div className="flex ">
                        <span className="font-medium">Start Date:</span>
                        <span>{selectedLeave?.leaveStartDate}</span>
                      </div>
                      <div className="flex ">
                        <span className="font-medium">End Date:</span>
                        <span>{selectedLeave?.leaveEndDate}</span>
                      </div>
                      <div className="flex ">
                        {selectedLeave.isHalfDay && (
                          <div>
                            <span className="font-medium">Half Day</span>
                            <span>{selectedLeave?.isHalfDay}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <form onSubmit={handleSubmit(onReject)}>
                  <TextAreaComp
                    name="reason"
                    label="Rejection Reason"
                    control={control}
                    placeholder="Enter reason for rejection"
                    rules={{
                      required: "Reason is required",
                      minLength: {
                        value: 10,
                        message: "Reason must be at least 10 characters long.",
                      },
                    }}
                  />
                  <div className="flex gap-2 justify-end mt-4">
                    <Button className="text-white bg-black" type="submit">
                      Reject
                    </Button>
                    <Button onPress={onClose}>Cancel</Button>
                  </div>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SelfLeaveStatus;
