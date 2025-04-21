import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { FaRegEye } from "react-icons/fa";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import { MdDelete } from "react-icons/md";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import DropDownComp from "../../../components/Dropdown";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import Search from "../../../components/Search";
import Filter from "../../../components/Filter";
import { IoIosPeople } from "react-icons/io";
import { AiOutlineUserAdd } from "react-icons/ai";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "@nextui-org/input";
import TextAreaComp from "../../../components/TextAreaComp";
const AttendanceRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lateCheckinData, setLateCheckinData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

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
      navigate("/login");
    }
  }, []);

  const handleAction = async (action, data) => {
    setSelectedData(data);
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
  const hasaccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 2)
  );
  /**To check edit status */
  const hasEmployeeEditAccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 3)
  );
  /**To check Delete Access */
  const hasEmployeeDeleteAccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 4)
  );

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Attendance", href: "/Attendance" },
    { label: "Late Checkin", href: "/Employees" },
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
      const fetchEmployees = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.post("/api/v1/users/list", {
            pageIndex: currentPage,
            pageSize: lateCheckInDataPerPage,
          });

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

      fetchEmployees();
    }
  };

  const onApprove = async () => {
    if (!selectedData) return;

    setIsLoading(true);
    const updateLeave = {
      data: {
        lateAttendanceId: selectedData,
        isApproved: true,
      },
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Authentication is missing.");
        return;
      }
      const response = await axiosInstance.put(
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
        lateCheckinData();
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
    if (!selectedData) return;

    setIsLoading(true);
    const RejectLeave = {
      data: {
        lateAttendanceId: selectedData,
        isApproved: "REJECTED",
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
        lateCheckinData();
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

  return (
    <div className="px-4 md:px-8 max-h-[85vh] space-y-4">
      {" "}
      <div className="flex flex-col space-y-4">
        <div className="text-sm">
          <BreadcrumbsComponent items={breadcrumbItems} />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center page-title -pl-2">
            <IoIosPeople className="text-2xl" />
            <span className="page-title">Late Checkin </span>
          </div>
          <div className="flex gap-x-4">
            <div className="flex items-center space-x-4">
              <Search />
              <Filter
                onApplyFilters={handleApplyFilters}
                url="/api/v1/users/list"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-2">
        <div className="shadow-md rounded-lg max-h-[80vh] overflow-x-auto text-left">
          <Table bordered aria-label="List of Review for Late Checkin">
            <TableHeader>
              <TableColumn>S.N</TableColumn>
              <TableColumn>RCL-ID</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Department</TableColumn>
              <TableColumn>Position</TableColumn>
              <TableColumn>Action</TableColumn>
            </TableHeader>
            <TableBody>
              {lateCheckinData
                .filter((employee) => employee.isActive)
                .map((employee, index) => (
                  <TableRow
                    key={employee.rclId}
                    className="h-14 border-b-2 border-gray-300">
                    <TableCell>
                      {(currentPage - 1) * lateCheckInDataPerPage + index + 1}
                    </TableCell>
                    <TableCell>{employee.rclId}</TableCell>
                    <TableCell>{employee.fullName}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.departmentName}</TableCell>
                    <TableCell>{employee.postionName}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-4">
                        {/* <Switch isSelected={isSelected} onValueChange={setIsSelected}> */}
                        <FaRegEye
                          className={`  ${
                            hasEmployeeEditAccess
                              ? "text-green-500 hover:text-green-700 cursor-pointer "
                              : ""
                          }`}
                          title="Edit"
                          onClick={() =>
                            handleAction("Approve", employee.rclId)
                          }
                        />
                        <MdDelete
                          className={`${
                            hasEmployeeDeleteAccess
                              ? "text-red-500 cursor-pointer hover:text-red-700"
                              : ""
                          }`}
                          title="Delete"
                          onClick={() => handleAction("Reject", employee.rclId)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <div className="text-xs">
            <span>
              Showing {lateCheckInDataPerPage} of {totalRecords}
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
              onSelect={setLateCheckInDataPerPage}
            />
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
    </div>
  );
};

export default AttendanceRequest;
