import { createApi } from '@reduxjs/toolkit/query/react';
import { createBaseQuery } from '@/utils/helper';

export interface AreaListRequest {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Area {
  _id: string;
  area: string;
  date: string;
}

export interface AreaListResponse {
  result: Area[];
  itTotal: number;
}

export const areaApi = createApi({
  reducerPath: 'areaApi',
  baseQuery: createBaseQuery('/api'),
  tagTypes: ['Area'],
  endpoints: (builder) => ({
    getAreaList: builder.query<AreaListResponse, AreaListRequest>({
      query: (data: any) => ({
        url: '/get-all-area',
        params: new URLSearchParams(data)
      }),
      providesTags: ['Area']
    })
  })
});

export const { useGetAreaListQuery } = areaApi;
