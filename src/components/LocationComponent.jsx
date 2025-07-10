import { useEffect, useState, useCallback } from "react";
import LocalStorageUtil from "../utils/LocalStorageUtil";

const LocationComponent = () => {
  const [accuracy, setAccuracy] = useState(null);
  const [status, setStatus] = useState("Initializing...");
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  // Check if device supports geolocation
  useEffect(() => {
    const checkSupport = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser");
        setStatus("Not supported");
        return false;
      }

      // More flexible HTTPS check for mobile
      const isSecure =
        location.protocol === "https:" ||
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1" ||
        location.hostname.includes("192.168.") ||
        location.hostname.includes("10.0.") ||
        location.hostname.includes("172.");

      if (!isSecure) {
        // Don't block on mobile - some browsers allow it
        setError("Geolocation may require HTTPS - trying anyway...");
      }

      setIsSupported(true);

      return true;
    };

    checkSupport();
  }, []);

  // Handle successful location retrieval
  const handleSuccess = useCallback((position) => {
    const { latitude, longitude, accuracy, timestamp } = position.coords;

    try {
      // Store location data with error handling
      LocalStorageUtil.setItem("latitude", latitude);
      LocalStorageUtil.setItem("longitude", longitude);

      localStorage.setItem("locationAccuracy", accuracy.toString());

      setAccuracy(accuracy);
      setStatus(`Location acquired (±${Math.round(accuracy)}m)`);
      setError(null);
    } catch (storageError) {
      setError("Error storing location data");
    }
  }, []);

  // Handle geolocation errors
  const handleError = useCallback((error) => {
    let errorMessage = "Unknown error occurred";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage =
          "Location access denied - please enable location permissions";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information unavailable - check GPS/network";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out - trying again...";
        break;
      default:
        errorMessage = `Geolocation error: ${error.message}`;
    }

    LocalStorageUtil.setItem("locationError", errorMessage);
    setError(errorMessage);
    setStatus("Error");

    // Auto-retry on timeout for mobile
    if (error.code === error.TIMEOUT) {
      setTimeout(() => {
        requestLocation();
      }, 2000);
    }
  }, []);

  // Request location permission and start tracking
  const requestLocation = useCallback(() => {
    if (!isSupported) return;

    setStatus("Requesting location...");
    setError(null);

    // Mobile-optimized options
    const options = {
      enableHighAccuracy: true,
      timeout: 20000, // 20 seconds - not too long for mobile
      maximumAge: 300000, // 5 minutes cache for better mobile experience
    };

    // Try multiple approaches for mobile compatibility
    const tryGetLocation = () => {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        (error) => {
          // If getCurrentPosition fails, try watchPosition
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              handleSuccess(position);
              // Clear watch after first success
              navigator.geolocation.clearWatch(watchId);
            },
            handleError,
            {
              enableHighAccuracy: false, // Try with lower accuracy first
              timeout: 30000,
              maximumAge: 0,
            }
          );

          // Store watchId for cleanup
          LocalStorageUtil.setItem("geolocationWatchId", watchId);

          // Fallback timeout
          setTimeout(() => {
            navigator.geolocation.clearWatch(watchId);

            // Try one more time with basic options
            navigator.geolocation.getCurrentPosition(
              handleSuccess,
              handleError,
              {
                enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 600000, // 10 minutes
              }
            );
          }, 25000);
        },
        options
      );
    };

    tryGetLocation();
  }, [isSupported, handleSuccess, handleError]);

  // Initialize location tracking
  useEffect(() => {
    if (!isSupported) return;

    // Immediate request
    requestLocation();

    // Also try after a short delay for mobile browsers
    const timer = setTimeout(() => {
      requestLocation();
    }, 1000);

    return () => {
      clearTimeout(timer);

      // Cleanup any active watch
      const watchId = LocalStorageUtil.getItem("geolocationWatchId");
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        LocalStorageUtil.setItem("geolocationWatchId", null);
      }
    };
  }, [isSupported, requestLocation]);

  return null;
};

export default LocationComponent;
