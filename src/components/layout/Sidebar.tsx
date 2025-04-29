
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarItem } from "./sidebar/SidebarItem";
import { SidebarSection } from "./sidebar/SidebarSection";
import { generalMenuItems, appsMenuItems } from "./sidebar/sidebarConfig";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, isUserAdmin } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const adminStatus = await isUserAdmin(user.id);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Erro ao verificar status de administrador:", error);
        }
      }
    };
    
    checkAdminStatus();
  }, [user, isUserAdmin]);

  // Filtrar ou mostrar itens de menu com base no status de administrador
  const filteredGeneralMenuItems = generalMenuItems.filter(item => {
    // Mostrar links de admin apenas para administradores
    if ((item.to === "/admin" || item.to === "/admin-login") && !isAdmin) {
      return false;
    }
    return true;
  });

  // Encontrar o ícone de admin antecipadamente
  const adminIcon = generalMenuItems.find(item => item.to === "/admin")?.icon;

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
            {isAdmin && adminIcon && (
              <SidebarItem
                key="/admin"
                icon={React.createElement(adminIcon, { className: "h-4 w-4" })}
                text="Painel Admin"
                to="/admin"
                active={currentPath === "/admin"}
              />
            )}
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
