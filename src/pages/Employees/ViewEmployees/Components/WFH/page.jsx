import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Chip, Card, CardBody, Divider } from "@heroui/react";
import axiosInstance from "../../../../../lib/axios-Instance";
import { toast } from "sonner";
import {
  FaHome,
  FaUser,
  FaClock,
  FaFileAlt,
  FaUserCheck,
  FaBuilding,
  FaCheckCircle,
  FaExclamationCircle,
  FaCalendarAlt,
} from "react-icons/fa";

const WFHdetails = ({ employeeData }) => {
  const workFromHome = employeeData?.workFromHomeResponse || [];

  // Format date for better display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate WFH duration
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Get status based on approval
  const getWFHStatus = (approverName) => {
    return approverName && approverName !== "N/A" ? "approved" : "pending";
  };

  // Status color mapping
  const getStatusColor = (status) => {
    return status === "approved" ? "success" : "warning";
  };

  // Status icon mapping
  const getStatusIcon = (status) => {
    return status === "approved" ? (
      <FaCheckCircle className="w-4 h-4" />
    ) : (
      <FaExclamationCircle className="w-4 h-4" />
    );
  };

  if (!workFromHome.length) {
    return (
      <Card shadow="sm" className="w-full mt-10">
        <CardBody className="flex flex-col items-center justify-center py-12">
          <FaHome className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">
            No work from home records found
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div></div>
        <Chip color="primary" variant="flat">
          {workFromHome.length} Record{workFromHome.length !== 1 ? "s" : ""}
        </Chip>
      </div>

      <Accordion
        variant="bordered"
        className="gap-3"
        itemClasses={{
          base: "px-0",
          trigger:
            "px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors",
          content: "px-0 pb-0",
        }}>
        {workFromHome.map((wfh) => {
          const status = getWFHStatus(wfh.approverFullName);

          return (
            <AccordionItem
              key={wfh.workFromHomeId}
              aria-label={`WFH from ${formatDate(wfh.workFromHomeStartDate)}`}
              title={
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {formatDate(wfh.workFromHomeStartDate)} -{" "}
                        {formatDate(wfh.workFromHomeEndDate)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-white">
                        Work From Home •{" "}
                        {calculateDuration(
                          wfh.workFromHomeStartDate,
                          wfh.workFromHomeEndDate
                        )}{" "}
                        day
                        {calculateDuration(
                          wfh.workFromHomeStartDate,
                          wfh.workFromHomeEndDate
                        ) !== 1
                          ? "s"
                          : ""}
                      </span>
                    </div>
                  </div>
                  <Chip
                    color={getStatusColor(status)}
                    variant="flat"
                    startContent={getStatusIcon(status)}
                    className="capitalize">
                    {status}
                  </Chip>
                </div>
              }>
              <Card className="shadow-none border-0 bg-gray-50 dark:bg-slate-500">
                <CardBody className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700 dark:text-white flex items-center gap-2 mb-3">
                        <FaUser className="w-4 h-4" />
                        Personal Details
                      </h4>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3 text-gray-600 dark:text-white">
                          <span className="text-sm font-medium  min-w-[80px]">
                            Subject:
                          </span>
                          <span className="text-sm ">{wfh.title}</span>
                        </div>
                      </div>
                    </div>

                    {/* Management Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700 dark:text-white flex items-center gap-2 mb-3">
                        <FaUserCheck className="w-4 h-4" />
                        Approval Details
                      </h4>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-medium text-gray-600 dark:text-white min-w-[100px]">
                            Approved By:
                          </span>
                          <span className="text-sm text-gray-800 dark:text-white">
                            {wfh.approverFullName || (
                              <span className="text-orange-600 dark:text-orange-300 italic">
                                Pending Approval
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  {/* WFH Summary */}
                  <div className="bg-white dark:bg-slate-500 rounded-lg p-4 border">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-white uppercase tracking-wide">
                          Request Type
                        </p>
                        <p className="font-semibold text-gray-800 dark:text-white mt-1 flex items-center justify-center gap-1">
                          <FaHome className="w-3 h-3" />
                          Work From Home
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-white uppercase tracking-wide">
                          Duration
                        </p>
                        <p className="font-semibold text-gray-800 dark:text-white mt-1">
                          {calculateDuration(
                            wfh.workFromHomeStartDate,
                            wfh.workFromHomeEndDate
                          )}{" "}
                          day
                          {calculateDuration(
                            wfh.workFromHomeStartDate,
                            wfh.workFromHomeEndDate
                          ) !== 1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-white uppercase tracking-wide">
                          Start Date
                        </p>
                        <p className="font-semibold text-gray-800  dark:text-white mt-1">
                          {formatDate(wfh.workFromHomeStartDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-white uppercase tracking-wide">
                          End Date
                        </p>
                        <p className="font-semibold text-gray-800 dark:text-white mt-1">
                          {formatDate(wfh.workFromHomeEndDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info if Subject is lengthy */}
                  {wfh.title && wfh.title.length > 50 && (
                    <>
                      <Divider className="my-4" />
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                          <FaFileAlt className="w-4 h-4" />
                          Request Details
                        </h5>
                        <p className="text-sm text-blue-700">{wfh.title}</p>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default WFHdetails;
