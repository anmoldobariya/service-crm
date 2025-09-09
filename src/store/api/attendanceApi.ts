import { createBaseQuery } from '@/utils/helper';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface AttendanceData {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  total_duration: number;
  attendances: Array<{
    day: number;
    _id: string;
    date: string;
    duration: number;
    overTimeDuration: number;
    isOvertimeApproved: boolean | null;
    sessions: Array<{
      startTime: string;
      endTime: string;
      note: string;
      _id: string;
    }>;
  }>;
}

export interface AttendanceApiResponse {
  status: number;
  message: string;
  result: {
    total_duration: number;
    data: AttendanceData[];
  };
}

export interface AttendanceQueryParams {
  month: number;
  year: number;
}

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: createBaseQuery('/api/attendance'),
  tagTypes: ['Attendance'],
  endpoints: (builder) => ({
    getAttendance: builder.query<AttendanceApiResponse, AttendanceQueryParams>({
      query: (params) => ({
        url: '',
        params
      }),
      providesTags: ['Attendance']
    })
  })
});

export const { useGetAttendanceQuery } = attendanceApi;
