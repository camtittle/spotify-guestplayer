import React, { createContext, useEffect, useRef, useState } from "react";
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

export const ToastContextProvider = ({ children }: ToastContextProviderProps) => {

  const history = useHistory();

  useEffect(() => {
    const unregister = history.listen((location) => {
      (window as any).ga('set', 'page', );
      // (window as any).ga('send', 'pageview');
      gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
      })
      
    });

    return () => {
      unregister();
    }
  }, [history])
  
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
