import { successToast } from '@/utils/helper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useGetCurrentUserQuery,
  useLoginMutation,
  type LoginRequest
} from '../store/api/authApi';
import {
  logout as logoutAction,
  setCredentials,
  setUser
} from '../store/slices/authSlice';
import type { RootState } from '../store/store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();

  const isAuth = Boolean(token) && token !== 'undefined';

  const login = async (credentials: LoginRequest) => {
    try {
      const result = await loginMutation(credentials).unwrap();

      result?.status == 200 && successToast('Login successful!');
      dispatch(
        setCredentials({
          user: result.result,
          token: result.token
        })
      );
      localStorage.setItem('token', result.token);
      return result;
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated: isAuth,
    login,
    logout,
    isLoggingIn
  };
};

// Hook to get current user and check authentication status
export const useCurrentUser = () => {
  const dispatch = useDispatch();
  const { token, user: currentUser } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    data: user,
    isLoading,
    isError,
    error
  } = useGetCurrentUserQuery(undefined, {
    skip: !token || token == 'undefined'
  });

  // Update user in store when fetched
  if (user?.result && !currentUser) {
    dispatch(setUser(user.result));
  }

  return {
    user,
    isLoading,
    isError,
    error
  };
};
