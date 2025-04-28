
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UsersTable } from "@/components/admin/UsersTable";
import { useAdminUsers } from "@/hooks/useAdminUsers";

export default function AdminPage() {
  const { users, loading, fetchUsers } = useAdminUsers();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel de Administração</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários e suas permissões no sistema
          </p>
        </div>

        {loading ? (
          <div>Carregando...</div>
        ) : (
          <UsersTable users={users} onUpdate={fetchUsers} />
        )}
      </div>
    </DashboardLayout>
  );
}
