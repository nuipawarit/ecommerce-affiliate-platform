import { AdminSidebar } from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto md:ml-64">
        <div className="container mx-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
