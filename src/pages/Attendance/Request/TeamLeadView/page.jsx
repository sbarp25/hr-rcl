import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
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
  Tooltip,
} from "@heroui/react";
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { IoIosPeople, IoIosRemoveCircle } from "react-icons/io";
import { useForm } from "react-hook-form";

import {
  hasApproveAccess,
  hasReadAccess,
  hasUpdateAccess,
  MENU_NAMES,
} from "../../../../utils/permissionUtils.js";
import {
  useFetchTeamLateCheckin,
  useLateCheckInApprove,
  useLateCheckinReject,
} from "../../../../hooks/useAuth.js";
import { toast } from "sonner";
import Loader from "../../../../components/Loader/Loader.jsx";
import BreadcrumbsComponent from "../../../../components/ui/BreadCrumbsComp.jsx";
import Search from "../../../../components/Search.jsx";
import Filter from "../../../../components/Filter.jsx";

const TeamLeadLateCheckin = () => {
  const [filteredData, setFilteredData] = useState(null);
  const [filteredPagination, setFilteredPagination] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedData, setSelectedData] = useState(null);
  const [lateCheckInDataPerPage, setLateCheckInDataPerPage] = useState(10);
  const dropdownItems = [5, 10, 20, 30, 50, 100];
  const navigate = useNavigate();

  const { reset, handleSubmit } = useForm();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onOpenChange: onRejectOpenChange,
    onClose: onRejectClose,
  } = useDisclosure();

  const breadcrumbItems = [
    { label: "Attendance", href: "" },
    { label: "Late Checkin", href: "/Attendance/Request" },
  ];

  /**Permission Check */
  const hasAttendanceEditAccess = hasApproveAccess(MENU_NAMES.LATECHECKIN);
  const hasaccess = hasApproveAccess(MENU_NAMES.LATECHECKIN);
  // const hasaccess = true;
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);

  const { data, isLoading, refetch } = useFetchTeamLateCheckin(
    currentPage,
    lateCheckInDataPerPage
  );

  const lateCheckinData = filteredData || data?.datalist || [];
  const totalPages = filteredPagination?.totalPages || data?.totalPages || 1;
  const totalRecords =
    filteredPagination?.totalRecords || data?.totalRecords || 0;

  const approveMutation = useLateCheckInApprove();
  // const { mutateAsync, isPending } = useLateCheckInApprove();
  const rejectMutation = useLateCheckinReject();

  // Reset filtered data when page size changes
  useEffect(() => {
    setFilteredData(null);
    setFilteredPagination(null);
  }, [currentPage, lateCheckInDataPerPage]);

  const handlePageChange = (page) => {
    //To change the page as well as to reset the data
    setCurrentPage(page);
    setFilteredData(null);
    setFilteredPagination(null);
  };

  const handleApplyFilters = (result) => {
    if (result.data) {
      setFilteredData(result.data);
      setFilteredPagination({
        totalPages: result.totalPages,
        totalRecords: result.totalRecords,
      });
    } else {
      // Reset case - refetch original data
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

  const handleAction = async (action, dataId) => {
    const item = lateCheckinData.find((item) => item.lateCheckInId === dataId);
    setSelectedData(item);
    switch (action) {
      case "Approve":
        if (hasAttendanceEditAccess) {
          onOpen();
        }
        break;
      case "Reject":
        if (hasAttendanceEditAccess) {
          onRejectOpen();
        }
        break;
      default:
        console.log("Unknown action");
    }
  };
  const onApprove = async () => {
    if (!selectedData) return;

    const updateLeave = {
      data: {
        lateAttendanceId: selectedData.lateCheckInId,
        isApproved: true,
      },
    };

    try {
      await approveMutation.mutateAsync(updateLeave);
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    }
  };

  const onReject = async () => {
    if (!selectedData) return;

    const RejectLeave = {
      data: {
        lateAttendanceId: selectedData.lateCheckInId,
        isApproved: false,
      },
    };

    try {
      await rejectMutation.mutateAsync(RejectLeave);
      onRejectClose();
      reset();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        error.message ||
        "Something went wrong. Try again.";
      toast.error(errorMessage);
    }
  };
  const toggleExpandedRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? `${text?.slice(0, maxLength)}` : text;
  return (
    <div className="max-h-[85vh] overflow-y-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="px-2 md:px-8 max-h-[85vh] space-y-4">
          <div className="flex flex-col space-y-4">
            <div className="text-sm">
              <BreadcrumbsComponent items={breadcrumbItems} />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center page-title -pl-2">
                <IoIosPeople className="text-2xl" />
                <span className="page-title">Late Check in</span>
              </div>
              <div className="flex gap-x-2 w-full sm:w-auto">
                <div className="flex flex-col justify-between sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <Search
                    onApplySearch={handleApplySearch}
                    url="/api/v1/attendance/late-check-in/late-attendance/by-role"
                    searchFields={[
                      "rclId",
                      "departmentName",
                      "email",
                      "attendanceDate",
                      "expectedCheckInTime",
                      "status",
                      "checkInTime",
                      "lateReason",
                    ]}
                    placeholder="Search employees..."
                  />
                  <Filter
                    onApplyFilters={handleApplyFilters}
                    // url="api/v1/attendance/late-check-in/all-reviews"
                    // url="api/v1/attendance/late-check-in/all-reviews"
                    url="/api/v1/attendance/late-check-in/late-attendance/by-role"
                    fieldNames={{
                      departmentField: "departmentId",
                      fromDateField: "createdAt",
                      toDateField: "createdto",
                      positionField: "positionId",
                    }}
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-black rounded-lg p-2">
            {/* Large screens - Full table */}
            <div className="hidden lg:block">
              <div className="shadow-md rounded-lg  text-left">
                <Table bordered aria-label="List of Review for Late Checkin">
                  <TableHeader>
                    <TableColumn>S.N</TableColumn>
                    <TableColumn>RCL-ID</TableColumn>
                    <TableColumn>Department</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Attendance Date</TableColumn>
                    <TableColumn>Expected CheckInTime</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Actual CheckInTime</TableColumn>
                    <TableColumn>Justification</TableColumn>
                    <TableColumn>Actions</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {lateCheckinData
                      ?.filter(
                        (lateCHeckin) => lateCHeckin?.status !== "APPROVED"
                      )
                      ?.map((late, index) => (
                        <TableRow
                          key={late?.lateCheckInId}
                          className="h-14 border-b-2 border-gray-300">
                          <TableCell>
                            {(currentPage - 1) * lateCheckInDataPerPage +
                              index +
                              1}
                          </TableCell>
                          <TableCell>
                            {late?.rclId?.length < 7 ? (
                              late?.rclId
                            ) : (
                              <Tooltip content={late?.rclId}>
                                {truncateText(late?.rclId, 7)}
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>
                            {late?.departmentName?.length < 7 ? (
                              late?.departmentName
                            ) : (
                              <Tooltip content={late?.departmentName}>
                                {truncateText(late?.departmentName, 7) || "N/A"}
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>
                            {late?.email?.length < 7 ? (
                              late?.email
                            ) : (
                              <Tooltip content={late?.email}>
                                {truncateText(late?.email, 7)}
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>{late?.attendanceDate}</TableCell>
                          <TableCell>{late?.expectedCheckInTime}</TableCell>

                          <TableCell>
                            <div
                              className={`px-3 py-1.5 text-xs font-medium rounded-full text-center inline-flex items-center justify-center shadow-sm ${
                                late?.status === "APPROVED"
                                  ? "bg-green-100 border border-green-600 text-green-600"
                                  : late?.status === "REJECTED"
                                  ? "bg-red-100 border border-red-600 text-red-600"
                                  : "bg-yellow-100 border border-yellow-500 text-yellow-500"
                              } text-center p-2 w-fit`}>
                              {late?.status === "APPROVED" ? (
                                <span>Approved</span>
                              ) : late?.status === "REJECTED" ? (
                                <span>Rejected</span>
                              ) : (
                                <span>Pending</span>
                              )}
                            </div>
                            {/* {late?.status} */}
                          </TableCell>
                          <TableCell>
                            {late?.checkInTime?.length < 5 ? (
                              late?.checkInTime
                            ) : (
                              <Tooltip content={late?.checkInTime}>
                                {truncateText(late?.checkInTime, 7)}
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>
                            {" "}
                            {late?.lateReason?.length < 5 ? (
                              late?.lateReason
                            ) : (
                              <Tooltip content={late?.lateReason}>
                                {truncateText(late?.lateReason, 7)}
                              </Tooltip>
                            )}
                            {/* {late?.lateReason} */}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-between items-center">
                              <div className="flex justify-center gap-4">
                                <Button
                                  className="bg-black text-white"
                                  onPress={() => {
                                    setSelectedData(late);
                                    onOpen();
                                  }}>
                                  Action
                                </Button>
                              </div>
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
              <div className="shadow-md rounded-lg  overflow-y-auto text-left">
                <Table bordered aria-label="List of Review for Late Checkin">
                  <TableHeader>
                    <TableColumn>Employee</TableColumn>
                    <TableColumn>Department</TableColumn>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Check In</TableColumn>
                    <TableColumn>Reason</TableColumn>
                    <TableColumn>Actions</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {lateCheckinData
                      ?.filter(
                        (lateCHeckin) => lateCHeckin?.status !== "APPROVED"
                      )
                      .map((late) => (
                        <TableRow
                          key={late?.lateCheckInId}
                          className="hover:bg-gray-50 dark:hover:bg-slate-500">
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{late?.fullName}</span>
                              <span className="text-xs text-gray-500">
                                {late?.rclId}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {late?.departmentName.length < 7 ? (
                              late?.departmentName
                            ) : (
                              <Tooltip content={late?.departmentName}>
                                {truncateText(late?.departmentName, 7)}
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell>{late?.attendanceDate}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>Expected: {late?.expectedCheckInTime}</span>
                              <span>Actual: {late?.checkInTime}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className="max-w-[150px] truncate"
                              title={late?.lateReason}>
                              {late?.lateReason}
                            </div>
                          </TableCell>
                          <TableCell>
                            {late?.status === "PENDING" && (
                              <div className="flex justify-center gap-4">
                                <FaCheck
                                  className={`${
                                    hasAttendanceEditAccess
                                      ? "text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                                      : "text-gray-500 dark:text-slate-500"
                                  }`}
                                  title="Edit"
                                  onClick={() =>
                                    handleAction("Approve", late?.lateCheckInId)
                                  }
                                />
                                <MdDelete
                                  className={`${
                                    hasAttendanceEditAccess
                                      ? "text-red-500 cursor-pointer hover:text-red-700"
                                      : ""
                                  }`}
                                  title="Delete"
                                  onClick={() =>
                                    handleAction("Reject", late?.lateCheckInId)
                                  }
                                />
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Small screens - Card-like view */}
            <div className="block md:hidden">
              <div className="space-y-4 overflow-y-auto">
                {lateCheckinData
                  .filter((lateCHeckin) => lateCHeckin?.status !== "APPROVED")
                  .map((late) => (
                    <div
                      key={late?.lateCheckInId}
                      className="border rounded-lg overflow-hidden shadow-sm">
                      <div
                        className="flex justify-between items-center p-3 cursor-pointer bg-gray-50  dark:bg-black"
                        onClick={() => toggleExpandedRow(late?.lateCheckInId)}>
                        <div className="font-medium">{late?.fullName}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-white">
                            {late?.attendanceDate}
                          </span>
                          <FaChevronDown
                            size={16}
                            className={`transition-transform ${
                              expandedRow === late?.lateCheckInId
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </div>
                      </div>
                      <div
                        className={`${
                          expandedRow === late?.lateCheckInId
                            ? "block"
                            : "hidden"
                        } p-3 space-y-2 text-sm`}>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">RCL-ID:</div>
                          <div>{late?.rclId}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Email:</div>
                          <div className="truncate">{late?.email}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Department:</div>
                          <div className="truncate">
                            {late?.departmentName.length < 7 ? (
                              late?.departmentName
                            ) : (
                              <Tooltip content={late?.departmentName}>
                                {truncateText(late?.departmentName, 7)}
                              </Tooltip>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Expected Time:</div>
                          <div>{late?.expectedCheckInTime}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Actual Time:</div>
                          <div>{late?.checkInTime}</div>
                        </div>
                        <div className="col-span-2 mt-2">
                          <div className="font-medium">Justification:</div>
                          <div className="mt-1 p-2 bg-gray-50 dark:bg-black rounded">
                            {late?.lateReason}
                          </div>
                        </div>
                        {late?.status === "Pending" && (
                          <div className="flex justify-end gap-4 mt-2">
                            <Button
                              size="sm"
                              color="success"
                              className={`${
                                !hasAttendanceEditAccess
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onPress={() =>
                                hasAttendanceEditAccess &&
                                handleAction("Approve", late?.lateCheckInId)
                              }
                              disabled={!hasAttendanceEditAccess}>
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              className={`${
                                !hasAttendanceEditAccess
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onPress={() =>
                                hasAttendanceEditAccess &&
                                handleAction("Reject", late?.lateCheckInId)
                              }
                              disabled={!hasAttendanceEditAccess}>
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                {(!lateCheckinData || lateCheckinData.length === 0) && (
                  <div className="p-8 text-center text-gray-500">
                    No Data available
                  </div>
                )}
              </div>
            </div>

            {/* Pagination - Responsive for all screens */}
            {!lateCheckinData && lateCheckinData.length > 0 && (
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-sm font-medium text-gray-800 dark:text-white order-2 sm:order-1 flex items-center">
                  <span className="mr-1">Showing</span>
                  <span className="font-bold  mx-1">
                    {Math.min(totalRecords, lateCheckInDataPerPage)}
                  </span>
                  <span className="mr-1">of</span>
                  <span className="font-bold ">{totalRecords}</span>
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
                    onSelect={setLateCheckInDataPerPage}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Approve Modal */}
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="center"
            size="4xl"
            isKeyboardDismissDisabled={false}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        <p>Late Check-In Status</p>
                      </h3>
                      {selectedData && (
                        <div className="bg-white dark:bg-black p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
                          {/**Personal details */}
                          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-1 pb-2 border-b border-gray-100">
                            <div className="flex  items-center">
                              <span className="font-semibold text-gray-700 dark:text-white">
                                Employee:
                              </span>
                              <span className="text-gray-800 dark:text-white">
                                {selectedData?.fullName}
                              </span>
                            </div>
                            <div className="flex  items-center">
                              <span className="font-semibold text-gray-700 dark:text-white">
                                RCL-ID:
                              </span>
                              <span className="font-mono text-gray-800 dark:text-white">
                                {selectedData?.rclId}
                              </span>
                            </div>
                          </div>
                          {/**Date and Time */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-1 pb-2 border-b border-gray-100">
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-700 dark:text-white">
                                Date:
                              </span>
                              <span className="text-gray-800 dark:text-white">
                                {selectedData?.attendanceDate}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <span className="font-semibold text-gray-700 dark:text-white">
                                Expected Time:
                              </span>
                              <span className="text-gray-800 dark:text-white">
                                {selectedData?.expectedCheckInTime || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-700 dark:text-white">
                                Actual Time:
                              </span>
                              <span className="text-gray-800 dark:text-white">
                                {selectedData?.checkInTime}
                              </span>
                            </div>
                          </div>
                          {/**Justification  */}
                          <div className="flex flex-col h-60">
                            <span className="font-semibold text-gray-700 dark:text-white mb-2">
                              Justification:
                            </span>
                            <p className="text-sm p-3 h-full bg-gray-50 dark:bg-black rounded-md border border-gray-100 min-h-[60px]">
                              {selectedData?.lateReason ||
                                "No justification provided"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 justify-end mt-4">
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50  dark:bg-black shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-700 dark:text-white">
                            Team Lead:
                          </span>
                          {selectedData?.approvedByTeamLead === true ? (
                            <FaCircleCheck className="text-green-500 w-5 h-5" />
                          ) : selectedData?.rejectedByTeamLead === true ? (
                            <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
                          ) : (
                            <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-2xl border-2 border-yellow-300">
                              Pending
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-gray-700 dark:text-white">
                            Associate Team Lead:
                          </span>
                          {selectedData?.approvedByAssociateTeamLead ===
                          true ? (
                            <FaCircleCheck className="text-green-500 w-5 h-5" />
                          ) : selectedData?.rejectedByAssociateTeamLead ===
                            true ? (
                            <IoIosRemoveCircle className="text-red-500 w-5 h-5" />
                          ) : (
                            <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-2xl border-2 border-yellow-300">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        className="bg-black dark:bg-white dark:text-black text-white"
                        onPress={() => onApprove()}>
                        Approve
                      </Button>
                      <Button color="danger" type="submit" onPress={onReject}>
                        Reject
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
            size="4xl"
            onOpenChange={onRejectOpenChange}
            // isDismissable={true}
            placement="center"
            isKeyboardDismissDisabled={false}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody>
                    <form onSubmit={handleSubmit(onReject)}>
                      <h3 className="text-lg font-medium">
                        <p>
                          Are you sure you want to reject this late checkin?
                        </p>
                      </h3>
                      {selectedData && (
                        <div className="bg-white dark:bg-black p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
                          {/**Personal details */}
                          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-1 pb-2 border-b border-gray-100">
                            <div className="flex  items-center">
                              <span className="font-semibold text-gray-700">
                                Employee:
                              </span>
                              <span className="text-gray-800">
                                {selectedData?.fullName}
                              </span>
                            </div>
                            <div className="flex  items-center">
                              <span className="font-semibold text-gray-700">
                                RCL-ID:
                              </span>
                              <span className="font-mono text-gray-800">
                                {selectedData?.rclId}
                              </span>
                            </div>
                          </div>
                          {/**Date and Time */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-1 pb-2 border-b border-gray-100">
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-700">
                                Date:
                              </span>
                              <span className="text-gray-800">
                                {selectedData?.attendanceDate}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <span className="font-semibold text-gray-700">
                                Expected Time:
                              </span>
                              <span className="text-gray-800">
                                {selectedData?.expectedCheckInTime || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-700">
                                Actual Time:
                              </span>
                              <span className="text-gray-800">
                                {selectedData?.checkInTime}
                              </span>
                            </div>
                          </div>
                          {/**Justification  */}
                          <div className="flex flex-col h-60">
                            <span className="font-semibold text-gray-700 mb-2">
                              Justification:
                            </span>
                            <p className="text-sm p-3 h-full bg-gray-50  dark:bg-black rounded-md border border-gray-100 min-h-[60px]">
                              {selectedData?.lateReason ||
                                "No justification provided"}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 justify-end mt-4">
                        <Button
                          className="bg-black dark:bg-white dark:text-black text-white"
                          type="submit">
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
      )}
    </div>
  );
};

export default TeamLeadLateCheckin;
