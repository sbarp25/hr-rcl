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
  permissionManager.hasPermission(menuName, "READ");

export const hasUpdateAccess = (menuName) =>
  permissionManager.hasPermission(menuName, "UPDATE");

export const hasDeleteAccess = (menuName) =>
  permissionManager.hasPermission(menuName, "DELETE");

export const hasApproveAccess = (menuName) =>
  permissionManager.hasPermission(menuName, "APPROVE");

export const hasRejectAccess = (menuName) =>
  permissionManager.hasPermission(menuName, "REJECT");

// Menu name constants based on backend data
export const MENU_NAMES = {
  ATTENDANCE: "ATTENDANCE",
  EMPLOYEES: "EMPLOYEES",
  MASTERDATA: "MASTERDATA",
  HANDBOOK: "HANDBOOK",
  NOTICE: "NOTICE",
  LEAVE: "LEAVE",
  EKYE: "EKYE",
  MYATTENDANCE: "MYATTENDANCE",
  LATECHECKIN: "LATECHECKIN",
  DEPARTMENT: "DEPARTMENT",
  POSITION: "POSITION",
  ROLES: "ROLES",
  LEAVESTATUS: "LEAVESTATUS",
  LEAVEREQUEST: "LEAVEREQUEST",
  PROFILE: "PROFILE",
  MYKYE: "MYKYE",
  SECURITY: "SECURITY",
  BANKDETAILS: "BANKDETAILS",
  DASHBOARD: "DASHBOARD",
  WORKFROMHOME: "WORKFROMHOME",
};

// Action name constants
export const ACTION_NAMES = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
};
