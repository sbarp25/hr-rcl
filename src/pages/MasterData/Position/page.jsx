import { useEffect, useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import Loader from "../../../components/Loader";
import axiosInstance from "../../../lib/axios-Instance";
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";
import { IoReturnDownBack } from "react-icons/io5";
import { Button } from "@nextui-org/react";
import BreadcrumbsComponent from "../../../components/BreadCrumbsComp";

const Position = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [positionData, setPositionData] = useState([]);
  const [positionName, setPositionName] = useState("");
  const [description, setDescription] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [editingPositionId, setEditingPositionId] = useState(null);

  {
    /**Start of Get API for Getting the Positions */
  }
  useEffect(() => {
    const fetchPositions = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post(
          "/api/v1/positions/get/all",
          {}
        );
        if (response.data.responseCode === "200") {
          // setPositionData(response?.data?.data?.content);
          setPositionData(response?.data?.datalist);
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
  {
    /**End of Get API for Getting the Positions */
  }

  {
    /** start of API calls to Add Position */
  }
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

  {
    /** end of API calls to Add Position */
  }

  {
    /**Start Of handleActions*/
  }
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
            `/positions/delete/${position.id}`
            // {
            //   headers: {
            //     "Content-Type": "application/json",
            //     accessToken: accessToken,
            //     refreshToken: refreshToken,
            //   },
            // }
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
    /**End of Handleaction */
  }
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
  return (
    <>
      {isLoading && (
        <Loader message="Please wait while the work is being done" />
      )}

      <div className="p-4 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className=" flex justify-between">
            <div className=" flex flex-col">
              <BreadcrumbsComponent items={breadcrumbItems} />
              <h2 className="page-title">Departments</h2>
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
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="border border-gray-300 px-4 py-2">
                    Position Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {positionData?.length > 0 ? (
                  positionData
                    .filter((position) => !position.isDeleted)
                    .map((position, index) => (
                      <tr
                        key={position.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}>
                        <td className="border border-gray-300 px-4 py-2">
                          {position.name || "N/A"}
                          {position.id}
                        </td>
                        <td className="border max-w-96 border-gray-300 px-4 py-2 sm:overflow-y-hidden">
                          <div className="max-h-32 max-w-96 overflow-y-auto">
                            {position.description}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <div className="flex justify-center gap-4">
                            <HiPencilSquare
                              className="text-green-500 cursor-pointer hover:text-green-700"
                              title="Edit"
                              onClick={() => handleAction("edit", position)}
                            />
                            <MdDelete
                              className="text-red-500 cursor-pointer hover:text-red-700"
                              title="Delete"
                              onClick={() => handleAction("delete", position)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-gray-500 py-4">
                      No Positions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Position;
