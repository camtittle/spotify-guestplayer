import React, { createContext, useState } from "react";
import Toast, { ToastState } from "../components/shared/toast/Toast";

interface ToastContextType {
  toastState: ToastState;
  label: string;
  setToastState: (state: ToastState, label: string) => void;
}

export const ToastContext = createContext<ToastContextType>({
  toastState: ToastState.Disabled,
  label: '',
  setToastState: () => {}
});

interface ToastContextProviderProps {
  children: React.ReactNode;
}

export const ToastContextProvider = ({ children }: ToastContextProviderProps) => {
  
  const [toastContext, setToastContext] = useState<ToastContextType>({
    toastState: ToastState.Disabled,
    label: '',
    setToastState: (toastState: ToastState, label: string) => {
      setToastContext((previous) => {
        return { ...previous, toastState, label}
      });
    }
  });

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
      <Toast state={toastContext.toastState} label={toastContext.label} />
    </ToastContext.Provider>
  );
}
