import React from "react";
import { IoShieldCheckmark } from "react-icons/io5";
import { Link } from "react-router-dom";

const Security = () => {
  const redirect = [
    {
      icon: IoShieldCheckmark,
      label: "Change Password",
      to: "/changePassword",
    },
    {
      icon: IoShieldCheckmark,
      label: "Multi Factor Authentication",
      to: "/MFA",
    },
    {
      icon: IoShieldCheckmark,
      label: "Trusted Device",
      to: "/trustedDevicess",
    },
    // {
    //   icon: IoShieldCheckmark,
    //   label: "Dark Mode Setting",
    //   to: "/dark",
    // },
  ];

  return (
    <div className="mx-auto p-6 space-y-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Security Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Keep your account safe and secure
        </p>
      </div>

      {redirect.map((link) => (
        <Link to={link.to} key={link.label} className="block group">
          <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl p-6 transition-all duration-200 hover:shadow-lg ">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center  transition-colors duration-200">
                  <link.icon className="w-6 h-6 " />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white  transition-colors duration-200">
                  {link.label}
                </h3>
              </div>
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500  transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Security;
