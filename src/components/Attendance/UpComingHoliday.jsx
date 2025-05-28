import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios-Instance";
import Loader from "../Loader/Loader";
import { FaDiamond } from "react-icons/fa6";
import { toast } from "sonner";

const UpComingHoliday = () => {
  const [upComingHoliday, setUpComingHoliday] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  const UpComingHoliday = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "api/v1/holiday/upComingHoliday"
      );

      if (response.data.responseCode === "200") {
        setUpComingHoliday(response.data.datalist);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.errorList?.[0]?.errorMessage ||
        "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    UpComingHoliday();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };
  const events = upComingHoliday?.filter((item) => item.event_name);
  return (
    <>
      {isloading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow">
            <div className="relative mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Upcoming Events
              </h2>

              <div className="flex items-center">
                <FaDiamond className="text-red-400 w-4 h-4" />

                <div className="flex-1 h-[2px] bg-red-300 rounded" />
                <div className="flex-1 border-t-2 border-dashed border-gray-500" />
              </div>
            </div>

            {events.length > 0 ? (
              <div className="space-y-3">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md flex items-start ${
                      event.is_holiday
                        ? "bg-red-50 border border-red-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}>
                    <div
                      className={`mr-3 ${
                        event.is_holiday
                          ? "bg-red-50 border border-red-300 text-red-400"
                          : "bg-blue-50 border border-blue-300 text-blue-400"
                      } rounded-md p-2 shadow-sm`}>
                      <div className="text-sm font-bold text-center">
                        {formatDate(event.date)}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="font-medium">{event.event_name}</div>
                      <div className="text-xs text-gray-600 mt-1 flex items-center">
                        <span className="mr-2">{event.day}</span>
                        {event.is_holiday && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                            Holiday
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                No upcoming events found
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UpComingHoliday;
