import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import {
  ContentShell,
  LayoutContainer,
  MainContent,
  MobileBrand,
  MobileHeader,
  MobileMenuButton,
} from "../ui/layout/AppLayout.styles";
import logoMenu from "../../assets/logo-menu.png";
import { useSessionTimeout } from "../../hooks/useSessionTimeout";

const AppLayout = () => {
  // Activa el monitoreo de inactividad
  useSessionTimeout();

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <LayoutContainer>
      <MobileHeader>
        <MobileBrand>
          <img src={logoMenu} alt="Logo TechoBol" />
          <span>TechoBol</span>
        </MobileBrand>
        <MobileMenuButton
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </MobileMenuButton>
      </MobileHeader>

      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((current) => !current)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <MainContent $collapsed={collapsed}>
        <ContentShell>
          <Outlet />
        </ContentShell>
      </MainContent>
    </LayoutContainer>
  );
};

export default AppLayout;