import { createBaseQuery } from '@/utils/helper';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { Company } from './companyApi';

export interface AmcListRequest {
  page?: number;
  limit?: number;
  search?: string;
  isInquiryUsers?: boolean;
}

export interface AmcListResponse {
  result: Company[];
  itTotal: number;
}

export const amcApi = createApi({
  reducerPath: 'amcApi',
  baseQuery: createBaseQuery('/api'),
  tagTypes: ['AMC'],
  endpoints: (builder) => ({
    getAMCLists: builder.query<AmcListResponse, AmcListRequest>({
      query: () => '/all-company',
      providesTags: ['AMC']
    })
  })
});

export const { useGetAMCListsQuery } = amcApi;
