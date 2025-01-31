import React, { useState } from "react";
import Inputcomp from "./Inputcomp";
import { CiSearch } from "react-icons/ci";
import { Input } from "@nextui-org/react";
import axiosInstance from "../lib/axios-Instance";
import { toast } from "react-toastify";

const Search = ({ onApplySearch }) => {
  const [formData, setFormData] = useState({
    search: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);

    const requestBody = {
      pageIndex: 0,
      pageSize: 10, // Set the page size as needed
      searchCriteria: {
        search: formData.search || "", // Ensure search input is included
      },
    };
    if (onApplySearch) {
      onApplySearch({ search: formData.search });
    }

    setIsLoading(false);

    try {
      const response = await axiosInstance.post(
        "/api/v1/admin/completedEkyeUsers",
        requestBody,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.responseCode === "201") {
        toast.success(response.data.data.message);

        // Call onApplySearch only after a successful response
        if (onApplySearch) {
          onApplySearch(formData);
        }
      } else {
        toast.error(response.data.data.message);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Error fetching data.");
    } finally {
      setIsLoading(false);
    }
    onApplySearch(formData);
  };

  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onSubmit(); // Trigger search on "Enter"
    }
  };
  return (
    <>
      <Input
        classNames={{
          base: "max-w-full sm:max-w-[10rem] h-10",
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper:
            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
        }}
        onKeyDown={handleKeyPress}
        placeholder="Type to search..."
        size="sm"
        onChange={(e) => handleChange("search", e.target.value)}
        startContent={<CiSearch />}
        type="search"
        isLoading={isLoading}
      />
    </>
  );
};

export default Search;
