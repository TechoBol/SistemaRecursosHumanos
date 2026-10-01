import { useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CircleUserRound,
  DollarSign,
  FileSignature,
  Layers3,
  Menu,
  Settings,
  UserRound,
  UsersRound,
  WalletCards,
  LogOut,
} from "lucide-react";
import {
  Brand,
  BrandLogo,
  BrandText,
  CollapseButton,
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
  LogoutButton,
} from "../ui/layout/Sidebar.styles";
import { useLoginStore } from "../store/loginStore";
import useAuthentication from "../../hooks/useAuthentication";
import logoMenu from "../../assets/logo-menu.png";

const MENU_ITEMS = [
  { id: "empleados", label: "Empleados", path: "/empleados", icon: UsersRound, },
  {
    id: "planillas", label: "Planillas", icon: DollarSign,
    children: [
      { id: "planilla-fiscal", label: "Fiscal", path: "/planilla/fiscal", icon: FileSignature, },
      { id: "planilla-consolidada", label: "Consolidada", path: "/planilla/consolidada", icon: Layers3, },
    ],
  },
  { id: "sucursales", label: "Sucursales", path: "/sucursales", icon: Building2, },
  { id: "areas", label: "Áreas", path: "/areas", icon: Menu, },
  { id: "cargos", label: "Cargos", path: "/cargos", icon: WalletCards, },
  { id: "usuarios", label: "Usuarios", path: "/usuarios", icon: UserRound, },
];

const Sidebar = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fullName } = useLoginStore();
  const { logOut } = useAuthentication();

  const closeMobileMenu = () => {
    if (window.innerWidth <= 768) {
      onCloseMobile();
    }
  };

  const handleGroupClick = (item) => {
    const isInsideGroup = item.children.some(
      (child) => location.pathname === child.path
    );
    // Si estoy fuera de Planillas, entrar a la primera opción: Fiscal
    if (!isInsideGroup) {
      const firstChildPath = item.children?.[0]?.path;
      if (firstChildPath) {
        navigate(firstChildPath);
      }
    }
    // Si el sidebar está colapsado, expandirlo
    if (collapsed) {
      onToggleCollapse();
    }
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
    const isGroupActive = item.children.some( // para planilla
      (child) => location.pathname === child.path
    );
    return (
      <MenuGroup key={item.id}>
        <MenuButton
          type="button"
          $collapsed={collapsed}
          $active={isGroupActive}
          onClick={() => handleGroupClick(item)}
          aria-label={`Ir a ${item.label}`}
        >
          <MenuButtonContent>
            <MenuIcon>
              <Icon size={19} />
            </MenuIcon>
            <MenuLabel $collapsed={collapsed}>
              {item.label}
            </MenuLabel>
          </MenuButtonContent>
          {!collapsed && <ChevronDown size={17} />}
        </MenuButton>

        {!collapsed && (
          <SubMenu $collapsed={collapsed}>
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
          {/* configuracion */}
          <SettingsLink
            to="/configuracion"
            $collapsed={collapsed}
            onClick={closeMobileMenu}
            title={collapsed ? "Configuración" : undefined}
          >
            <Settings size={18} />
            <MenuLabel $collapsed={collapsed}>Configuración</MenuLabel>
          </SettingsLink>
          {/* usuario autenticado */}
          <UserContainer $collapsed={collapsed}>
            <UserAvatar>
              <CircleUserRound size={17} />
            </UserAvatar>
            <UserName $collapsed={collapsed}>{fullName || "Usuario"}</UserName>
          </UserContainer>
          {/* cerrar sesion */}
          <LogoutButton
            $collapsed={collapsed}
            onClick={logOut}
            title={collapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut size={18} />
            <MenuLabel $collapsed={collapsed}>Cerrar Sesión</MenuLabel>
          </LogoutButton>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;/////////