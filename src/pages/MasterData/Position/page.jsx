import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import Loader from "../../../components/Loader";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoReturnDownBack } from "react-icons/io5";
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
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import DropDownComp from "../../../components/Dropdown";
import Filter from "../../../components/Filter";
import Search from "../../../components/Search";
import { BiData } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";
import SkeletonLoader from "../../../components/SkeletonLoader";

const Position = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [positionId, setPositionId] = useState(null);

  const [positionData, setPositionData] = useState([]);
  const [positionName, setPositionName] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [editingPositionId, setEditingPositionId] = useState(null);

  const dropdownItems = [5, 10, 20, 30, 50, 100];
  const [currentPage, setCurrentPage] = useState(1);
  const [ekyeDashboardDataPerPage, setEkyeDashboardDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [originalPositionsData, setOriginalPositionsData] = useState([]);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  /**Start of Get API for Getting the Positions */
  useEffect(() => {
    const fetchPositions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/v1/positions/list", {
          pageIndex: currentPage,
          pageSize: ekyeDashboardDataPerPage, // Page size
        });
        if (response.data.responseCode === "200") {
          setOriginalPositionsData(response?.data?.datalist || []);
          setPositionData(response.data.datalist);
          setTotalPages(response.data.totalPages);
          setTotalRecords(response.data.totalRecords);
        } else {
          toast.error("Failed to fetch positions.");
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        toast.error("Error fetching positions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, [currentPage, ekyeDashboardDataPerPage]);

  const handleApplyFilters = (filters) => {
    // If no filters, show all original data
    if (!filters.department && !filters.position) {
      setPositionData(originalPositionsData);
      return;
    }
    const filteredData = originalPositionsData.filter((dept) => {
      return (
        (!filters.department || dept.name === filters.department) &&
        (!filters.position || dept.positionName === filters.position)
      );
    });

    setPositionData(filteredData);
  };
  /** start of API calls to Add Position */
  // const handleAddPosition = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const newPosition = {
  //     data: {
  //       positionName: positionName,
  //       description: description,
  //     },
  //   };

  //   try {
  //     const response = await axiosInstance.post(
  //       "/api/v1/positions/save",
  //       newPosition,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (response.data.responseCode === "201") {
  //       toast.success("Position added successfully!");

  //       // Reset form fields
  //       setPositionName("");
  //       setDescription("");
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error adding position:", error);
  //     toast.error("Error adding position.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const menu = LocalStorageUtil.getItem("menu");

  /**To check create status */
  const hasPositioncreateaccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 13)
  );
  /**To read the Data */
  const hasaccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 14)
  );
  /**To check edit status */
  const hasPositionEditAccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 15)
  );
  /**To check Delete Access */
  const hasPositionDeleteAccess = menu?.some((menu) =>
    menu.actionList.some((action) => action.actionId === 16)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, []);
  /**Start Of handleActions*/
  const handleAction = async (action, position) => {
    switch (action) {
      // Start Of Edit Operation
      case "edit":
        if (hasPositionEditAccess) {
          navigate(`/master-data/Position/Edit/${position.id}`);
        } else {
          toast.error("Access denied");
        }
        break;

      // Start Of Delete Operation
      case "delete":
        setPositionId(position.id);
        onOpen();
        break;
      // End Of Delete Operation
      default:
        console.log("Unknown action");
    }
  };

  const onDelete = async () => {
    try {
      if (hasPositionDeleteAccess) {
        const response = await axiosInstance.delete(
          `api/v1/positions/delete/${positionId}`
        );
        if (response.data.responseCode === "204") {
          toast.success("Position deleted successfully!");
          onClose();
        } else {
          toast.error("Failed to delete the position.");
        }
      } else {
        ("Access Denied");
      }
    } catch (error) {
      console.error("Error deleting position:", error);
      toast.error("Error deleting position.");
    }
  };
  const handleEditPosition = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedPosition = {
      data: {
        positionName: positionName,
        description: description,
      },
    };

    try {
      const response = await axiosInstance.put(
        `/positions/update/${editingPositionId}`,
        updatedPosition,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseCode === "200") {
        toast.success("Position updated successfully!");
        setPositionData((prevData) =>
          prevData.map((item) =>
            item.id === editingPositionId
              ? { ...item, name: positionName, description: description }
              : item
          )
        );
        // Reset form and states
        setPositionName("");
        setDescription("");
        setShowEditForm(false);
        setEditingPositionId(null);
      } else {
        toast.error("Failed to update the position.");
      }
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error("Error updating position.");
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "MasterData", href: "" },
    { label: "Position", href: "/master-data/Position" },
  ];
  const navigate = useNavigate();
  useEffect(() => {
    if (!hasaccess) {
      navigate("/dashboard");
    }
  }, [hasaccess, navigate]);
  {
    /**Trancate Text */
  }

  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
  const navigateAdd = () => {
    navigate("/master-data/AddPosition");
  };

  return (
    <>
      {/* {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )} */}

      <div className="px-4 md:px-8 max-h-[85vh] space-y-4">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="text-sm">
            <BreadcrumbsComponent items={breadcrumbItems} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center page-title -pl-2">
              <BiData />
              Position
            </div>
            <div className="flex gap-x-4">
              <div className="flex items-center space-x-4">
                <Search />
                <Filter
                  onApplyFilters={handleApplyFilters}
                  url="/api/v1/departments/list"
                  fieldNames={{
                    departmentField: "id",
                    fromDateField: "createdAt",
                    toDateField: "createdto",
                    positionField: "positionId",
                  }}
                />
              </div>
              <Button
                isDisabled={!hasPositioncreateaccess}
                className="button bg-black tracking-normal"
                onPress={navigateAdd}>
                <>
                  <IoIosAddCircleOutline className="text-white text-base" />
                  <span className="text-white font-normal text-xs">
                    Add Position
                  </span>
                </>
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-2">
          <div className="shadow-md rounded-lg max-h-[80vh]  text-left">
            <Table aria-label="Position Table " className="">
              <TableHeader>
                <TableColumn>S.N</TableColumn>
                <TableColumn>Position Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>User Action</TableColumn>
              </TableHeader>
              <TableBody
                items={isLoading ? [] : positionData}
                isLoading={isLoading}
                loadingContent={<SkeletonLoader />}>
                {positionData.map((position, index) => (
                  <TableRow
                    key={position.rclId}
                    className="h-14 justify-center items-center border-b-2 border-gray-300">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{position.positionName}</TableCell>
                    <TableCell>
                      <Tooltip content={position.description}>
                        {truncateText(position.description, 30)}
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <HiPencilSquare
                          className="text-orange-500 cursor-pointer hover:text-orange-700 text-xl mr-2"
                          title="Edit"
                          onClick={() => handleAction("edit", position)}
                        />
                        <MdDelete
                          className="text-red-500 cursor-pointer hover:text-red-700 text-xl ml-2"
                          title="Delete"
                          onClick={() => handleAction("delete", position)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {!isLoading && (!positionData || positionData.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              No Data available
            </div>
          )}
          {/* )} */}
          <div className="flex mt-4 justify-between">
            <div className="text-sm font-medium text-gray-600  flex items-center">
              <span className="mr-1">Showing:</span>
              <span className="font-bold text-gray-800 mx-1">
                {ekyeDashboardDataPerPage}
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
              <span className="text-xs">Lines Per Page :</span>
              <DropDownComp
                items={dropdownItems}
                selectedItem={ekyeDashboardDataPerPage}
                onChange={(value) => {
                  setEkyeDashboardDataPerPage(value);
                  setCurrentPage(1);
                }}
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
                <p>Are you sure you want to delete htis department </p>
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
  );
};

export default Position;
