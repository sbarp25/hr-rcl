import LocalStorageUtil from "./LocalStorageUtil";

export class PermissionManager {
  constructor() {
    this.menuData = this.getMenuData();
  }

  getMenuData() {
    try {
      const menu = LocalStorageUtil.getItem("menu");
      return menu ?? [];
    } catch (error) {
      console.error("Error getting menu data:", error);
      return [];
    }
  }

  // Check if user has specific permission for a menu
  hasPermission(menuName, actionName) {
    if (!this.menuData || !Array.isArray(this.menuData)) return false;

    const menu = this.menuData.find(
      (item) => item.menuName?.toLowerCase() === menuName.toLowerCase()
    );

    if (!menu || !menu.actions) return false;

    return menu.actions.some(
      (action) => action.actionName?.toLowerCase() === actionName.toLowerCase()
    );
  }

  // Refresh menu data from localStorage
  refresh() {
    this.menuData = this.getMenuData();
  }
}

// Create a singleton instance
export const permissionManager = new PermissionManager();

// Convenience functions for common operations
export const hasPermission = (menuName, actionName) =>
  permissionManager.hasPermission(menuName, actionName);

export const hasCreateAccess = (menuName) =>
  permissionManager.hasPermission(menuName, "CREATE");

export const hasReadAccess = (menuName) =>
  permissionManager.hasPermission(menuName, "VIEW");

export const hasUpdateAccess = (menuName) =>
  permissionManager.hasPermission(menuName, "UPDATE");

export const hasDeleteAccess = (menuName) =>
  permissionManager.hasPermission(menuName, "DELETE");

export const hasApproveAccess = (menuName) =>
  permissionManager.hasPermission(menuName, "ACTION");

export const hasRejectAccess = (menuName) =>
  permissionManager.hasPermission(menuName, "ACTION");

export const hasViewSingleAccess = (menuName) =>
  permissionManager.hasPermission(menuName, "VIEW_SIDEBAR");

export const hasViewone = (menuName) =>
  permissionManager.hasPermission(menuName, "VIEW_ONE");

// Menu name constants based on backend data
export const MENU_NAMES = {
  DASHBOARD: "DASHBOARD",
  ATTENDANCE: "ATTENDANCE",
  EMPLOYEES: "EMPLOYEES",
  MASTERDATA: "MASTERDATA",
  HANDBOOK: "HANDBOOK",
  NOTICE: "NOTICE",
  LEAVE: "LEAVE",
  EKYE: "EKYE",
  DEPARTMENT: "DEPARTMENT",
  POSITION: "POSITION",
  ROLES: "ROLES",
  PROFILE: "PROFILE",
  MYKYE: "MYKYE",
  SECURITY: "SECURITY",
  MYATTENDANCE: "MYATTENDANCE",
  LATECHECKIN: "LATECHECKIN",
  LEAVESTATUS: "LEAVESTATUS",
  LEAVEREQUEST: "LEAVEREQUEST",
  BANKDETAILS: "BANKDETAILS",
  WORKFROMHOME: "WORKFROMHOME",
  WFHSTATUS: "WFHSTATUS",
  WFHREQUEST: "WFHREQUEST",
  SELFCHECKOUT: "SELFCHECKOUT",
};

// Action name constants
export const ACTION_NAMES = {
  CREATE: "CREATE",
  VIEW: "VIEW",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  ACTION: "ACTION",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  VIEW_SIDEBAR: "VIEW_SIDEBAR",
  VIEW_ONE: "VIEW_ONE",
};
