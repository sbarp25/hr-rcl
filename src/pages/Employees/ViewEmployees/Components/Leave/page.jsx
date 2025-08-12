import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Chip, Card, CardBody, Divider } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useDisclosure } from "@heroui/react";
import axiosInstance from "../../../../../lib/axios-Instance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaFileAlt,
  FaUsers,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const LeaveDetails = ({ employeeData }) => {
  const leaveData = employeeData?.leaveManagementResponse || [];

  // Status color mapping
  const getStatusColor = (status) => {
    const statusMap = {
      approved: "success",
      pending: "warning",
      rejected: "danger",
      cancelled: "default",
    };
    return statusMap[status?.toLowerCase()] || "default";
  };

  // Status icon mapping
  const getStatusIcon = (status) => {
    const iconMap = {
      approved: <FaCheckCircle className="w-4 h-4" />,
      pending: <FaExclamationCircle className="w-4 h-4" />,
      rejected: <FaTimesCircle className="w-4 h-4" />,
      cancelled: <FaTimesCircle className="w-4 h-4" />,
    };
    return iconMap[status?.toLowerCase()] || <FaClock className="w-4 h-4" />;
  };

  // Format date for better display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate leave duration
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (!leaveData.length) {
    return (
      <Card shadow="sm" className="w-full mt-10">
        <CardBody className="flex flex-col items-center justify-center py-12">
          <FaFileAlt className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No leave records found</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"></h3>
        <Chip color="primary" variant="flat">
          {leaveData.length} Record{leaveData.length !== 1 ? "s" : ""}
        </Chip>
      </div>

      <Accordion
        variant="bordered"
        className="gap-3"
        itemClasses={{
          base: "px-0",
          trigger:
            "px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-600 transition-colors",
          content: "px-0 pb-0",
        }}>
        {leaveData.map((leave) => (
          <AccordionItem
            key={leave.leaveId}
            aria-label={`Leave from ${formatDate(leave.leaveStartDate)}`}
            title={
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {formatDate(leave.leaveStartDate)} -{" "}
                      {formatDate(leave.leaveEndDate)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-white">
                      {leave.leaveType} •{" "}
                      {calculateDuration(
                        leave.leaveStartDate,
                        leave.leaveEndDate
                      )}{" "}
                      day
                      {calculateDuration(
                        leave.leaveStartDate,
                        leave.leaveEndDate
                      ) !== 1
                        ? "s"
                        : ""}
                    </span>
                  </div>
                </div>
                <Chip
                  color={getStatusColor(leave.leaveStatus)}
                  variant="flat"
                  startContent={getStatusIcon(leave.leaveStatus)}
                  className="capitalize">
                  {leave.leaveStatus}
                </Chip>
              </div>
            }>
            <Card className="shadow-none border-0 bg-gray-50 dark:bg-neutral-900">
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
                        <span className="text-sm ">{leave.leaveSubject}</span>
                      </div>
                    </div>
                  </div>

                  {/* Management Information */}
                  <div className="space-y-4 ">
                    <h4 className="font-semibold text-gray-700 dark:text-white  flex items-center gap-2 mb-3">
                      <FaUsers className="w-4 h-4" />
                      Management Details
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 text-gray-600 dark:text-white">
                        <span className="text-sm font-medium  min-w-[120px]">
                          Team Leader:
                        </span>
                        <span className="text-sm ">{leave.teamLeaderName}</span>
                      </div>

                      <div className="flex items-start gap-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-white min-w-[120px]">
                          Assoc. Team Lead:
                        </span>
                        <span className="text-sm text-gray-800 dark:text-white">
                          {leave.associateTeamLeadName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Divider className="my-4" />

                {/* Leave Summary */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-white uppercase tracking-wide">
                        Leave Type
                      </p>
                      <p className="font-semibold text-gray-800  dark:text-white mt-1">
                        {leave.leaveType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-white uppercase tracking-wide">
                        Duration
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-white mt-1">
                        {calculateDuration(
                          leave.leaveStartDate,
                          leave.leaveEndDate
                        )}{" "}
                        day
                        {calculateDuration(
                          leave.leaveStartDate,
                          leave.leaveEndDate
                        ) !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-white uppercase tracking-wide">
                        Start Date
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-white mt-1">
                        {formatDate(leave.leaveStartDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-white uppercase tracking-wide">
                        End Date
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-white mt-1">
                        {formatDate(leave.leaveEndDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default LeaveDetails;
