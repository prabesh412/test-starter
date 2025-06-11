"use client";

import { useEffect } from "react";
import { X, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { useToast, Toast } from "@/contexts/toast-context";

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div
      className={`flex items-center space-x-3 p-4 rounded-lg border ${getBackgroundColor()} shadow-lg animate-in slide-in-from-right-full`}
    >
      {getIcon()}
      <p className="flex-1 text-sm font-medium text-gray-900">
        {toast.message}
      </p>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 hover:bg-gray-200"
        onClick={() => onRemove(toast.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
