// // src/App.tsx
import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
// import AdminRoutes from './routes/AdminRoutes';
import  UserRoutes from './routes/user.routes';
import  AdminRoutes from './routes/admin.routes';

const routes: RouteObject[] = [
  {
    path: '/admin/*',
    children: AdminRoutes,
  },
  {
    path: '/',
    // element: <UserRoutesWrapper />,
    children: UserRoutes,
  },
  // {
  //   path: '*',
  //   // element: <UserRoutesWrapper />,
  //   children: UserRoutes,
  // },
];

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <RouterProvider router={router} />
  </Suspense>
  );
};

export default App;
