import { createBaseQuery } from '@/utils/helper';
import { createApi } from '@reduxjs/toolkit/query/react';

export interface Issue {
  _id: string;
  issue: string;
}

export interface IssueListResponse {
  result: Issue[];
  itTotal: number;
}

export const issueApi = createApi({
  reducerPath: 'issueApi',
  baseQuery: createBaseQuery('/api'),
  tagTypes: ['Issue'],
  endpoints: (builder) => ({
    getIssuesLists: builder.query<IssueListResponse, null>({
      query: () => 'get-all-issue',
      providesTags: ['Issue']
    })
  })
});

export const { useGetIssuesListsQuery } = issueApi;
