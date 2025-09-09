import { createBaseQuery } from '@/utils/helper';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface Service {
  _id: string;
  cid: {
    code?: string;
    name?: string;
    link?: string;
  };
  issue: string;
  machine: string;
  services?: {
    machine_no?: string;
    remark?: string;
  }[];
  issued_on: string;
  status: string;
  created_by: string;
  date: string;
  area: {
    area?: string;
  };
  convertedDate: string;
  assigned_to?: {
    name?: string;
  };
  phone_no?: string;
  create_by?: string;
  closedDate?: string;
}

export interface ServiceListRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string[];
  area?: string[];
}

export interface ServiceListResponse {
  result: Service[];
  itTotal: number;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  price?: number;
  category?: string;
  status?: string;
}

export interface UpdateServiceRequest {
  _id: string;
  body: Partial<Service>;
}

export interface DeleteServiceRequest {
  _id: string;
}

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: createBaseQuery('/api'),
  tagTypes: ['Services'],
  endpoints: (builder) => ({
    getServiceList: builder.mutation<ServiceListResponse, ServiceListRequest>({
      query: (body) => ({
        url: 'all-service',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Services']
    }),
    addService: builder.mutation<Service, { body: CreateServiceRequest }>({
      query: ({ body }) => ({
        url: 'create-service',
        method: 'POST',
        body: body
      }),
      invalidatesTags: ['Services']
    }),
    updateService: builder.mutation<Service, UpdateServiceRequest>({
      query: (param) => ({
        url: `edit-service/${param._id}`,
        method: 'PATCH',
        body: param.body
      }),
      invalidatesTags: (result, error, _arg) =>
        error ? [] : [{ type: 'Services', id: result?._id }]
    }),
    deleteService: builder.mutation<{ success: boolean }, DeleteServiceRequest>(
      {
        query: (body) => ({
          url: 'remove-service',
          method: 'POST',
          body
        }),
        invalidatesTags: ['Services']
      }
    ),
    getServicesById: builder.query<Service, string>({
      query: (id) => ({
        url: `get-service/${id}`,
        method: 'GET'
      }),
      providesTags: (_result, _error, id) => [{ type: 'Services', id }]
    })
  })
});

export const {
  useGetServiceListMutation,
  useAddServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesByIdQuery
} = serviceApi;
