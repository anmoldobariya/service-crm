import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'

export default function RootRoute() {
  const { user } = useSelector((state: RootState) => state.auth);

  return <Navigate to={user ? '/services' : '/login'} replace />
}