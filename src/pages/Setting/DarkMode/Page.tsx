import React from "react";
import GoBack from "../../../components/GoBack";
import { IoInformationCircle, IoMoon, IoSunny } from "react-icons/io5";
import { ThemeSwitcher } from "../../../components/ThemeSwitcher";

const DarkMode = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 ">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    Appearance
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Customize your visual experience
                  </p>
                </div>
              </div>
              <GoBack />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Theme Switcher Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2  dark:bg-gray-700 rounded-lg">
                    <IoMoon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Dark Mode
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                </div>
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DarkMode;
