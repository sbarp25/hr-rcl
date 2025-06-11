import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Input, Select, SelectItem } from "@heroui/react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "sonner";
import Loader from "./Loader/Loader";

const Search = ({
  onApplySearch,
  url,
  searchFields = ["fullName", "email", "rclId", "department", "position"],
  placeholder = "Search",
  width = "w-full sm:w-72 md:w-80 lg:w-96",
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedField, setSelectedField] = useState(searchFields[0]); // default to first field
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!searchValue.trim()) {
      if (onApplySearch) onApplySearch({});
      return;
    }

    setIsLoading(true);

    const requestBody = {
      pageIndex: 1,
      pageSize: 10,
      searchCriteria: {
        [selectedField]: searchValue.trim(),
        // searchItem: searchValue.trim(),
      },
    };

    try {
      const response = await axiosInstance.post(url, requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.responseCode === "200") {
        onApplySearch?.({
          data: response.data.datalist,
          totalPages: response.data.totalPages,
          totalRecords: response.data.totalRecords,
        });
      } else {
        const errorMessage =
          response?.data?.error?.errorList?.[0]?.errorMessage ||
          response?.data?.message ||
          "Search failed";
        toast.error(errorMessage);
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

  const handleChange = (value) => {
    setSearchValue(value);
    if (!value.trim()) onApplySearch?.({});
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-xl flex flex-col gap-2 md:flex-row md:items-center">
          <Select
            aria-label="Search by field"
            size="sm"
            className="max-w-xs"
            selectedKeys={[selectedField]}
            onChange={(e) => setSelectedField(e.target.value)}>
            {searchFields.map((field) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </Select>
          <Input
            className={width}
            onKeyDown={handleKeyPress}
            variant="bordered"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => handleChange(e.target.value)}
            startContent={<CiSearch className="text-default-400" />}
            type="search"
            isLoading={isLoading}
            onClear={() => {
              setSearchValue("");
              onApplySearch?.({});
            }}
            isClearable
          />
        </div>
      )}
    </>
  );
};

export default Search;
