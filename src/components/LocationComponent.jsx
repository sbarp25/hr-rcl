import { useEffect, useState } from "react";
import LocalStorageUtil from "../utils/LocalStorageUtil"; // Adjust the path as needed

const LocationComponent = () => {
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => {
    // Function to capture and store location data
    const storeLocationData = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      LocalStorageUtil.setItem("latitude", latitude); // Use utility to set data
      LocalStorageUtil.setItem("longitude", longitude);
      LocalStorageUtil.setItem("locationAccuracy", accuracy);
      setAccuracy(accuracy);

      console.log(
        `Location updated: ${latitude}, ${longitude} (±${accuracy.toFixed(1)}m)`
      );
    };

    // Function to handle location errors
    const handleError = (error) => {
      console.error("Error getting location:", error);
      LocalStorageUtil.setItem("locationError", error.message);
    };

    const options = {
      enableHighAccuracy: true, // Get the most precise location possible
      timeout: 15000, // Increased timeout to 15 seconds to allow GPS lock
      maximumAge: 0, // Always fetch the latest location data
    };

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      LocalStorageUtil.setItem("locationError", "Geolocation not supported");
      return;
    }

    // Use watchPosition instead of getCurrentPosition for continuous updates
    // This will help improve accuracy over time as the device gets better fixes
    const watchId = navigator.geolocation.watchPosition(
      storeLocationData,
      handleError,
      options
    );

    // Set initial position immediately as well
    navigator.geolocation.getCurrentPosition(
      storeLocationData,
      handleError,
      options
    );

    // Cleanup function to clear the watch when component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
      // Removed the cleanup that deletes the location data
      // This allows the location to persist after component unmount
    };
  }, []);

  return <div></div>;
};

export default LocationComponent;
