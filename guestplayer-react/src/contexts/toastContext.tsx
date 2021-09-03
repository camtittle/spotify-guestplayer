import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import Toast, { ToastNotification, ToastStyle } from "../components/shared/toast/Toast";

export interface ToastContextType {
  showToast: (notification?: ToastNotification) => void;
}

export const ToastContext = createContext<ToastContextType>({
  showToast: () => {}
});

interface ToastContextProviderProps {
  children: React.ReactNode;
}

export const useToasts = () => {
  const toastContext = useContext(ToastContext);

  return toastContext.showToast;
}

export const ToastContextProvider = ({ children }: ToastContextProviderProps) => {
  const toastRef = useRef<Toast>(null);

  const toastContext = useRef<ToastContextType>({
    showToast: (notification?: ToastNotification) => {
      toastRef.current?.showToast(notification);
    }
  });

  return (
    <ToastContext.Provider value={toastContext?.current}>
      {children}
      <Toast ref={toastRef} />
    </ToastContext.Provider>
  );
}
