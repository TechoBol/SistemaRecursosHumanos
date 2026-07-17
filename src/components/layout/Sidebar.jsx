import { useState } from "react";
import {
  Building2,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CircleUserRound,
  DollarSign,
  List,
  Menu,
  Settings,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";
import {
  Brand,
  BrandLogo,
  BrandText,
  CollapseButton,
  ExpandIndicator,
  MenuButton,
  MenuButtonContent,
  MenuGroup,
  MenuIcon,
  MenuLabel,
  MenuLink,
  MobileOverlay,
  Navigation,
  SettingsLink,
  SidebarContainer,
  SidebarFooter,
  SidebarHeader,
  SubMenu,
  SubMenuLink,
  UserAvatar,
  UserContainer,
  UserName,
} from "../ui/layout/Sidebar.styles";
import logoMenu from "../../assets/logo-menu.png";

const Sidebar = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const [employeesOpen, setEmployeesOpen] = useState(true);
  const [departmentsOpen, setDepartmentsOpen] = useState(true);

  const closeMobileMenu = () => {
    if (window.innerWidth <= 768) {
      onCloseMobile();
    }
  };

  return (
    <>
      <MobileOverlay $open={mobileOpen} onClick={onCloseMobile} />

      <SidebarContainer
        $collapsed={collapsed}
        $mobileOpen={mobileOpen}
      >
        <SidebarHeader $collapsed={collapsed}>
          {!collapsed && (
            <Brand>
              <BrandLogo src={logoMenu} alt="Logo TechoBol" />
              <BrandText $collapsed={collapsed}>TechoBol</BrandText>
            </Brand>
          )}

          <CollapseButton
            type="button"
            $collapsed={collapsed}
            onClick={onToggleCollapse}
            aria-label={
              collapsed ? "Expandir menú" : "Contraer menú"
            }
          >
            {collapsed ? (
              <ChevronsRight size={19} />
            ) : (
              <ChevronsLeft size={19} />
            )}
          </CollapseButton>
        </SidebarHeader>

        <Navigation>
          <MenuGroup>
            <MenuButton
              type="button"
              $collapsed={collapsed}
              onClick={() => {
                if (collapsed) {
                  onToggleCollapse();
                  setEmployeesOpen(true);
                  return;
                }

                setEmployeesOpen((current) => !current);
              }}
            >
              <MenuButtonContent>
                <MenuIcon>
                  <UsersRound size={19} />
                </MenuIcon>

                <MenuLabel $collapsed={collapsed}>
                  Empleados
                </MenuLabel>
              </MenuButtonContent>

              {!collapsed && (
                <ExpandIndicator $open={employeesOpen}>
                  <ChevronDown size={17} />
                </ExpandIndicator>
              )}
            </MenuButton>

            {!collapsed && (
              <SubMenu
                $open={employeesOpen}
                $itemsCount={2}
                $collapsed={collapsed}
              >
                <SubMenuLink
                  to="/empleados"
                  onClick={closeMobileMenu}
                >
                  <List size={16} />
                  Lista
                </SubMenuLink>

                <SubMenuLink
                  to="/empleados/consolidados"
                  onClick={closeMobileMenu}
                >
                  <WalletCards size={16} />
                  Consolidados
                </SubMenuLink>
              </SubMenu>
            )}
          </MenuGroup>

          <MenuLink
            to="/planillas"
            $collapsed={collapsed}
            onClick={closeMobileMenu}
            title={collapsed ? "Planillas" : undefined}
          >
            <MenuIcon>
              <DollarSign size={20} />
            </MenuIcon>

            <MenuLabel $collapsed={collapsed}>
              Planillas
            </MenuLabel>
          </MenuLink>

          <MenuLink
            to="/sucursales"
            $collapsed={collapsed}
            onClick={closeMobileMenu}
            title={collapsed ? "Sucursales" : undefined}
          >
            <MenuIcon>
              <Building2 size={19} />
            </MenuIcon>

            <MenuLabel $collapsed={collapsed}>
              Sucursales
            </MenuLabel>
          </MenuLink>

          <MenuGroup>
            <MenuButton
              type="button"
              $collapsed={collapsed}
              onClick={() => {
                if (collapsed) {
                  onToggleCollapse();
                  setDepartmentsOpen(true);
                  return;
                }

                setDepartmentsOpen((current) => !current);
              }}
            >
              <MenuButtonContent>
                <MenuIcon>
                  <Menu size={19} />
                </MenuIcon>

                <MenuLabel $collapsed={collapsed}>
                  Dptos
                </MenuLabel>
              </MenuButtonContent>

              {!collapsed && (
                <ExpandIndicator $open={departmentsOpen}>
                  <ChevronDown size={17} />
                </ExpandIndicator>
              )}
            </MenuButton>

            {!collapsed && (
              <SubMenu
                $open={departmentsOpen}
                $itemsCount={1}
                $collapsed={collapsed}
              >
                <SubMenuLink
                  to="/posiciones"
                  onClick={closeMobileMenu}
                >
                  <WalletCards size={16} />
                  Posiciones
                </SubMenuLink>
              </SubMenu>
            )}
          </MenuGroup>

          <MenuLink
            to="/usuarios"
            $collapsed={collapsed}
            onClick={closeMobileMenu}
            title={collapsed ? "Usuarios" : undefined}
          >
            <MenuIcon>
              <UserRound size={19} />
            </MenuIcon>

            <MenuLabel $collapsed={collapsed}>
              Usuarios
            </MenuLabel>
          </MenuLink>
        </Navigation>

        <SidebarFooter>
          <SettingsLink
            to="/configuracion"
            $collapsed={collapsed}
            onClick={closeMobileMenu}
            title={collapsed ? "Configuración" : undefined}
          >
            <Settings size={18} />

            <MenuLabel $collapsed={collapsed}>
              Configuración
            </MenuLabel>
          </SettingsLink>

          <UserContainer $collapsed={collapsed}>
            <UserAvatar>
              <CircleUserRound size={17} />
            </UserAvatar>

            <UserName $collapsed={collapsed}>
              Ronald Paniagua
            </UserName>
          </UserContainer>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;