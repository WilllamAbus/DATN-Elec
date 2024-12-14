import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider, RouteObject } from "react-router-dom";
import UserRoutes from "./routes/user.routes";
import AdminRoutes from "./routes/admin.routes";

import { Spinner } from "flowbite-react";
const routes: RouteObject[] = [
  {
    path: "/admin",
    children: AdminRoutes,
  },
  {
    path: "/",

    children: UserRoutes,
  },
];

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (

    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" aria-label="Loading..." />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
