
import { Link, useLocation } from "react-router-dom";
import { SidebarItem } from "./sidebar/SidebarItem";
import { SidebarSection } from "./sidebar/SidebarSection";
import { generalMenuItems, appsMenuItems } from "./sidebar/sidebarConfig";
import { useAuth } from "@/contexts/AuthContext";

export function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  // Temporary hide admin link
  const filteredGeneralMenuItems = generalMenuItems.filter(item => {
    // Hide admin links for now
    if (item.to === "/admin" || item.to === "/admin-login") {
      return false;
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
