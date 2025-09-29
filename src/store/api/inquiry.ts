import { createBaseQuery } from '@/utils/helper';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface InquiryListRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface FollowUp {
  _id: string;
  followupDate: string;
  description: string;
  allowUser: string;
}

export interface Inquiry {
  _id: string;
  companyname: string;
  personName: string;
  contact?: string;
  machinetype: string;
  machine?: string;
  address?: string;
  status: string;
  followUp?: FollowUp[];
  date: string;
}

export interface InquiryListResponse {
  result: Inquiry[];
  itTotal: number;
}

export const inquiryApi = createApi({
  reducerPath: 'inquiryApi',
  baseQuery: createBaseQuery('/api'),
  tagTypes: ['Inquiry'],
  endpoints: (builder) => ({
    getInquiryList: builder.query<InquiryListResponse, InquiryListRequest>({
      query: (data: any) => ({
        url: '/all-inquiry',
        params: new URLSearchParams(data)
      }),
      providesTags: ['Inquiry']
    })
  })
});

export const { useGetInquiryListQuery } = inquiryApi;
