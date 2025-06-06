import React, { useEffect, useState } from "react";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { useForm } from "react-hook-form";
import { useDisclosure } from "@heroui/react";
import axiosInstance from "../../../../../lib/axios-Instance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LeaveDetails = ({ employeeData }) => {
  const leaveData = employeeData?.leaveManagementResponse || [];

  return (
    <div>
      <Accordion variant="bordered">
        {leaveData.map((leave) => (
          <AccordionItem
            key={leave.leaveId}
            aria-label={leave.leaveStartDate}
            title={leave.leaveStartDate}>
            <div className="space-y-2">
              <p>
                <strong>Employee:</strong> {leave.fullName}
              </p>
              <p>
                <strong>Leave Type:</strong> {leave.leaveType}
              </p>
              <p>
                <strong>Status:</strong> {leave.leaveStatus}
              </p>
              <p>
                <strong>Date:</strong> {leave.leaveStartDate} to{" "}
                {leave.leaveEndDate}
              </p>
              <p>
                <strong>Subject:</strong> {leave.leaveSubject}
              </p>
              <p>
                <strong>Team Leader:</strong> {leave.teamLeaderName}
              </p>
              <p>
                <strong>Associate Team Lead:</strong>{" "}
                {leave.associateTeamLeadName}
              </p>
              <p>
                <strong>Department:</strong> {leave.departmentName}
              </p>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default LeaveDetails;
