import React, { useEffect, useState } from "react";
import "./CSS/Alert.css";

const Alert = ({ message, type = "info", duration = 6000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Reset visibility when message changes
    setIsVisible(true);

    // Set a timer to hide the alert after the specified duration
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    // Clear timer on unmount or when message changes
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!message || !isVisible) return null;

  return <div className={`alert-message ${type}`}>{message}</div>;
};

export default Alert;
