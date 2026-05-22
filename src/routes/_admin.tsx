import { createFileRoute, Outlet } from '@tanstack/react-router';
import { requireAdminFn } from '@everyone-web/server/auth';
import { AdminLayout } from '@everyone-web/components/admin/AdminLayout';

export const Route = createFileRoute('/_admin')({
  beforeLoad: async () => {
    await requireAdminFn();
  },
  component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
