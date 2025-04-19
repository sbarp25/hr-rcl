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
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";
import DropDownComp from "../../../components/Dropdown";
import Filter from "../../../components/Filter";
import Search from "../../../components/Search";
import { BiData } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import LocalStorageUtil from "../../../utils/LocalStorageUtil";

const Position = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

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
  const hasPositioncreateaccess = menu.some((menu) =>
    menu.actionList.some((action) => action.actionId === 13)
  );
  /**To read the Data */
  const hasaccess = menu.some((menu) =>
    menu.actionList.some((action) => action.actionId === 14)
  );
  /**To check edit status */
  const hasPositionEditAccess = menu.some((menu) =>
    menu.actionList.some((action) => action.actionId === 15)
  );
  /**To check Delete Access */
  const hasPositionDeleteAccess = menu.some((menu) =>
    menu.actionList.some((action) => action.actionId === 16)
  );

  useEffect(() => {
    if (!hasaccess) {
      navigate("/");
    }
  }, []);
  /**Start Of handleActions*/
  const handleAction = async (action, position) => {
    switch (action) {
      // Start Of Edit Operation
      case "edit":
        if (hasPositionEditAccess) {
          navigate(`/master-data/Position/Edit/${position.id}`);
          // console.log(`Editing position ID: ${position.id}`);
          // setShowEditForm(true);
          // setPositionName(position.name || "");
          // setDescription(position.description || "");
          // setEditingPositionId(position.id);
        } else {
          toast.error("Access denied");
        }
        break;

      // Start Of Delete Operation
      case "delete":
        try {
          if (hasPositionDeleteAccess) {
            console.log(`Deleting position ID: ${position.id}`);
            const response = await axiosInstance.delete(
              `api/v1/positions/delete/${position.id}`
            );
            if (response.data.responseCode === "204") {
              toast.success("Position deleted successfully!");
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
        break;
      // End Of Delete Operation
      default:
        console.log("Unknown action");
    }
  };
  {
    /**Start of Edit */
  }
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
  {
    /**Edit of Edit */
  }
  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "MasterData", href: "" },
    { label: "Position", href: "/master-data/Position" },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasaccess) {
      navigate("/");
    }
  }, []);
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
      {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )}

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

        {/**  Edit Postion form */}
        {showEditForm && (
          <form
            className="mb-6 p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto"
            onSubmit={handleEditPosition}>
            <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
              Edit Position
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Input Fields */}
              <div className="flex flex-col flex-1 gap-4">
                <input
                  type="text"
                  placeholder="Position Name"
                  value={positionName}
                  onChange={(e) => setPositionName(e.target.value)}
                  className="input border rounded-lg px-4 py-2 focus:outline-none  w-full"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input border rounded-lg px-4 py-2 h-24 focus:outline-none resize-none w-full"
                  required></textarea>
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex flex-col md:w-1/4 justify-end md:justify-start">
                <button
                  type="submit"
                  className="button bg-bgprimary text-white rounded-lg px-6 py-2 hover:bg-bgprimaryhover transition w-full md:w-auto mb-4">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="button bg-gray-500 text-white rounded-lg px-6 py-2 hover:bg-gray-600 transition w-full md:w-auto"
                  onClick={() => setShowEditForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
        {/* Add Position Form */}
        {/* {showAddForm ? (
          <form
            className="mb-6 p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto"
            onSubmit={handleAddPosition}>
            <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
              Add New Position
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col flex-1 gap-4">
                <input
                  type="text"
                  placeholder="Position Name"
                  value={positionName}
                  onChange={(e) => setPositionName(e.target.value)}
                  className="input border rounded-lg px-4 py-2 focus:outline-none  w-full"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input border rounded-lg px-4 py-2 h-24 focus:outline-none  resize-none w-full"
                  required></textarea>
              </div>

              <div className="flex flex-col md:w-1/4 justify-end md:justify-start">
                <button
                  type="submit"
                  className="button bg-bgprimary text-white rounded-lg px-6 py-2 hover:bg-bgprimaryhover transition w-full md:w-auto">
                  Add Position
                </button>
              </div>
            </div>
          </form>
        ) : ( */}
        {/* Table Section */}
        <div className="bg-white rounded-lg p-2">
          <div className="shadow-md rounded-lg max-h-[80vh] overflow-x-auto text-left">
            <Table aria-label="Position Table " className="">
              <TableHeader>
                <TableColumn>S.N</TableColumn>
                <TableColumn>Position Name</TableColumn>
                <TableColumn>Description</TableColumn>
                <TableColumn>User Action</TableColumn>
              </TableHeader>
              <TableBody>
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
                          className="text-yellow-500 cursor-pointer hover:text-green-700 text-xl mr-2"
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
          {/* )} */}
          <div className="flex mt-4 justify-between">
            <div className="flex text-xs">
              <span>Showing:</span>
              <span className="font-bold">{ekyeDashboardDataPerPage}</span>
              <span>of</span>
              <span>{totalRecords}</span>
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
    </>
  );
};

export default Position;
