"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { ...toast, id };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove after duration
      const duration = toast.duration || 4000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "success", message, duration });
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "error", message, duration });
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "info", message, duration });
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      addToast({ type: "warning", message, duration });
    },
    [addToast]
  );

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
