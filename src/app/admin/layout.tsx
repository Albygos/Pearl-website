import AdminAuthGuard from '@/components/admin-auth-guard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="bg-background">{children}</div>
    </AdminAuthGuard>
  );
}
