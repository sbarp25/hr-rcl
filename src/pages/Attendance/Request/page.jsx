import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaRegEye } from "react-icons/fa";
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
} from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import DropDownComp from "../../../components/Dropdown";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import Search from "../../../components/Search";
import Filter from "../../../components/Filter";
import { IoIosPeople } from "react-icons/io";
import { useForm } from "react-hook-form";
import TextAreaComp from "../../../components/TextAreaComp";

const AttendanceRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lateCheckinData, setLateCheckinData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [lateCheckInDataPerPage, setLateCheckInDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [originalLateCheckInDataData, setOriginalLateCheckInDataData] =
    useState([]);
  const dropdownItems = [5, 10, 20, 30, 50, 100];
  const navigate = useNavigate();

  const { reset, handleSubmit, control } = useForm();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onOpenChange: onRejectOpenChange,
    onClose: onRejectClose,
  } = useDisclosure();

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);

  const handleAction = async (action, data) => {
    const selectedItem = lateCheckinData.find(
      (item) => item.lateCheckInId === data
    );
    setSelectedData(selectedItem);
    switch (action) {
      case "Approve":
        onOpen();
        break;
      case "Reject":
        onRejectOpen();
        break;
      default:
        console.log("Unknown action");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const menu = LocalStorageUtil.getItem("menu");
  /**To check create status */
  const hasemployeecreateaccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 1)
  );
  /**To read the Data */
  // const hasaccess = menu?.some((menu) =>
  //   menu.actionList.some((action) => action.actionId === 2)
  // );
  const hasaccess = true;
  const hasEmployeeEditAccess = true;
  /**To check edit status */
  // const hasEmployeeEditAccess = menu?.some((menu) =>
  //   menu.actionList.some((action) => action.actionId === 3)
  // );
  /**To check Delete Access */
  const hasEmployeeDeleteAccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 4)
  );

  const breadcrumbItems = [
    { label: "Attendance", href: "" },
    { label: "Late Checkin", href: "/Attendance/Request" },
  ];

  const handleApplyFilters = (result) => {
    console.log("Filter result:", result); // Add this debug line

    if (result.data) {
      // Filter component returned filtered data
      setLateCheckinData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      // Reset case - refetch original data
      const fetchLateCheckInData = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.post(
            "/api/v1/attendance/late-check-in/pending-reviews",
            {
              pageIndex: currentPage,
              pageSize: lateCheckInDataPerPage,
            }
          );

          if (response?.data?.responseCode === "200") {
            setOriginalLateCheckInDataData(response?.data?.datalist || []);
            setLateCheckinData(response?.data?.datalist || []);
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

      fetchLateCheckInData();
    }
  };

  const onApprove = async () => {
    if (!selectedData) return;

    setIsLoading(true);
    const updateLeave = {
      data: {
        lateAttendanceId: selectedData.lateCheckInId,
        isApproved: true,
      },
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Authentication is missing.");
        return;
      }
      const response = await axiosInstance.post(
        "/api/attendance/review_late_check_in",
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
        fetchLateCheckInData(); // Fixed: was calling lateCheckinData as a function
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

  const onReject = async () => {
    if (!selectedData) return;

    setIsLoading(true);
    const RejectLeave = {
      data: {
        lateAttendanceId: selectedData.lateCheckInId,
        isApproved: false,
      },
    };
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Authentication is missing.");
        return;
      }
      const response = await axiosInstance.post(
        "/api/attendance/review_late_check_in",
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
        fetchLateCheckInData(); // Fixed: was calling lateCheckinData as a function
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

  const fetchLateCheckInData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/api/v1/attendance/late-check-in/all-reviews",
        {
          // const response = await axiosInstance.post("/api/v1/auth/get/all", {
          pageIndex: currentPage,
          pageSize: lateCheckInDataPerPage,
        }
      );

      if (response?.data?.responseCode === "200") {
        setOriginalLateCheckInDataData(response?.data?.datalist || []);
        setLateCheckinData(response?.data?.datalist || []);
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
    fetchLateCheckInData();
  }, [currentPage, lateCheckInDataPerPage]);

  const toggleExpandedRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
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
              <Search />
              <Filter
                onApplyFilters={handleApplyFilters}
                // url="api/v1/attendance/late-check-in/all-reviews"
                url="api/v1/attendance/late-check-in/all-reviews"
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
      <div className="bg-white rounded-lg p-2">
        {/* Large screens - Full table */}
        <div className="hidden lg:block">
          <div className="shadow-md rounded-lg max-h-[80vh]  text-left">
            <Table bordered aria-label="List of Review for Late Checkin">
              <TableHeader>
                <TableColumn>S.N</TableColumn>
                <TableColumn>RCL-ID</TableColumn>
                {/* <TableColumn>Name</TableColumn> */}
                <TableColumn>Email</TableColumn>
                <TableColumn>Attendance Date</TableColumn>
                <TableColumn>Expected CheckInTime</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Actual checkInTime</TableColumn>
                <TableColumn>Justification</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {lateCheckinData
                  .filter((lateCHeckin) => lateCHeckin.status !== "APPROVED")
                  .map((late, index) => (
                    <TableRow
                      key={late.lateCheckInId}
                      className="h-14 border-b-2 border-gray-300">
                      <TableCell>
                        {(currentPage - 1) * lateCheckInDataPerPage + index + 1}
                      </TableCell>
                      <TableCell>{late.rclId}</TableCell>
                      {/* <TableCell>{late.fullName}</TableCell> */}
                      <TableCell>{late.email}</TableCell>
                      <TableCell>{late.attendanceDate}</TableCell>
                      <TableCell>{late.expectedCheckInTime}</TableCell>

                      <TableCell>
                        <div
                          className={`px-3 py-1.5 text-xs font-medium rounded-full text-center inline-flex items-center justify-center shadow-sm ${
                            late.isPending === true
                              ? "bg-green-100 border border-green-600 text-green-600"
                              : late.isPending === false
                              ? "bg-red-100 border border-red-600 text-red-600"
                              : "bg-yellow-100 border border-yellow-500 text-yellow-500"
                          } text-center p-2 w-fit`}>
                          {late.isApproved === true ? (
                            <span>Approved</span>
                          ) : late.isApproved === true ? (
                            <span>Rejected</span>
                          ) : (
                            <span>Pending</span>
                          )}
                        </div>
                        {/* {late.status} */}
                      </TableCell>
                      <TableCell>{late.checkInTime}</TableCell>
                      <TableCell>{late.lateReason}</TableCell>
                      <TableCell>
                        <div className="flex justify-between items-center">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              handleAction("view", late.lateCheckInId)
                            }>
                            <FaRegEye size={18} />
                          </button>
                          <div className="flex justify-center gap-4">
                            <FaCheck
                              className={`${
                                hasEmployeeEditAccess
                                  ? "text-orange-500 hover:text-orange-700 cursor-pointer"
                                  : ""
                              }`}
                              title="Edit"
                              onClick={() =>
                                handleAction("Approve", late.lateCheckInId)
                              }
                            />
                            <MdDelete
                              className={`${
                                hasEmployeeDeleteAccess
                                  ? "text-red-500 cursor-pointer hover:text-red-700"
                                  : ""
                              }`}
                              title="Delete"
                              onClick={() =>
                                handleAction("Reject", late.lateCheckInId)
                              }
                            />
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
          <div className="shadow-md rounded-lg max-h-[80vh]  text-left">
            <Table bordered aria-label="List of Review for Late Checkin">
              <TableHeader>
                <TableColumn>Employee</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Check In</TableColumn>
                <TableColumn>Reason</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {lateCheckinData.map((late, index) => (
                  <TableRow
                    key={late.lateCheckInId}
                    className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{late.fullName}</span>
                        <span className="text-xs text-gray-500">
                          {late.rclId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{late.attendanceDate}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>Expected: {late.expectedCheckInTime}</span>
                        <span>Actual: {late.checkInTime}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-[150px] truncate"
                        title={late.lateReason}>
                        {late.lateReason}
                      </div>
                    </TableCell>
                    <TableCell>
                      {late.status === "Pending" && (
                        <div className="flex justify-center gap-4">
                          <FaCheck
                            className={`${
                              hasEmployeeEditAccess
                                ? "text-orange-500 hover:text-orange-700 cursor-pointer"
                                : ""
                            }`}
                            title="Edit"
                            onClick={() =>
                              handleAction("Approve", late.lateCheckInId)
                            }
                          />
                          <MdDelete
                            className={`${
                              hasEmployeeDeleteAccess
                                ? "text-red-500 cursor-pointer hover:text-red-700"
                                : ""
                            }`}
                            title="Delete"
                            onClick={() =>
                              handleAction("Reject", late.lateCheckInId)
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
          <div className="space-y-4">
            {lateCheckinData.map((late, index) => (
              <div
                key={late.lateCheckInId}
                className="border rounded-lg overflow-hidden shadow-sm">
                <div
                  className="flex justify-between items-center p-3 cursor-pointer bg-gray-50"
                  onClick={() => toggleExpandedRow(late.lateCheckInId)}>
                  <div className="font-medium">{late.fullName}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {late.attendanceDate}
                    </span>
                    <FaChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedRow === late.lateCheckInId ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
                <div
                  className={`${
                    expandedRow === late.lateCheckInId ? "block" : "hidden"
                  } p-3 space-y-2 text-sm`}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">RCL-ID:</div>
                    <div>{late.rclId}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Email:</div>
                    <div className="truncate">{late.email}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Expected Time:</div>
                    <div>{late.expectedCheckInTime}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Actual Time:</div>
                    <div>{late.checkInTime}</div>
                  </div>
                  <div className="col-span-2 mt-2">
                    <div className="font-medium">Justification:</div>
                    <div className="mt-1 p-2 bg-gray-50 rounded">
                      {late.lateReason}
                    </div>
                  </div>
                  {late.status === "Pending" && (
                    <div className="flex justify-end gap-4 mt-2">
                      <Button
                        size="sm"
                        color="success"
                        className={`${
                          !hasEmployeeEditAccess
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onPress={() =>
                          hasEmployeeEditAccess &&
                          handleAction("Approve", late.lateCheckInId)
                        }
                        disabled={!hasEmployeeEditAccess}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        className={`${
                          !hasEmployeeDeleteAccess
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onPress={() =>
                          hasEmployeeDeleteAccess &&
                          handleAction("Reject", late.lateCheckInId)
                        }
                        disabled={!hasEmployeeDeleteAccess}>
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
        {lateCheckinData && lateCheckinData.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm font-medium text-gray-600 order-2 sm:order-1 flex items-center">
              <span className="mr-1">Showing</span>
              <span className="font-bold text-gray-800 mx-1">
                {lateCheckInDataPerPage}
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
        // isDismissable={true}
        placement="center"
        size="4xl"
        isKeyboardDismissDisabled={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    <p>Are you sure you want to approve this late checkin?</p>
                  </h3>
                  {selectedData && (
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
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
                        <p className="text-sm p-3 h-full bg-gray-50 rounded-md border border-gray-100 min-h-[60px]">
                          {selectedData?.lateReason ||
                            "No justification provided"}
                        </p>
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
                    <p>Are you sure you want to reject this late checkin?</p>
                  </h3>
                  {selectedData && (
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
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
                        <p className="text-sm p-3 h-full bg-gray-50 rounded-md border border-gray-100 min-h-[60px]">
                          {selectedData?.lateReason ||
                            "No justification provided"}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* <TextAreaComp
                    control={control}
                    name="RejectReason"
                    label="Reason To Reject This leave"
                    rules={{
                      required: "reason is required",
                      minLength: {
                        value: 10,
                        message: "Reason must be at least 10 characters long.",
                      },
                    }}
                  /> */}
                  <div className="flex gap-2 justify-end mt-4">
                    <Button
                      className="bg-black text-white"
                      type="submit"
                      // onPress={onReject}
                    >
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

export default AttendanceRequest;
