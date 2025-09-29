import { errorHandlerMiddleware } from '@/middleware/errorHandler';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { amcApi } from './api/amc';
import { amcReportApi } from './api/amcReport';
import { areaApi } from './api/area';
import { attendanceApi } from './api/attendance';
import { authApi } from './api/auth';
import { companyApi } from './api/company';
import { inquiryApi } from './api/inquiry';
import { installationApi } from './api/installation';
import { invitationApi } from './api/invitation';
import { serviceApi } from './api/service';
import { userApi } from './api/user';
import authSlice from './slices/authSlice';
import resourceSlice from './slices/resourceSlice';
import refetchSlice from './slices/refetchSlice';
import { issueApi } from './api/issue';

const rootReducer = {
  auth: authSlice,
  resource: resourceSlice,
  refetch: refetchSlice,
  [authApi.reducerPath]: authApi.reducer,
  [serviceApi.reducerPath]: serviceApi.reducer,
  [areaApi.reducerPath]: areaApi.reducer,
  [amcApi.reducerPath]: amcApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [invitationApi.reducerPath]: invitationApi.reducer,
  [companyApi.reducerPath]: companyApi.reducer,
  [inquiryApi.reducerPath]: inquiryApi.reducer,
  [amcReportApi.reducerPath]: amcReportApi.reducer,
  [installationApi.reducerPath]: installationApi.reducer,
  [attendanceApi.reducerPath]: attendanceApi.reducer,
  [issueApi.reducerPath]: issueApi.reducer
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        authApi.middleware,
        serviceApi.middleware,
        areaApi.middleware,
        amcApi.middleware,
        userApi.middleware,
        invitationApi.middleware,
        companyApi.middleware,
        inquiryApi.middleware,
        amcReportApi.middleware,
        installationApi.middleware,
        attendanceApi.middleware,
        issueApi.middleware
      )
      .concat(errorHandlerMiddleware)
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
