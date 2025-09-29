import { createSlice } from '@reduxjs/toolkit';

interface RefetchState {
  serviceRefetch: boolean;
}

const refetchInitialState: RefetchState = {
  serviceRefetch: false
};

const refetchSlice = createSlice({
  name: 'refetch',
  initialState: refetchInitialState,
  reducers: {
    setServiceRefetch: (state, action: { payload: boolean }) => {
      state.serviceRefetch = action.payload;
    }
  }
});

export const { setServiceRefetch } = refetchSlice.actions;
export default refetchSlice.reducer;
