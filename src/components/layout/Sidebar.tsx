
import { Link, useLocation } from "react-router-dom";
import { SidebarItem } from "./sidebar/SidebarItem";
import { SidebarSection } from "./sidebar/SidebarSection";
import { generalMenuItems, appsMenuItems } from "./sidebar/sidebarConfig";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  // Use o hook para verificar o status de admin
  useEffect(() => {
    // Apenas verificar admin status se houver um usuário logado
    if (!user) {
      setIsAdmin(false);
      return;
    }
    
    // Função para verificar status de admin de forma segura
    const checkAdminStatus = async () => {
      try {
        const { isUserAdmin } = await import('@/contexts/auth/useAuthOperations');
        if (isUserAdmin && user.id) {
          const adminStatus = await isUserAdmin(user.id);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error("Erro ao verificar status de administrador na sidebar:", error);
        // Não vamos desconectar o usuário em caso de erro, apenas não mostrarmos o link de admin
        setIsAdmin(false);
      }
    };
    
    // Verificar status admin
    checkAdminStatus();
  }, [user]);

  // Filter general menu items to only show Admin link if user is admin
  const filteredGeneralMenuItems = generalMenuItems.filter(item => {
    // Only show "Administration" if user is confirmed admin
    if (item.to === "/admin") {
      return isAdmin;
    }
    return true;
  });

  return (
    <div className="flex h-full min-h-screen w-64 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-mkranker-purple">MKRanker</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <div className="flex flex-col gap-2 px-2">
          <SidebarSection title="GENERAL">
            {filteredGeneralMenuItems.map((item) => (
              <SidebarItem
                key={item.to}
                icon={<item.icon className="h-4 w-4" />}
                text={item.text}
                to={item.to}
                active={currentPath === item.to}
              />
            ))}
          </SidebarSection>

          <SidebarSection title="APPS">
            {appsMenuItems.map((item) => (
              <SidebarItem
                key={item.to}
                icon={<item.icon className="h-4 w-4" />}
                text={item.text}
                to={item.to}
                active={currentPath === item.to}
              />
            ))}
          </SidebarSection>
        </div>
      </div>
    </div>
  );
}
