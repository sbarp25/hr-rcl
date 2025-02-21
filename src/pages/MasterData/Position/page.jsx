import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import Loader from "../../../components/Loader";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";
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
import { useNavigate } from "react-router-dom";
import DropDownComp from "../../../components/Dropdown";

const Position = () => {
  const navigate = useNavigate();
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
  const startIndex = (currentPage - 1) * ekyeDashboardDataPerPage;
  const endIndex = startIndex + ekyeDashboardDataPerPage;
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

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
          setTotalPages(response.data.totalPages);
          setTotalRecords(response.data.totalRecords);
          setPositionData(response.data.datalist);
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

  /** start of API calls to Add Position */
  const handleAddPosition = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newPosition = {
      data: {
        positionName: positionName,
        description: description,
      },
    };

    try {
      const response = await axiosInstance.post(
        "/api/v1/positions/save",
        newPosition,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.responseCode === "201") {
        toast.success("Position added successfully!");

        // Reset form fields
        setPositionName("");
        setDescription("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding position:", error);
      toast.error("Error adding position.");
    } finally {
      setIsLoading(false);
    }
  };

  /**Start Of handleActions*/
  const handleAction = async (action, position) => {
    switch (action) {
      // Start Of Edit Operation
      case "edit":
        console.log(`Editing position ID: ${position.id}`);
        setShowEditForm(true);
        setPositionName(position.name || "");
        setDescription(position.description || "");
        setEditingPositionId(position.id);
        break;

      // Start Of Delete Operation
      case "delete":
        try {
          console.log(`Deleting position ID: ${position.id}`);
          const response = await axiosInstance.delete(
            `/positions/delete/${position.id}`
          );
          if (response.data.responseCode === "204") {
            toast.success("Position deleted successfully!");
          } else {
            toast.error("Failed to delete the position.");
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

  {
    /**Trancate Text */
  }
  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? `${text?.slice(0, maxLength)}...` : text;
  return (
    <>
      {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )}

      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className=" flex justify-between">
            <div className=" flex flex-col space-y-4">
              <BreadcrumbsComponent items={breadcrumbItems} />
              <h2 className="page-title">Position</h2>
            </div>
          </div>

          <Button
            className="button bg-green-700 tracking-normal
  hover:bg-green-900"
            onPress={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? (
              <>
                <IoReturnDownBack className="text-white h-24 w-24" />
                <span className="text-white font-Poppins text-xl">Return</span>
              </>
            ) : (
              <>
                <IoMdAdd className="text-white h-24 w-24" />
                <span className="text-white font-Poppins text-xl">Add</span>
              </>
            )}
          </Button>
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
        {showAddForm ? (
          <form
            className="mb-6 p-4 bg-white shadow-md rounded-lg max-w-4xl mx-auto"
            onSubmit={handleAddPosition}>
            <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
              Add New Position
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
                  className="input border rounded-lg px-4 py-2 h-24 focus:outline-none  resize-none w-full"
                  required></textarea>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col md:w-1/4 justify-end md:justify-start">
                <button
                  type="submit"
                  className="button bg-bgprimary text-white rounded-lg px-6 py-2 hover:bg-bgprimaryhover transition w-full md:w-auto">
                  Add Position
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Table Section */
          <div className="bg-white shadow-md rounded-lg overflow-y-auto max-h-[74vh]">
            <Table aria-label="Position Table " isHeaderSticky className="">
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
                    className="h-20 justify-center items-center border-b-2 border-gray-300">
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
        )}
        <div className="flex mt-4 justify-between">
          <div className="flex text-xs">
            <span>Showing:</span>
            <span className="font-bold">{ekyeDashboardDataPerPage}</span>
            <span>of</span>
            <span>{totalRecords}</span>
          </div>
          <Pagination
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
                setCurrentPage(1); // Reset to page 1
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Position;
