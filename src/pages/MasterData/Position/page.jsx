import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import Loader from "../../../components/Loader";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { Button, Input, Textarea } from "@nextui-org/react";
import { IoMdAdd } from "react-icons/io";
import { IoReturnDownBack } from "react-icons/io5";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";

const Position = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [positionData, setPositionData] = useState([]);
  const [positionName, setPositionName] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [editingPositionId, setEditingPositionId] = useState(null);

  /**Start of Get API for Getting the Positions */

  useEffect(() => {
    const fetchPositions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/api/positions/get/all", {});
        if (response.data.responseCode === "200") {
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
  }, []);
  /**End of Get API for Getting the Positions */

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
        "/api/positions/register",
        newPosition,
        {
          headers: {
            // accessToken: accessToken,
            // refreshToken: refreshToken,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Position added successfully:", response.data);
      toast.success("Position added successfully!");
      // Reset form fields
      setPositionName("");
      setDescription("");
    } catch (error) {
      console.error("Error adding position:", error);
      toast.error("Error adding position.");
    } finally {
      setIsLoading(false);
    }
  };

  /** end of API calls to Add Position */

  /**Start Of handleActions*/

  const handleAction = async (action, position) => {
    switch (action) {
      // Start Of Edit Operation
      case "edit":
        console.log(`Editing position ID: ${position.id}`);
        setShowEditForm(true);
        setPositionName(position.name || "");
        setDescription(position.description || "");
        setEditingPositionId(position.id); // New state for tracking the position being edited
        break;
      // End Of Edit Operation

      // Start Of Delete Operation
      case "delete":
        try {
          console.log(`Deleting position ID: ${position.id}`);
          const response = await axiosInstance.delete(
            `/api/positions/delete/${position.id}`
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

  /**End of Handleaction */

  /**Start of Edit */
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
        `/api/positions/update/${editingPositionId}`,
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
  /**end of Edit */
  const columns = [
    { key: "name", label: "Department Name" },
    { key: "description", label: "Description" },
    { key: "actions", label: "Actions" },
  ];
  const getKeyValue = (obj, key) => (key in obj ? obj[key] : null);
  return (
    <>
      {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )}

      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="page-title">Position</h2>
          <Button
            className="button bg-green-700 tracking-normal
          hover:bg-green-900"
            onPress={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? (
              <>
                <IoReturnDownBack className="text-white h-24 w-24" />
                <span className="text-white font-Poppins text-xl ">Return</span>
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
            onSubmit={handleEditPosition}
          >
            <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
              Edit Position
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Input Fields */}
              <div className="flex flex-col flex-1 gap-4">
                <Input
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
                  required
                ></textarea>
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex flex-col md:w-1/4 justify-end md:justify-start">
                <Button
                  type="submit"
                  className="button bg-bgprimary text-white rounded-lg px-6 py-2 hover:bg-bgprimaryhover transition w-full md:w-auto mb-4"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  className="button bg-gray-500 text-white rounded-lg px-6 py-2 hover:bg-gray-600 transition w-full md:w-auto"
                  onPress={() => setShowEditForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}
        {/* Add Position Form */}
        {showAddForm ? (
          <form
            className="mb-6 p-4 bg-white shadow-md rounded-lg  mx-auto "
            onSubmit={handleAddPosition}
          >
            <h2 className="text-lg font-semibold mb-4 text-center md:text-left">
              Add New Position
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Input Fields */}

              <div className="flex flex-col flex-1 gap-4">
                <Input
                  type="text"
                  label="Position Name"
                  value={positionName}
                  onChange={(e) => setPositionName(e.target.value)}
                  className="rounded-xl shadow-md  focus:outline-none w-full"
                  required
                />
                <Textarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border rounded-xl shadow-md focus:outline-none resize-none w-full"
                  required
                ></Textarea>
              </div>
            </div>
            <div className="flex flex-col md:w-1/4 justify-end md:justify-start">
              <button
                type="submit"
                className=" bg-bgprimary text-white rounded-lg p-2 hover:bg-bgprimaryhover transition  md:w-auto mt-6"
              >
                Submit
              </button>
            </div>
          </form>
        ) : (
          /* Table Section */
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <Table aria-label="Example table with dynamic content">
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key} className="">
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={positionData}>
                {(department) => (
                  <TableRow key={Position.id}>
                    {(columnKey) => (
                      <TableCell className="justify-between">
                        {columnKey === "actions" ? (
                          <div className="flex justify-start ">
                            <HiPencilSquare
                              className="text-green-500 cursor-pointer hover:text-green-700 text-xl mr-2"
                              title="Edit"
                              onClick={() => handleAction("edit", department)}
                            />
                            <MdDelete
                              className="text-red-500 cursor-pointer hover:text-red-700 text-xl ml-2"
                              title="Delete"
                              onClick={() => handleAction("delete", department)}
                            />
                          </div>
                        ) : columnKey === "description" ? (
                          <div className="max-w-[60vw]">
                            {getKeyValue(department, columnKey)}
                          </div>
                        ) : (
                          getKeyValue(department, columnKey)
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default Position;
