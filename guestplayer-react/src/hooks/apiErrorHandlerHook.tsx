import React, { useContext } from 'react';
import { ApiError } from '../api/error/ApiError';
import { ErrorCode } from '../api/error/ErrorCodes';
import { PartyErrorType } from '../api/models/partyErrorType';
import { ToastStyle } from '../components/shared/toast/Toast';
import { PartyContext } from '../contexts/partyContext';
import { ToastContext } from '../contexts/toastContext';

export type ApiErrorHandler = (callback: () => Promise<void>) => Promise<void>;

export function useApiErrorHandler(): ApiErrorHandler {
  
  const partyContext = useContext(PartyContext);
  const toastContext = useContext(ToastContext);

  const handlePartyEndedErrors = (error: ApiError): boolean => {
    // const partyEnded = error && error.response && error.response.data;
    console.log(error.errorCode);
    if (error.errorCode === ErrorCode.PartyEnded) {
      partyContext.setParty(undefined);

      // Timeout delay allows page transition to happen before showing dialog, reducing UI lag
      setTimeout(() => {
        partyContext.setError(PartyErrorType.PartyEnded);
      }, 500);
      return true;
    }
    
    return false;
  }

  const handleGenericErrors = (error: any): boolean => {
    toastContext.showToast({
      style: ToastStyle.Error,
      text: 'Something went wrong. Please try again.'
    })
    return true;
  };

  return async (callback: () => Promise<void>) => {
    try {
      await callback();
    } catch (error) {
      if (error.isApiError) {
        const errorHandlers = [
          handlePartyEndedErrors,
          handleGenericErrors
        ];
  
        for (const handler of errorHandlers) {
          const errorHandled = handler(error);
          if (errorHandled) {
            break;
          }
        }
      } else {
        handleGenericErrors(error);
      }
    }
  };
}

export const withApiErrorHandler = <P extends object>(Component: React.ComponentType<P>) => {
  return React.forwardRef((props: any, ref: any) => {
    const apiErrorHandler = useApiErrorHandler();

    return <Component apiErrorHandler={apiErrorHandler} ref={ref} {...props} />;
  });
};
