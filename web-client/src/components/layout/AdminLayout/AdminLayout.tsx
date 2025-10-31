import AdminFooter from '@/components/layout/AdminLayout/AdminFooter';
import AdminHeader from '@/components/layout/AdminLayout/AdminHeader';
import AdminSidebar from '@/components/layout/AdminLayout/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader />

        <main className="flex-1 bg-gray-100 p-6">{children}</main>

        <AdminFooter />
      </div>
    </div>
  );
}
