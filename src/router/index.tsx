import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

const RootRoute = lazy(() => import('@/router/RootRoute'))
const ProtectedRoute = lazy(() => import('@/router/ProtectedRoute'))
const AppLayout = lazy(() => import('@/components/layout/AppLayout'))
const LoginPage = lazy(() => import('@/pages/Login'))
const ServicePage = lazy(() => import('@/pages/Services'))
const AmcPage = lazy(() => import('@/pages/Amc'))
const AreaPage = lazy(() => import('@/pages/Area'))
const UsersPage = lazy(() => import('@/pages/Users'))
const AttendancePage = lazy(() => import('@/pages/Attendance'))
const CompanyPage = lazy(() => import('@/pages/Company'))
const InstallationPage = lazy(() => import('@/pages/Installation'))
const InquiryPage = lazy(() => import('@/pages/Inquiry'))
const ReportPage = lazy(() => import('@/pages/Report'))
const AmcReportPage = lazy(() => import('@/pages/AmcReport'))
const InvitationPage = lazy(() => import('@/pages/Invitation'))

const AuthRoutes = [
  {
    path: '/services',
    element: <ServicePage />
  },
  {
    path: '/amc',
    element: <AmcPage />
  },
  {
    path: '/users',
    element: <UsersPage />
  },
  {
    path: '/attendance',
    element: <AttendancePage />
  },
  {
    path: '/installation',
    element: <InstallationPage />
  },
  {
    path: '/company',
    element: <CompanyPage />
  },
  {
    path: '/area',
    element: <AreaPage />
  },
  {
    path: '/inquiry',
    element: <InquiryPage />
  },
  {
    path: '/report',
    element: <ReportPage />
  },
  {
    path: '/amc-report',
    element: <AmcReportPage />
  },
  {
    path: '/invite-user',
    element: <InvitationPage />
  },
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  ...AuthRoutes.map(({ path, element }) => ({
    path,
    element: (
      <ProtectedRoute>
        <AppLayout>
          {element}
        </AppLayout>
      </ProtectedRoute>
    )
  })),
  {
    path: '*',
    element: <RootRoute />,
  },
])