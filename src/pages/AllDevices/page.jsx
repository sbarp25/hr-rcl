import { useState } from "react";
import Loader from "../../components/Loader/Loader";
import { CiMonitor } from "react-icons/ci";
import { FiSmartphone } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";
import { FaClock } from "react-icons/fa";
import ButtonComponent from "../../components/ui/ButtonComp";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@heroui/react";
import GoBack from "../../components/GoBack";
import {
  useDeleteAllDevices,
  useDeleteOneDevice,
  useFetchTrustedDevices,
} from "../../hooks/useAuth";

const AllTrustedDevices = () => {
  const [selectedDevice, setSelectedDevice] = useState();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    data: TrustedDeviceData,
    isLoading: TrustedDeviceisLoading,
    refetch: TrustedDevicesrefetch,
  } = useFetchTrustedDevices();
  const trustedDevices = TrustedDeviceData?.datalist || [];

  const deleteAllDeviceMutation = useDeleteAllDevices();
  const deleteOneDeviceMutation = useDeleteOneDevice();
  const getDeviceIcon = (deviceName) => {
    const name = deviceName.toLowerCase();
    if (
      name.includes("android") ||
      name.includes("mobile") ||
      name.includes("phone")
    ) {
      return <FiSmartphone className="w-6 h-6 text-blue-500" />;
    }
    return <CiMonitor className="w-6 h-6 text-gray-600 dark:text-white" />;
  };

  const getBrowserInfo = (userAgent) => {
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("OPR")) return "Opera";
    return "Unknown Browser";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

  const handleDelete = (deviceId) => {
    setSelectedDevice(deviceId);
    onOpen();
  };

  const deleteDevice = async () => {
    const selecteddeviceId = parseInt(selectedDevice);
    deleteOneDeviceMutation.mutate(selecteddeviceId);
    TrustedDevicesrefetch();
    onClose();
  };

  const deleteAllDevice = async () => {
    deleteAllDeviceMutation.mutate();
    TrustedDevicesrefetch();
    onClose();
  };

  if (TrustedDeviceisLoading) {
    <Loader />;
  }
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-black p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Trusted Devices
              </h1>
              <p className="text-gray-600  dark:text-white">
                Manage devices that have access to your account
              </p>
              <GoBack />
            </div>
            <ButtonComponent
              className="bg-white dark:text-red-600 text-red-600 dark:hover:text-red-700 hover:text-red-700"
              content="Remove All Device"
              onPress={() => deleteAllDevice()}
            />
          </div>
          {/* Devices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trustedDevices?.map((device) => (
              <div
                key={device.id}
                className="bg-white dark:bg-black rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* Device Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device.deviceName)}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {device.deviceName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-white">
                        {getBrowserInfo(device.userAgent)}
                      </p>
                    </div>
                  </div>
                  <div
                    className="w-3 h-3 bg-green-400 rounded-full"
                    title="Active"></div>
                </div>

                {/* Device Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FiMapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-white">
                      IP Address:
                    </span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {device.ipAddress}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <FaClock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 dark:text-white">
                      Last active:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {getRelativeTime(device.lastUsedAt)}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-white mt-3 p-3 bg-gray-50 dark:bg-slate-500 rounded-lg">
                    <div className="mb-1">
                      <span className="font-medium">Added:</span>{" "}
                      {formatDate(device.createdAt)}
                    </div>
                    <div className="truncate" title={device.userAgent}>
                      <span className="font-medium">User Agent:</span>{" "}
                      {device.userAgent.substring(0, 50)}...
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <ButtonComponent
                    className="bg-white dark:text-red-600 text-red-600 dark:hover:text-red-700 hover:text-red-700"
                    content="Remove Device"
                    onPress={() => handleDelete(device.id)}
                  />
                </div>
              </div>
            ))}
          </div>

          {trustedDevices.length === 0 && (
            <div className="text-center py-12">
              <CiMonitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No trusted devices found
              </h3>
              <p className="text-gray-500 dark:text-white">
                Your trusted devices will appear here once you add them.
              </p>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={true}
        isKeyboardDismissDisabled={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <p>
                  Are you sure you want to delete this Device From your trusted
                  list?
                </p>
                <div className="flex gap-2 justify-end mt-4">
                  <Button
                    className="bg-black text-white"
                    onPress={deleteDevice}>
                    Delete
                  </Button>
                  <Button onPress={onClose}>Cancel</Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AllTrustedDevices;
