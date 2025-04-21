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
import { FaCheckCircle, FaRegEye } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import TextAreaComp from "../../../components/TextAreaComp";

const LeaveStatus = () => {
  const [currentPage, setCurrentPage] = useState(1);

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

  const [leaveDataperpage, setLeaveDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();
  const { reset, control, handleSubmit } = useForm();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Leave Status", href: "" },
  ];

  const dropdownItems = [5, 10, 20, 30, 50, 100];

  const fetchLeave = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/leave/all?page=${currentPage}&size=${leaveDataperpage}`,
        {}
      );
      if (response.data.responseCode === "200") {
        setLeaveData(response.data.datalist);
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
  }, [currentPage, leaveDataperpage]);

  const menu = LocalStorageUtil.getItem("menu");
  /**To check Delete Access */
  // const hasLeaveApproveAccess = menu?.some((menu) =>
  //   menu.actionList.some((action) => action.actionId === 4)
  // );
  const hasLeaveDeleteAccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 1)
  );
  const hasLeaveApproveAccess = true;

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
        toast.error(response?.data?.error || "Something went wrong");
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
        toast.error(response?.data?.error || "Something went wrong");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback data if API fails
  const fallbackLeaveData = [
    {
      rclId: "1",
      leaveId: "1",
      leaveStartDate: "2024-07-02",
      leaveType: "Sick",
      leaveEndDate: "2024-07-02",
      Days: "1",
      leaveStatus: "PENDING",
      teamLeaderName: "Odinson",
      approvedBy: "",
    },
  ];

  // Use API data if available, otherwise use fallback
  const displayData = leaveData.length > 0 ? leaveData : fallbackLeaveData;

  return (
    <>
      <div className="container space-y-4">
        {/**Page Section */}
        <div className="flex flex-col space-y-4">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center page-title -pl-2">
              <h1 className="page-title">Leave Status</h1>
            </div>
          </div>
        </div>

        {/**Table Section */}
        <div className="bg-white rounded-lg p-2">
          <div className="shadow-md rounded-lg max-h-[80vh] overflow-x-auto text-left">
            <Table bordered aria-label="Table of Leave">
              <TableHeader>
                <TableColumn>S.N</TableColumn>
                <TableColumn>Request Date</TableColumn>
                <TableColumn>Leave Type</TableColumn>
                <TableColumn>Leave Start Date</TableColumn>
                <TableColumn>Leave End Date</TableColumn>
                <TableColumn>Days</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Team Leader</TableColumn>
                <TableColumn>Approver</TableColumn>
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
                    <TableCell>{item?.leaveStartDate || "N/A"}</TableCell>
                    <TableCell>{item?.leaveType || "N/A"}</TableCell>
                    <TableCell>{item?.leaveStartDate || "N/A"}</TableCell>
                    <TableCell>{item?.leaveEndDate || "N/A"}</TableCell>
                    <TableCell>{item?.Days || "N/A"}</TableCell>
                    <TableCell>
                      <div
                        className={`${
                          item?.leaveStatus === "APPROVED"
                            ? "bg-teal-100 border border-teal-600 text-teal-600"
                            : item?.leaveStatus === "REJECTED"
                            ? "bg-red-100 border border-red-600 text-red-600"
                            : "bg-yellow-100 border border-yellow-500 text-yellow-500"
                        } text-center p-2 rounded-md w-fit`}>
                        {item?.leaveStatus || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 p-2 rounded-lg">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-md text-lg ${
                            item?.leaveStatus === "APPROVED"
                              ? "bg-teal-100 text-teal-600"
                              : item?.leaveStatus === "REJECTED"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-500"
                          }`}>
                          {item?.teamLeaderName?.charAt(0) || "?"}
                        </div>
                        <div className="text-gray-800 font-medium">
                          {item?.teamLeaderName || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 p-2 rounded-lg">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-bold shadow-md text-lg ${
                            item?.leaveStatus === "APPROVED"
                              ? "bg-teal-100 text-teal-600"
                              : item?.leaveStatus === "REJECTED"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-500"
                          }`}>
                          {item?.approvedBy?.charAt(0) || "?"}
                        </div>
                        <div>{item?.approvedBy || "N/A"}</div>
                      </div>
                    </TableCell>
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
                                className="text-xl text-green-600 hover:text-green-800"
                                onClick={() => handleAction("approve", item)}
                              />
                              <FaXmark
                                className="text-xl text-red-600 hover:text-red-800"
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
          {/**Pagination Section */}
          <div>
            <div className="flex mt-4 justify-between items-center">
              <div className="flex text-xs">
                <span>Showing: </span>
                <span className="font-bold">{leaveDataperpage}</span>
                <span> of </span>
                <span>{totalRecords}</span>
              </div>
              <Pagination
                showControls
                total={totalPages}
                page={currentPage}
                onChange={handlePageChange}
              />
              <div className="flex justify-center items-center">
                <span className="text-xs">Lines Per Page: </span>
                <DropDownComp
                  items={dropdownItems}
                  onSelect={setLeaveDataPerPage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={true}
        isKeyboardDismissDisabled={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <p>Are you sure you want to approve this leave?</p>
                <p></p>
                <div className="flex gap-2 justify-end mt-4">
                  <Button color="primary" onPress={() => onApprove()}>
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
        isKeyboardDismissDisabled={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <p>Are you sure you want to reject this leave?</p>
                <form onSubmit={handleSubmit(onReject)}>
                  <TextAreaComp
                    name="reason"
                    control={control}
                    rules={{
                      required: "Reason is required",
                      minLength: {
                        value: 10,
                        message: "Reason must be at least 10 characters long.",
                      },
                    }}
                  />
                  <div className="flex gap-2 justify-end mt-4">
                    <Button color="danger" type="submit">
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
