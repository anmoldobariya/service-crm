import { createBaseQuery } from '@/utils/helper';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { User } from './authApi';

export interface UserListRequest {
  page?: number;
  limit?: number;
  search?: string;
  isInquiryUsers?: boolean;
}

export interface UserListResponse {
  result: User[];
  itTotal: number;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: createBaseQuery('/api'),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUserList: builder.query<UserListResponse, UserListRequest>({
      query: (data: any) => ({
        url: '/list',
        params: new URLSearchParams(data)
      }),
      providesTags: ['Users']
    })
  })
});

export const { useGetUserListQuery } = userApi;
