import { RouterProvider } from "react-router-dom";
import { adminRouter } from "./admin-routes";
import { AdminErrorBoundary } from "./components/admin/AdminErrorBoundary";

export default function AdminApp() {
  return (
    <AdminErrorBoundary>
      <RouterProvider router={adminRouter} />
    </AdminErrorBoundary>
  );
}
