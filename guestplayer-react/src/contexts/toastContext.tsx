import React, { createContext, useState } from "react";
import Toast, { ToastState } from "../components/shared/toast/Toast";

interface ToastContextType {
  toastState: ToastState;
  setToastState: (state: ToastState) => void;
}

export const ToastContext = createContext<ToastContextType>({
  toastState: ToastState.Disabled,
  setToastState: () => {}
});

interface ToastContextProviderProps {
  children: React.ReactNode;
}

export const ToastContextProvider = ({ children }: ToastContextProviderProps) => {
  
  const [toastContext, setToastContext] = useState<ToastContextType>({
    toastState: ToastState.Disabled,
    setToastState: (toastState: ToastState) => {
      setToastContext((previous) => {
        return { ...previous, toastState: toastState, }
      });
    }
  });

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
}
