import { createBaseQuery } from '@/utils/helper';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface InvitationListRequest {
  isRequested: boolean;
}

export interface Invitation {
  _id: string;
  name: string;
  email: string;
  date: string;
  role: string;
  invitedBy: {
    _id: string;
    email: string;
  };
  accessFields: string[];
}

export interface InvitationListResponse {
  result: Invitation[];
}

export const invitationApi = createApi({
  reducerPath: 'invitationApi',
  baseQuery: createBaseQuery('/api'),
  tagTypes: ['invitation'],
  endpoints: (builder) => ({
    invitationList: builder.query<InvitationListResponse, InvitationListRequest>({
      query: (data: any) => ({
        url: '/invitedUsers',
        params: new URLSearchParams(data)
      }),
      providesTags: ['invitation']
    })
  })
});

export const { useInvitationListQuery } = invitationApi;
