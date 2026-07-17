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

const MENU_ITEMS = [
  {
    id: "empleados", label: "Empleados", icon: UsersRound,
    children: [
      { id: "lista-empleados", label: "Lista", path: "/empleados", icon: List, },
      { id: "empleados-consolidados", label: "Consolidados", path: "/empleados/consolidados", icon: WalletCards, },
    ],
  },
  { id: "planillas", label: "Planillas", path: "/planillas", icon: DollarSign, },
  { id: "sucursales", label: "Sucursales", path: "/sucursales", icon: Building2, },
  {
    id: "departamentos", label: "Departamentos", icon: Menu,
    children: [
      { id: "posiciones", label: "Posiciones", path: "/posiciones", icon: WalletCards, },
    ],
  },
  { id: "usuarios", label: "Usuarios", path: "/usuarios", icon: UserRound, },
];

const Sidebar = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const [openMenus, setOpenMenus] = useState({
    empleados: true,
    departamentos: true,
  });

  const closeMobileMenu = () => {
    if (window.innerWidth <= 768) {
      onCloseMobile();
    }
  };

  const toggleMenu = (menuId) => {
    if (collapsed) {
      onToggleCollapse();
      setOpenMenus((currentMenus) => ({
        ...currentMenus,
        [menuId]: true,
      }));
      return;
    }
    setOpenMenus((currentMenus) => ({
      ...currentMenus,
      [menuId]: !currentMenus[menuId],
    }));
  };

  const renderSimpleItem = (item) => {
    const Icon = item.icon;
    return (
      <MenuLink
        key={item.id}
        to={item.path}
        $collapsed={collapsed}
        onClick={closeMobileMenu}
        title={collapsed ? item.label : undefined}
      >
        <MenuIcon>
          <Icon size={19} />
        </MenuIcon>
        <MenuLabel $collapsed={collapsed}>
          {item.label}
        </MenuLabel>
      </MenuLink>
    );
  };

  const renderGroupItem = (item) => {
    const Icon = item.icon;
    const isOpen = Boolean(openMenus[item.id]);
    return (
      <MenuGroup key={item.id}>
        <MenuButton
          type="button"
          $collapsed={collapsed}
          onClick={() => toggleMenu(item.id)}
          aria-expanded={isOpen}
          aria-label={`${isOpen ? "Cerrar" : "Abrir"} menú de ${
            item.label
          }`}
        >
          <MenuButtonContent>
            <MenuIcon>
              <Icon size={19} />
            </MenuIcon>
            <MenuLabel $collapsed={collapsed}>
              {item.label}
            </MenuLabel>
          </MenuButtonContent>
          {!collapsed && (
            <ExpandIndicator $open={isOpen}>
              <ChevronDown size={17} />
            </ExpandIndicator>
          )}
        </MenuButton>

        {!collapsed && (
          <SubMenu
            $open={isOpen}
            $itemsCount={item.children.length}
            $collapsed={collapsed}
          >
            {item.children.map((child) => {
              const ChildIcon = child.icon;
              return (
                <SubMenuLink
                  key={child.id}
                  to={child.path}
                  onClick={closeMobileMenu}
                >
                  <ChildIcon size={16} />
                  {child.label}
                </SubMenuLink>
              );
            })}
          </SubMenu>
        )}
      </MenuGroup>
    );
  };

  return (
    <>
      <MobileOverlay $open={mobileOpen} onClick={onCloseMobile} />
      <SidebarContainer $collapsed={collapsed} $mobileOpen={mobileOpen}>
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
              collapsed
                ? "Expandir menú"
                : "Contraer menú"
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
          {MENU_ITEMS.map((item) =>
            item.children
              ? renderGroupItem(item)
              : renderSimpleItem(item),
          )}
        </Navigation>

        <SidebarFooter>
          <SettingsLink
            to="/configuracion"
            $collapsed={collapsed}
            onClick={closeMobileMenu}
            title={collapsed ? "Configuración" : undefined}
          >
            <Settings size={18} />
            <MenuLabel $collapsed={collapsed}>Configuración</MenuLabel>
          </SettingsLink>
          <UserContainer $collapsed={collapsed}>
            <UserAvatar>
              <CircleUserRound size={17} />
            </UserAvatar>
            <UserName $collapsed={collapsed}>Simon San</UserName>
          </UserContainer>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;