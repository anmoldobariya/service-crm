import { errorHandlerMiddleware } from '@/middleware/errorHandler';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { amcApi } from './api/amcApi';
import { amcReportApi } from './api/amcReportApi';
import { areaApi } from './api/areaApi';
import { authApi } from './api/authApi';
import { companyApi } from './api/companyApi';
import { inquiryApi } from './api/inquiryApi';
import { invitationApi } from './api/invitationApi';
import { serviceApi } from './api/serviceApi';
import { userApi } from './api/userApi';
import authSlice from './slices/authSlice';
import resourceSlice from './slices/resourceSlice';
import { installationApi } from './api/installationApi';
import { attendanceApi } from './api/attendanceApi';

const rootReducer = {
  auth: authSlice,
  resource: resourceSlice,
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
        attendanceApi.middleware
      )
      .concat(errorHandlerMiddleware)
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
