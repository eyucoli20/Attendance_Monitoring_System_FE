import { lazy, Suspense } from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

import TeamPage from 'src/pages/team';
import { useAuth } from 'src/context/AuthContext';
import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));

export const LoginPage = lazy(() => import('src/pages/login'));
export const TimeSheetPage = lazy(() => import('src/pages/timesheet'));
export const ApproveTimeSheetPage = lazy(() => import('src/pages/approve-timeshet'));
export const UserPage = lazy(() => import('src/pages/user'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const userRole = localStorage.getItem('role');

  const allRoutes = [
    
    {
      element: isAuthenticated && (userRole === 'ADMIN' || userRole === 'USER' || userRole ==='MANAGER') ? (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <LoginPage />
      ),
      children: [
        { path: '/dashboard', element: <IndexPage /> },
        { path: '/dashboard/team', element: <TeamPage /> },
        { path: '/dashboard/timesheet', element: <TimeSheetPage /> },
        {path: '/dashboard/approve-timesheet',element:<ApproveTimeSheetPage/>},
        { path: '/dashboard/user', element: <UserPage /> },
      ],
    },
    {
      path: '/',
      element: <LoginPage />,
      index: true,
    },
    {
      path: '*',
      element: <Page404 />,
    },
  ];

 

  const routes = useRoutes(allRoutes);

  return routes;
}
