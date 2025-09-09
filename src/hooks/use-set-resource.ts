import { useGetAreaListQuery } from '@/store/api/areaApi';
import { useCompanyListQuery } from '@/store/api/companyApi';
import { useGetUserListQuery } from '@/store/api/userApi';
import {
  setAreaLoading,
  setAreaOptions,
  setAreas,
  setCompanyOptions,
  setUserLoading,
  setUserOptions,
  setUsers
} from '@/store/slices/resourceSlice';
import type { RootState } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useSetResource() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: AreaList, isFetching: AreaFetching } = useGetAreaListQuery(
    {},
    { skip: !user }
  );
  const { data: userList, isFetching: UserFetching } = useGetUserListQuery(
    {
      isInquiryUsers: false
    },
    { skip: !user }
  );
  const { data: companyList } = useCompanyListQuery({}, { skip: !user });

  useEffect(() => {
    dispatch(setAreaLoading(AreaFetching));
    const areas = AreaList?.result || [];
    dispatch(setAreas(areas));

    const areaOptions = areas.map((a) => ({ label: a.area, value: a._id }));
    dispatch(setAreaOptions(areaOptions));
  }, [AreaList, AreaFetching]);

  useEffect(() => {
    dispatch(setUserLoading(UserFetching));
    const users = userList?.result || [];
    dispatch(setUsers(users));

    const userOptions = users.map((u) => ({
      label: u.name,
      value: u._id
    }));
    dispatch(setUserOptions(userOptions));
  }, [userList, UserFetching]);

  useEffect(() => {
    const companyOptions = (companyList?.result || []).map((c) => ({
      label: `${c.code} - ${c.name}`,
      value: c._id
    }));
    dispatch(setCompanyOptions(companyOptions));
  }, [companyList]);
}
