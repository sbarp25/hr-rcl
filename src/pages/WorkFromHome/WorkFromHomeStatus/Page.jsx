import { useEffect, useState } from "react";
import BreadcrumbsComponent from "../../../components/ui/BreadCrumbsComp.jsx";
import Search from "../../../components/Search";
import Filter from "../../../components/Filter";
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
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import SkeletonLoader from "../../../components/Loader/SkeletonLoader.jsx";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaCheckCircle, FaChevronDown, FaRegEye } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import DropDownComp from "../../../components/ui/Dropdown.jsx";
import { toast } from "sonner";
import axiosInstance from "../../../lib/axios-Instance";
import TextAreaComp from "../../../components/ui/TextAreaComp.jsx";
import axios from "axios";
import truncateText from "../../../utils/truncateText";

const WorkFromHomeStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkFromHome, setSelectedWorkFromHome] = useState(null);
  const [workFromHome, setWorkFromHome] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [WFHDataPerPage, setWFHDataPerPage] = useState(10);
  const [originalWorkFromHomeData, setOriginalLeaveData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onOpenChange: onRejectOpenChange,
    onClose: onRejectClose,
  } = useDisclosure();
  const navigate = useNavigate();

  const { reset, control, handleSubmit } = useForm();
  const breadcrumbItems = [
    { label: "WFH", href: "" },
    { label: "WFH Status", href: "/WFH/Status" },
  ];

  const handleApplyFilters = (result) => {
    if (result.data) {
      // Filter component returned filtered data
      setWorkFromHome(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      // Reset case - restore original data
      setWorkFromHome(originalWorkFromHomeData);
    }
  };

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const displayData = workFromHome.length > 0 && workFromHome;

  const handleAction = (action, data) => {
    setSelectedWorkFromHome(data);
    switch (action) {
      case "approve":
        onOpen();
        break;
      case "reject":
        onRejectOpen();
        break;
      case "view":
        navigate(`/WRH/view/${data.rclId}`);
        break;
      default:
        console.log("Unknown action");
    }
  };

  const onApprove = async () => {
    if (!selectedWorkFromHome) return;

    setIsLoading(true);
    const updateWFH = {
      data: {
        workFromHomeId: selectedWorkFromHome.workFromHomeId,
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
        "/api/work_from_home/review",
        updateWFH,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response?.data?.responseCode === "200") {
        toast.success(response?.data?.message);
        fetchWorkFromHome();
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
    if (!selectedWorkFromHome) return;

    setIsLoading(true);
    const RejectLeave = {
      data: {
        workFromHomeId: selectedWorkFromHome.workFromHomeId,
        isApproved: false,
        remark: formData.reason,
      },
    };
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Authentication is missing.");
        return;
      }
      const response = await axiosInstance.post(
        "/api/work_from_home/review",
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
        fetchWorkFromHome();
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

  const getStatusClass = (status) => {
    if (status === "APPROVED")
      return "bg-green-100 border border-green-600 text-green-600";
    if (status === "REJECTED")
      return "bg-red-100 border border-red-600 text-red-600";
    return "bg-yellow-100 border border-yellow-500 text-yellow-500";
  };

  const toggleExpandedRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handlePageChange = (page) => {
    setWorkFromHome([]);
    setCurrentPage(page);
  };

  const fetchWorkFromHome = async () => {
    setIsLoading(true);
    try {
      // const response = await axiosInstance.post(`/api/v1/work_from_home/list`, {
      //   pageIndex: currentPage,
      //   pageSize: WFHDataPerPage,
      // });
      const response = await axiosInstance.get(`/api/work_from_home/requests`);
      if (response.data.responseCode === "200") {
        setWorkFromHome(response.data.datalist);
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
    fetchWorkFromHome();
  }, [currentPage, WFHDataPerPage]);

  const menu = LocalStorageUtil.getItem("menu");
  const hasWorkFromHomeReviewAccess = menu?.some((menu) =>
    menu?.actions?.some((action) => action.actionId === 81)
  );
  const hasLeaveViecwAccess = false;

  const handleApplySearch = (result) => {
    if (result.data) {
      // Search component returned filtered data
      setOriginalLeaveData(result.data);
      if (result.totalPages) setTotalPages(result.totalPages);
      if (result.totalRecords) setTotalRecords(result.totalRecords);
    } else {
      fetchWorkFromHome();
    }
  };
  return (
    <div>
      {" "}
      <>
        <div className="container px-2 md:px-8 max-h-[85vh] space-y-4">
          {/**Page Section */}
          <div className="flex flex-col space-y-4">
            <div className="text-sm">
              <BreadcrumbsComponent items={breadcrumbItems} />
            </div>
            <div className="flex flex-col justify-between sm:flex-row  items-start sm:items-center gap-2">
              <div className="flex items-center page-title -pl-2">
                <h1 className="page-title">Applied WFH</h1>
              </div>
              <div className="flex gap-x-2 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <Search
                    onApplySearch={handleApplySearch}
                    url="/api/work_from_home/review"
                    searchFields={[
                      "fullName",
                      "email",
                      "rclId",
                      "Department",
                      "position",
                    ]}
                    placeholder="Search Employee..."
                  />
                  <Filter
                    onApplyFilters={handleApplyFilters}
                    url="/api/work_from_home/review"
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
              <div className="shadow-md rounded-lg max-h-[80vh] overflow-y-auto text-left">
                <Table
                  bordered
                  aria-label="Table of Leave"
                  className="max-h-[75vh]">
                  <TableHeader>
                    <TableColumn>S.N</TableColumn>
                    <TableColumn>Full Name</TableColumn>
                    <TableColumn>Department</TableColumn>
                    <TableColumn>Request Date</TableColumn>{" "}
                    <TableColumn>WRH Start Date</TableColumn>
                    <TableColumn>WRH End Date</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Action</TableColumn>
                  </TableHeader>
                  <TableBody
                    items={isLoading ? [] : workFromHome}
                    isLoading={isLoading}
                    // loadingState={isLoading}
                    loadingContent={<SkeletonLoader />}>
                    {(item) => (
                      <TableRow
                        key={item.rclId}
                        className="h-14 border-b-2 border-gray-300">
                        <TableCell>{displayData.indexOf(item) + 1}</TableCell>
                        <TableCell>
                          {item?.userFullName.length < 7 ? (
                            item?.userFullName
                          ) : (
                            <Tooltip content={item?.userFullName}>
                              {truncateText(item?.userFullName, 7)}
                            </Tooltip>
                          )}
                        </TableCell>

                        <TableCell>
                          {item?.departmentName.length < 7 ? (
                            item?.departmentName
                          ) : (
                            <Tooltip content={item?.departmentName}>
                              {truncateText(item?.departmentName, 7)}
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell>{item?.requestDate || "N/A"}</TableCell>

                        <TableCell>
                          {item?.workFromHomeStartDate || "N/A"}
                        </TableCell>
                        <TableCell>
                          {item?.workFromHomeEndDate || "N/A"}
                        </TableCell>
                        <TableCell>
                          {" "}
                          <div
                            className={`px-3 py-1.5 rounded-full text-xs font-medium text-center w-fit ${getStatusClass(
                              item?.approvalStatus
                            )}`}>
                            {item?.approvalStatus === "PENDING"
                              ? "Pending"
                              : item?.approvalStatus === "APPROVED"
                              ? "Approved"
                              : item?.approvalStatus === "REJECTED"
                              ? "Rejected"
                              : "N/A"}{" "}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            {/* <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => handleAction("view", item)}>
                              <FaRegEye size={18} />
                            </button> */}
                            {item?.approvalStatus === "PENDING" &&
                              hasWorkFromHomeReviewAccess && (
                                <>
                                  <FaCheckCircle
                                    className="text-xl text-orange-500 hover:text-orange-700 cursor-pointer"
                                    onClick={() =>
                                      handleAction("approve", item)
                                    }
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
              <div className="shadow-md rounded-lg max-h-[80vh] overflow-y-auto text-left">
                <Table bordered aria-label="Table of Leave">
                  <TableHeader>
                    <TableColumn>Full Name</TableColumn>
                    <TableColumn>Start Date</TableColumn>
                    <TableColumn>End Date</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Action</TableColumn>
                  </TableHeader>
                  <TableBody
                    items={isLoading ? [] : workFromHome}
                    isLoading={isLoading}
                    loadingContent={<SkeletonLoader />}>
                    {(item) => (
                      <TableRow
                        key={Math.random()}
                        className="hover:bg-gray-50">
                        <TableCell>{item?.fullName}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{item?.workFromHomeStartDate || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span>{item?.workFromHomeEndDate || "N/A"}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-md text-base ${getStatusClass(
                                item?.approvalStatus
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
                            {item?.approvalStatus === "PENDING" &&
                              hasWorkFromHomeReviewAccess && (
                                <>
                                  <FaCheckCircle
                                    className="text-lg text-orange-600 hover:text-orange-800 cursor-pointer"
                                    onClick={() =>
                                      handleAction("approve", item)
                                    }
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
            <div className="block md:hidden overflow-y-auto">
              <div className="space-y-4">
                {workFromHome.map((WFH) => (
                  <div
                    key={WFH.rclId}
                    className="border rounded-lg overflow-hidden shadow-sm">
                    <div
                      className="flex justify-between items-center p-3 cursor-pointer bg-gray-50"
                      onClick={() => toggleExpandedRow(WFH.rclId)}>
                      <div className="font-medium">{WFH.fullName || "N/A"}</div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`${getStatusClass(
                            WFH?.approvalStatus
                          )} text-center py-1 px-2 text-xs rounded-md w-fit`}>
                          {WFH?.approvalStatus || "N/A"}
                        </div>
                        <FaChevronDown
                          size={16}
                          className={`transition-transform ${
                            expandedRow === WFH.rclId ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                    <div
                      className={`${
                        expandedRow === WFH.rclId ? "block" : "hidden"
                      } p-3 space-y-2 text-sm`}>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Request Date:</div>
                        <div>{WFH?.requestDate || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Start Date:</div>
                        <div>{WFH?.workFromHomeStartDate || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">End Date:</div>
                        <div>{WFH?.workFromHomeEndDate || "N/A"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Team Leader:</div>
                        <div>{WFH?.teamLeaderName || "N/A"}</div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        {WFH?.approvalStatus === "PENDING" &&
                          hasWorkFromHomeReviewAccess && (
                            <>
                              <Button
                                size="sm"
                                className="bg-black text-white"
                                onPress={() => handleAction("approve", WFH)}>
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                onPress={() => handleAction("reject", WFH)}>
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

            {!isLoading && (!workFromHome || workFromHome.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                No Data available
              </div>
            )}

            {/**Pagination Section - Responsive for all screens */}
            {workFromHome && workFromHome.length > 0 && (
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-sm font-medium text-gray-600  flex items-center">
                  <span className="mr-1">Showing:</span>
                  <span className="font-bold text-gray-800 mx-1">
                    {totalRecords < WFHDataPerPage
                      ? totalRecords
                      : WFHDataPerPage}
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
                    onSelect={setWFHDataPerPage}
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
                    <h3 className="text-lg font-medium">
                      Work From Home Approval
                    </h3>
                    <p>Are you sure you want to approve this WFH?</p>
                    {selectedWorkFromHome && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-gray-50 p-3 rounded-md gap-3">
                        <div>
                          <span className="font-medium mr-1">Request ID:</span>
                          <span>{selectedWorkFromHome?.rclId}</span>
                        </div>
                        <div>
                          <span className="font-medium mr-1">Employee:</span>
                          <span>{selectedWorkFromHome?.fullName}</span>
                        </div>
                        <div>
                          <span className="font-medium mr-1">Start Date:</span>
                          <span>
                            {selectedWorkFromHome?.workFromHomeStartDate}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium mr-1">End Date:</span>
                          <span>
                            {selectedWorkFromHome?.workFromHomeEndDate}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium mr-1">
                            Requested On:
                          </span>
                          <span>{selectedWorkFromHome?.requestDate}</span>
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                          <span className="font-medium mr-1">
                            Reason/Email:
                          </span>
                          <span>{selectedWorkFromHome?.reason}</span>
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
                    <h3 className="text-lg font-medium">
                      Work From Home Rejection
                    </h3>
                    <p>
                      Please review the following WFH request details before
                      rejection:
                    </p>
                    {selectedWorkFromHome && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-gray-50 p-3 rounded-md gap-3">
                        <div>
                          <span className="font-medium mr-1">Request ID:</span>
                          <span>{selectedWorkFromHome?.rclId}</span>
                        </div>
                        <div>
                          <span className="font-medium mr-1">Employee:</span>
                          <span>{selectedWorkFromHome?.fullName}</span>
                        </div>
                        <div>
                          <span className="font-medium mr-1">Start Date:</span>
                          <span>
                            {selectedWorkFromHome?.workFromHomeStartDate}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium mr-1">End Date:</span>
                          <span>
                            {selectedWorkFromHome?.workFromHomeEndDate}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium mr-1">
                            Requested On:
                          </span>
                          <span>{selectedWorkFromHome?.requestDate}</span>
                        </div>
                        {selectedWorkFromHome?.leaveType && (
                          <div>
                            <span className="font-medium mr-1">
                              Leave Type:
                            </span>
                            <span>{selectedWorkFromHome?.leaveType}</span>
                          </div>
                        )}
                        {selectedWorkFromHome?.isHalfDay && (
                          <div>
                            <span className="font-medium mr-1">Half Day:</span>
                            <span>{selectedWorkFromHome?.isHalfDay}</span>
                          </div>
                        )}
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                          <span className="font-medium mr-1">
                            Reason/Email:
                          </span>
                          <span>{selectedWorkFromHome?.reason}</span>
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
                          message:
                            "Reason must be at least 10 characters long.",
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
    </div>
  );
};

export default WorkFromHomeStatus;
