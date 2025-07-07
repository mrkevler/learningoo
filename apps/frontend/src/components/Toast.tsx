import React from "react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

const Toast = ({
  message,
  type = "info",
  onClose,
  duration = 5000,
}: ToastProps) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const bg =
    type === "success"
      ? "bg-green-600"
      : type === "error"
        ? "bg-red-600"
        : "bg-gray-800";

  return (
    <div
      className={`${bg} fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white px-6 py-4 rounded-xl shadow-lg z-[1000] cursor-pointer`}
      onClick={onClose}
    >
      {message}
    </div>
  );
};

export default Toast;
