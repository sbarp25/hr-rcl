import ButtonComponent from "./ui/ButtonComp";
import LocalStorageUtil from "../utils/LocalStorageUtil";
import { toast } from "sonner";

const TemporaryAdmin = () => {
  const admin = [
    {
      menuId: 18,
      actions: [
        {
          actionId: 71,
          actionName: "CREATE",
          actionDescription: "Create the security record",
        },
        {
          actionId: 72,
          actionName: "VIEW",
          actionDescription: "View the security record",
        },
        {
          actionId: 73,
          actionName: "UPDATE",
          actionDescription: "Update the security record",
        },
        {
          actionId: 74,
          actionName: "DELETE",
          actionDescription: "Delete the security record",
        },
      ],
      menuName: "SECURITY",
    },
    {
      menuId: 11,
      actions: [
        {
          actionId: 88,
          actionName: "CREATE",
          actionDescription: "Create the department record",
        },
        {
          actionId: 44,
          actionName: "View",
          actionDescription: "View the department record",
        },
        {
          actionId: 45,
          actionName: "UPDATE",
          actionDescription: "Update the department record",
        },
        {
          actionId: 46,
          actionName: "DELETE",
          actionDescription: "Delete the department record",
        },
      ],
      menuName: "DEPARTMENT",
    },
    {
      menuId: 21,
      actions: [
        {
          actionId: 81,
          actionName: "VIEW",
          actionDescription: "View the wfh data",
        },
        {
          actionId: 82,
          actionName: "ACTION",
          actionDescription: "Approve and reject wfh status",
        },
      ],
      menuName: "WFHSTATUS",
    },
    {
      menuId: 9,
      actions: [
        {
          actionId: 36,
          actionName: "VIEW",
          actionDescription: "View attendence record",
        },
      ],
      menuName: "MYATTENDANCE",
    },
    {
      menuId: 8,
      actions: [
        {
          actionId: 32,
          actionName: "VIEW",
          actionDescription: "View all ekye record",
        },
        {
          actionId: 33,
          actionName: "ACTION",
          actionDescription: "Approved or reject ekye record.",
        },
        {
          actionId: 34,
          actionName: "VIEW_ONE",
          actionDescription: "View single ekye record",
        },
      ],
      menuName: "EKYE",
    },
    {
      menuId: 5,
      actions: [
        {
          actionId: 19,
          actionName: "CREATE",
          actionDescription: "Create the handbook data",
        },
        {
          actionId: 20,
          actionName: "VIEW",
          actionDescription: "View the handbook data",
        },
        {
          actionId: 21,
          actionName: "UPDATE",
          actionDescription: "Update the handbook data",
        },
        {
          actionId: 22,
          actionName: "DELETE",
          actionDescription: "Delete the handbook data",
        },
      ],
      menuName: "HANDBOOK",
    },
    {
      menuId: 2,
      actions: [
        {
          actionId: 6,
          actionName: "VIEW_SIDEBAR",
          actionDescription: "View atttendendence on sidebar",
        },
      ],
      menuName: "ATTENDANCE",
    },
    {
      menuId: 22,
      actions: [
        {
          actionId: 83,
          actionName: "VIEW",
          actionDescription: "Vie all wfh record",
        },
        {
          actionId: 84,
          actionName: "CREATE",
          actionDescription: "Create wfh record",
        },
      ],
      menuName: "WFHREQUEST",
    },
    {
      menuId: 19,
      actions: [
        {
          actionId: 75,
          actionName: "CREATE",
          actionDescription: "Create the bank details record",
        },
        {
          actionId: 76,
          actionName: "VIEW",
          actionDescription: "View the bank details record",
        },
        {
          actionId: 77,
          actionName: "UPDATE",
          actionDescription: "Update the bank details record",
        },
        {
          actionId: 78,
          actionName: "DELETE",
          actionDescription: "Delete the bank details record",
        },
      ],
      menuName: "BANKDETAILS",
    },
    {
      menuId: 15,
      actions: [
        {
          actionId: 59,
          actionName: "CREATE",
          actionDescription: "Create the leave request",
        },
        {
          actionId: 60,
          actionName: "VIEW",
          actionDescription: "View the leave request",
        },
      ],
      menuName: "LEAVEREQUEST",
    },
    {
      menuId: 14,
      actions: [
        {
          actionId: 56,
          actionName: "VIEW",
          actionDescription: "View the leave status",
        },
        {
          actionId: 57,
          actionName: "ACTION",
          actionDescription: "Approved or reject leave status",
        },
      ],
      menuName: "LEAVESTATUS",
    },
    {
      menuId: 16,
      actions: [
        {
          actionId: 63,
          actionName: "CREATE",
          actionDescription: "Create the profile record",
        },
        {
          actionId: 64,
          actionName: "VIEW",
          actionDescription: "View the profile record",
        },
        {
          actionId: 65,
          actionName: "UPDATE",
          actionDescription: "Update the profile record",
        },
        {
          actionId: 66,
          actionName: "DELETE",
          actionDescription: "Delete the profile record",
        },
      ],
      menuName: "PROFILE",
    },
    {
      menuId: 1,
      actions: [
        {
          actionId: 1,
          actionName: "CREATE",
          actionDescription: "Create the dashboard data",
        },
        {
          actionId: 89,
          actionName: "CREATE",
          actionDescription: "Create the dashboard data",
        },
        {
          actionId: 2,
          actionName: "READ",
          actionDescription: "View the dashboard",
        },
        {
          actionId: 3,
          actionName: "UPDATE",
          actionDescription: "Update the dashboard",
        },
        {
          actionId: 4,
          actionName: "DELETE",
          actionDescription: "Delete the dashboard",
        },
      ],
      menuName: "DASHBOARD",
    },
    {
      menuId: 23,
      actions: [
        {
          actionId: 85,
          actionName: "VIEW",
          actionDescription: "View auto-checkout record",
        },
      ],
      menuName: "SELFCHECKOUT",
    },
    {
      menuId: 20,
      actions: [
        {
          actionId: 80,
          actionName: "VIEW_SIDEBAR",
          actionDescription: "View  wfh in side bar",
        },
      ],
      menuName: "WORKFROMHOME",
    },
    {
      menuId: 3,
      actions: [
        {
          actionId: 9,
          actionName: "CREATE",
          actionDescription: "Create the employee .",
        },
        {
          actionId: 10,
          actionName: "VIEW",
          actionDescription: "View the employee record",
        },
        {
          actionId: 11,
          actionName: "UPDATE",
          actionDescription: "Update the employee record",
        },
        {
          actionId: 12,
          actionName: "DELETE",
          actionDescription: "Delete the employee record",
        },
        {
          actionId: 79,
          actionName: "VIEW_ONE",
          actionDescription: "View single employee record.",
        },
      ],
      menuName: "EMPLOYEES",
    },
    {
      menuId: 12,
      actions: [
        {
          actionId: 87,
          actionName: "CREATE",
          actionDescription: "Create the position record",
        },
        {
          actionId: 48,
          actionName: "VIEW",
          actionDescription: "View the position record",
        },
        {
          actionId: 49,
          actionName: "UPDATE",
          actionDescription: "Update the position record",
        },
        {
          actionId: 50,
          actionName: "DELETE",
          actionDescription: "Delete the position record",
        },
      ],
      menuName: "POSITION",
    },
    {
      menuId: 13,
      actions: [
        {
          actionId: 86,
          actionName: "CREATE",
          actionDescription: "Create the role data",
        },
        {
          actionId: 52,
          actionName: "VIEW",
          actionDescription: "View the role record",
        },
        {
          actionId: 53,
          actionName: "UPDATE",
          actionDescription: "Update the role record",
        },
        {
          actionId: 54,
          actionName: "DELETE",
          actionDescription: "Delete the role record",
        },
      ],
      menuName: "ROLES",
    },
    {
      menuId: 6,
      actions: [
        {
          actionId: 23,
          actionName: "CREATE",
          actionDescription: "Create the notice data",
        },
        {
          actionId: 24,
          actionName: "VIEW",
          actionDescription: "View the notice data",
        },
        {
          actionId: 25,
          actionName: "UPDATE",
          actionDescription: "Update the notice data",
        },
        {
          actionId: 26,
          actionName: "DELETE",
          actionDescription: "Delete the notice data",
        },
      ],
      menuName: "NOTICE",
    },
    {
      menuId: 10,
      actions: [
        {
          actionId: 40,
          actionName: "VIEW",
          actionDescription: "View late-check-in record",
        },
        {
          actionId: 41,
          actionName: "ACTION",
          actionDescription: "Late check-in approved and reject",
        },
      ],
      menuName: "LATECHECKIN",
    },
    {
      menuId: 17,
      actions: [
        {
          actionId: 67,
          actionName: "CREATE",
          actionDescription: "Create the my ekye data",
        },
        {
          actionId: 68,
          actionName: "VIEW",
          actionDescription: "View the my ekye data",
        },
        {
          actionId: 69,
          actionName: "UPDATE",
          actionDescription: "Update the my ekye data",
        },
        {
          actionId: 70,
          actionName: "DELETE",
          actionDescription: "Delete the my ekye data",
        },
      ],
      menuName: "MYKYE",
    },
    {
      menuId: 7,
      actions: [
        {
          actionId: 28,
          actionName: "VIEW_SIDEBAR",
          actionDescription: "View leave in sidebar",
        },
      ],
      menuName: "LEAVE",
    },
    {
      menuId: 4,
      actions: [
        {
          actionId: 14,
          actionName: "VIEW_SIDEBAR",
          actionDescription: "View master data on side bar",
        },
      ],
      menuName: "MASTERDATA",
    },
  ];

  const makeTemporaryAdmin = () => {
    LocalStorageUtil.setItem("menu", admin);
    toast.success("Congrulations you are now a admin");
  };
  return (
    <div>
      <ButtonComponent onPress={makeTemporaryAdmin} content="Make me admin" />
    </div>
  );
};

export default TemporaryAdmin;
