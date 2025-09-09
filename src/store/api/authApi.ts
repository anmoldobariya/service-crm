import { createBaseQuery } from '@/utils/helper';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  result: User;
  token: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  phone_no?: string;
  areas: string[];
  accessFields: string[];
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: createBaseQuery('/api'),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials
      })
    }),
    getCurrentUser: builder.query<Omit<LoginResponse, 'token'>, void>({
      query: () => 'profile',
      providesTags: ['User']
    })
  })
});

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;
