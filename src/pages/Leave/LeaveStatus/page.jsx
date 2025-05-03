import {
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
  useDisclosure,
} from "@nextui-org/react";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import { useEffect, useState } from "react";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import DropDownComp from "../../../components/Dropdown";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../../../components/SkeletonLoader";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import { FaCheckCircle, FaRegEye, FaChevronDown } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import TextAreaComp from "../../../components/TextAreaComp";
import Search from "../../../components/Search";
import Filter from "../../../components/Filter";

const LeaveStatus = () => {
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

  const handlePageChange = (page) => {
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
  }, [currentPage, leaveDataPerPage]);
  // }, []);

  const menu = LocalStorageUtil.getItem("menu");
  const hasLeaveApproveAccess = false;
  const hasLeaveViewAccess = false;

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

  const handleAction = (action, data) => {
    setSelectedLeave(data);
    switch (action) {
      case "approve":
        onOpen();
        break;
      case "reject":
        onRejectOpen();
        break;
      case "view":
        navigate(`/Leave/view/${data.rclId}`);
        break;
      default:
        console.log("Unknown action");
    }
  };

  const onApprove = async () => {
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
  };

  const onReject = async (formData) => {
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

  return (
    <>
      <div className="container px-2 md:px-8 max-h-[85vh] space-y-4">
        {/**Page Section */}
        <div className="flex flex-col space-y-4">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <div className="flex flex-col justify-between sm:flex-row  items-start sm:items-center gap-2">
            <div className="flex items-center page-title -pl-2">
              <h1 className="page-title">Applied Leaves</h1>
            </div>
            <div className="flex gap-x-2 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <Search className="w-full sm:w-auto" />
                <Filter
                  onApplyFilters={handleApplyFilters}
                  url="/api/leave/all"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/**Table Section */}
        <div className="bg-white rounded-lg p-2">
          {/* Large screens - Full table */}
          <div className="hidden lg:block">
            <div className="shadow-md rounded-lg max-h-[80vh]  text-left">
              <Table
                bordered
                aria-label="Table of Leave"
                className="max-h-[75vh]">
                <TableHeader>
                  <TableColumn>S.N</TableColumn>
                  <TableColumn>Full Name</TableColumn>
                  <TableColumn>Request Date</TableColumn>
                  <TableColumn>Leave Type</TableColumn>
                  <TableColumn>Leave Start Date</TableColumn>
                  <TableColumn>Leave End Date</TableColumn>
                  <TableColumn>Status</TableColumn>
                  {/* <TableColumn>Approved by</TableColumn> */}
                  <TableColumn>Action</TableColumn>
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
                      <TableCell>{item?.fullName || "N/A"}</TableCell>
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

                      {/* <TableCell>
                        <div className="flex items-center gap-3 p-2 rounded-lg">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-md text-lg ${getStatusClass(
                              item?.leaveStatus
                            )}`}>
                            {item?.approvedBy?.charAt(0) ||
                              item?.rejectedBy?.charAt(0) ||
                              "?"}
                          </div>
                          <div>
                            {item?.approvedBy || item?.rejectedBy || "N/A"}
                          </div>
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleAction("view", item)}>
                            <FaRegEye size={18} />
                          </button>
                          {item?.leaveStatus === "PENDING" &&
                            hasLeaveApproveAccess && (
                              <>
                                <FaCheckCircle
                                  className="text-xl text-orange-500 hover:text-orange-700 cursor-pointer"
                                  onClick={() => handleAction("approve", item)}
                                />
                                <FaXmark
                                  className="text-xl text-red-600 hover:text-red-800 cursor-pointer"
                                  onClick={() => handleAction("reject", item)}
                                />
                              </>
                            )}
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
            <div className="shadow-md rounded-lg max-h-[80vh]  text-left">
              <Table bordered aria-label="Table of Leave">
                <TableHeader>
                  <TableColumn>Leave</TableColumn>
                  <TableColumn>Date</TableColumn>
                  <TableColumn>Duration</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Team</TableColumn>
                  <TableColumn>Action</TableColumn>
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
                          )} text-center py-1 px-2 rounded-md w-fit`}>
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

                      <TableCell>
                        <div className="flex gap-2">
                          {item?.leaveStatus === "PENDING" &&
                            hasLeaveApproveAccess && (
                              <>
                                <FaCheckCircle
                                  className="text-lg text-orange-600 hover:text-orange-800 cursor-pointer"
                                  onClick={() => handleAction("approve", item)}
                                />
                                <FaXmark
                                  className="text-lg text-red-600 hover:text-red-800 cursor-pointer"
                                  onClick={() => handleAction("reject", item)}
                                />
                              </>
                            )}
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
            <div className="space-y-4">
              {leaveData.map((leave) => (
                <div
                  key={leave.rclId}
                  className="border rounded-lg overflow-hidden shadow-sm">
                  <div
                    className="flex justify-between items-center p-3 cursor-pointer bg-gray-50"
                    onClick={() => toggleExpandedRow(leave.rclId)}>
                    <div className="font-medium">
                      {leave.leaveType || "N/A"}
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`${getStatusClass(
                          leave?.leaveStatus
                        )} text-center py-1 px-2 text-xs rounded-md w-fit`}>
                        {leave?.leaveStatus || "N/A"}
                      </div>
                      <FaChevronDown
                        size={16}
                        className={`transition-transform ${
                          expandedRow === leave.rclId ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                  <div
                    className={`${
                      expandedRow === leave.rclId ? "block" : "hidden"
                    } p-3 space-y-2 text-sm`}>
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
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Approver:</div>
                      <div>{leave?.approvedBy || "N/A"}</div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      {leave?.leaveStatus === "PENDING" &&
                        hasLeaveApproveAccess && (
                          <>
                            <Button
                              size="sm"
                              color="success"
                              onPress={() => handleAction("approve", leave)}>
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              onPress={() => handleAction("reject", leave)}>
                              Reject
                            </Button>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              ))}
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
                  {leaveDataPerPage}
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
    </>
  );
};

export default LeaveStatus;
