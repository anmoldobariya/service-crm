import { createBaseQuery } from '@/utils/helper';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { Company } from './company';

export interface AmcReportListRequest {
  type?: string;
  cid?: string;
  status?: string;
  daysWise?: number;
}

export interface AmcReport extends Company {
  amcSize: number;
}

export interface AmcReportListResponse {
  result: AmcReport[];
  itTotal: number;
}

export const amcReportApi = createApi({
  reducerPath: 'amcReportApi',
  baseQuery: createBaseQuery('/api'),
  tagTypes: ['amcReport'],
  endpoints: (builder) => ({
    amcReportList: builder.mutation<
      AmcReportListResponse,
      AmcReportListRequest
    >({
      query: (body) => ({
        url: '/amc-report',
        method: 'POST',
        body
      })
    })
  })
});

export const { useAmcReportListMutation } = amcReportApi;
