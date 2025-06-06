import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../../lib/axios-Instance";
import { toast } from "sonner";
import { Accordion, AccordionItem } from "@heroui/react";

const WFHdetails = ({ employeeData }) => {
  const workFromHome = employeeData?.workFromHomeResponse || [];

  return (
    <div>
      {" "}
      <div>
        <Accordion variant="bordered">
          {workFromHome.map((wfh) => (
            <AccordionItem
              key={wfh.id}
              aria-label={wfh.workFromHomeStartDate}
              title={wfh.workFromHomeStartDate}>
              <div className="space-y-2">
                <p>
                  <strong>Employee:</strong> {wfh.userFullName}
                </p>
                <p>
                  <strong>Date:</strong> {wfh.workFromHomeStartDate} to{" "}
                  {wfh.workFromHomeEndDate}
                </p>
                <p>
                  <strong>Subject:</strong> {wfh.title}
                </p>
                <p>
                  <strong>Approved By</strong> {wfh.approverFullName || "N/A"}
                </p>
                <p>
                  <strong>Department:</strong> {wfh.departmentName}
                </p>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default WFHdetails;
