import { createBaseQuery } from '@/utils/helper';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface CompanyListRequest {
  page?: number;
  limit?: number;
  search?: string;
  area?: string[];
  user?: string[];
}

export interface amc {
  start_date: string;
  end_date: string;
  amount: number;
  no_of_machines: number;
  days: number;
  status: string;
  bill_no: string;
  bill_amount: number;
  rate: string;
  total_months: number;
}

export interface Company {
  _id: string;
  code: string;
  name: string;
  is_amc_active: boolean;
  amc?: amc[];
  link?: string;
  contact_no?: string;
  assign_to?: {
    _id: string;
    name: string;
  };
  area?: {
    _id: string;
    area: string;
  };
  machines?: string;
  anyDeskId?: string;
  anyDeskPassword?: string;
  remark?: string;
  whatsapp_id?: string;
  frequency?: string;
  lastBackup?: string;
}

export interface CompanyListResponse {
  result: Company[];
  itTotal: number;
}

export const companyApi = createApi({
  reducerPath: 'companyApi',
  baseQuery: createBaseQuery('/api'),
  tagTypes: ['Company'],
  endpoints: (builder) => ({
    companyList: builder.query<CompanyListResponse, CompanyListRequest>({
      query: ({ area, user, ...restParams }) => {
        const params = new URLSearchParams(restParams as any);
        if (area?.length) area.forEach((a) => a && params.append('area[]', a));
        if (user?.length)
          user.forEach((u) => u && params.append('assign_to[]', u));

        return {
          url: '/all-company',
          params: params
        };
      },
      providesTags: ['Company']
    })
  })
});

export const { useCompanyListQuery, useLazyCompanyListQuery } = companyApi;
