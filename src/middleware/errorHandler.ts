import { logout } from '@/store/slices/authSlice';
import { errorToast } from '@/utils/helper';
import type { Middleware } from '@reduxjs/toolkit';

export const errorHandlerMiddleware: Middleware =
  (storeAPI) => (next) => (action: any) => {
    const status =
      action.payload?.status ??
      action.payload?.data?.status ??
      action.error?.status;

    if (!status || status === 200) return next(action);

    // If it's a rejected query with 500 status
    if (status === 500) {
      errorToast('Server temporarily down. Please try again later.');
      storeAPI.dispatch(logout());

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return next(action);
    }

    if (status === 401) {
      const errMsg =
        action.payload?.message ||
        action.payload?.data?.message ||
        action.payload?.error?.message ||
        'Unauthorized access. Logging out...';

      errorToast(errMsg);
      storeAPI.dispatch(logout());

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return next(action);
    }

    const message =
      action.payload?.message ||
      action.payload?.data?.message ||
      action.payload?.error?.message ||
      'An unexpected error occurred.';

    errorToast(message);

    return next(action);
  };
