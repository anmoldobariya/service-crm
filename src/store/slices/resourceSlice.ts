import { createSlice } from '@reduxjs/toolkit';
import type { Area } from '../api/areaApi';
import type { User } from '../api/authApi';

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
  userOptioins: Option[];
  companyOptions: Option[];
}

const resourceInitialState: ResourceState = {
  areas: [],
  users: [],
  areaLoading: false,
  userLoading: false,
  areaOptions: [],
  userOptioins: [],
  companyOptions: []
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
      state.userOptioins = action.payload;
    },
    setCompanyOptions: (state, action: { payload: Option[] }) => {
      state.companyOptions = action.payload;
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
  setUserOptions
} = resourceSlice.actions;
export default resourceSlice.reducer;
