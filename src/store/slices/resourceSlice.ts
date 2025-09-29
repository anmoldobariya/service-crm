import { createSlice } from '@reduxjs/toolkit';
import type { Area } from '../api/area';
import type { User } from '../api/auth';

interface Option {
  label: string;
  value: string;
}
interface ResourceState {
  areas: Area[];
  users: User[];
  areaLoading: boolean;
  userLoading: boolean;
  areaOptions: Option[];
  userOptions: Option[];
  companyOptions: Option[];
  issuesOptions: Option[];
}

const resourceInitialState: ResourceState = {
  areas: [],
  users: [],
  areaLoading: false,
  userLoading: false,
  areaOptions: [],
  userOptions: [],
  companyOptions: [],
  issuesOptions: []
};

const resourceSlice = createSlice({
  name: 'resource',
  initialState: resourceInitialState,
  reducers: {
    setAreas: (
      state,
      action: {
        payload: Area[];
      }
    ) => {
      state.areas = action.payload;
    },
    setUsers: (
      state,
      action: {
        payload: User[];
      }
    ) => {
      state.users = action.payload;
    },
    setAreaLoading: (state, action: { payload: boolean }) => {
      state.areaLoading = action.payload;
    },
    setUserLoading: (state, action: { payload: boolean }) => {
      state.userLoading = action.payload;
    },
    setAreaOptions: (state, action: { payload: Option[] }) => {
      state.areaOptions = action.payload;
    },
    setUserOptions: (state, action: { payload: Option[] }) => {
      state.userOptions = action.payload;
    },
    setCompanyOptions: (state, action: { payload: Option[] }) => {
      state.companyOptions = action.payload;
    },
    setIssuesOptions: (state, action: { payload: Option[] }) => {
      state.issuesOptions = action.payload;
    }
  }
});

export const {
  setAreas,
  setAreaLoading,
  setUsers,
  setUserLoading,
  setAreaOptions,
  setCompanyOptions,
  setUserOptions,
  setIssuesOptions
} = resourceSlice.actions;
export default resourceSlice.reducer;
