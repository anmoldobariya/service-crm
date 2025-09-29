import { createBaseQuery } from '@/utils/helper';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface InstallationListRequest {
  page?: number;
  limit?: number;
  search?: string;
  status?: string[];
}

export interface Stage {
  name: string;
  assignedEngineerIds: {
    _id: string;
    name: string;
    email: string;
  }[];
  status: 'pending' | 'completed';
  requiresProof: boolean;
  proofSubmittedBy?: string;
  proofPdfUrl?: string;
  completedAt?: string;
}

export interface Installation {
  _id: string;
  companyName: string;
  machine: number;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  currentStageIndex: number;
  createdAt: string;
  updatedAt: string;
  architecturePdfUrl?: string;
  stages: Stage[];
}
export interface InstallationListResponse {
  result: Installation[];
  itTotal: number;
}

export const installationApi = createApi({
  reducerPath: 'installationApi',
  baseQuery: createBaseQuery('/api'),
  tagTypes: ['Installation'],
  endpoints: (builder) => ({
    installationList: builder.query<Installation[], InstallationListRequest>({
      query: ({ status, ...restParams }) => {
        const params = new URLSearchParams(
          restParams as Record<string, string>
        );
        status?.forEach((s: string) => params.append('status[]', s));
        return {
          url: '/installations',
          params
        };
      },
      providesTags: ['Installation']
    })
  })
});

export const { useInstallationListQuery } = installationApi;
