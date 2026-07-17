import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";

export const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;

  width: ${({ $collapsed, theme }) =>
    $collapsed
      ? theme.layout.sidebarCollapsed
      : theme.layout.sidebarExpanded};

  min-height: 100vh;
  padding: 24px 8px 18px;

  display: flex;
  flex-direction: column;

  border-radius: 0 8px 8px 0;
  background-color: ${({ theme }) => theme.colors.sidebar};

  overflow: hidden;
  z-index: 100;

  transition: width ${({ theme }) => theme.transitions.normal};

  @media (max-width: 768px) {
    width: 230px;
    border-radius: 0 24px 24px 0;

    transform: ${({ $mobileOpen }) =>
      $mobileOpen ? "translateX(0)" : "translateX(-100%)"};

    transition: transform ${({ theme }) => theme.transitions.normal};
  }
`;

export const SidebarHeader = styled.div`
  min-height: 36px;
  padding: 0 10px 24px;

  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "space-between"};

  gap: 8px;
`;

export const Brand = styled.div`
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 9px;

  color: ${({ theme }) => theme.colors.textLight};
`;

export const BrandLogo = styled.img`
  width: 18px;
  height: 18px;

  flex-shrink: 0;

  display: block;
  object-fit: contain;
`;

export const BrandText = styled.span`
  overflow: hidden;
  white-space: nowrap;

  color: ${({ theme }) => theme.colors.textLight};

  font-size: 14px;
  font-weight: 600;
  line-height: 1;

  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  visibility: ${({ $collapsed }) =>
    $collapsed ? "hidden" : "visible"};
`;

export const CollapseButton = styled.button`
  width: 26px;
  height: 26px;

  flex-shrink: 0;

  display: grid;
  place-items: center;

  background: transparent;
  color: ${({ theme }) => theme.colors.textLight};

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.menuHover};
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;

export const Navigation = styled.nav`
  flex: 1;

  display: flex;
  flex-direction: column;
  gap: 2px;

  overflow-y: auto;
  overflow-x: hidden;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MenuButton = styled.button`
  width: 100%;
  min-height: 36px;
  padding: 7px 10px;

  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "space-between"};

  gap: 8px;

  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textLight};

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.menuHover};
  }
`;

export const MenuButtonContent = styled.span`
  min-width: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const MenuIcon = styled.span`
  width: 22px;
  height: 22px;

  flex-shrink: 0;

  display: grid;
  place-items: center;
`;

export const MenuLabel = styled.span`
  overflow: hidden;
  white-space: nowrap;

  font-size: 12px;
  font-weight: 400;

  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  visibility: ${({ $collapsed }) =>
    $collapsed ? "hidden" : "visible"};
  width: ${({ $collapsed }) => ($collapsed ? "0" : "auto")};
`;

export const ExpandIndicator = styled.span`
  width: 20px;
  height: 20px;

  flex-shrink: 0;

  display: grid;
  place-items: center;

  transition: transform ${({ theme }) => theme.transitions.fast};

  transform: ${({ $open }) =>
    $open ? "rotate(0deg)" : "rotate(-90deg)"};
`;

export const SubMenu = styled.div`
  max-height: ${({ $open, $itemsCount }) =>
    $open ? `${$itemsCount * 40}px` : "0"};

  margin-left: ${({ $collapsed }) => ($collapsed ? "0" : "15px")};
  padding-left: ${({ $collapsed }) => ($collapsed ? "0" : "10px")};

  border-left: ${({ $collapsed, theme }) =>
    $collapsed ? "none" : `1px solid ${theme.colors.textMuted}`};

  display: flex;
  flex-direction: column;
  gap: 0;

  overflow: hidden;

  opacity: ${({ $open }) => ($open ? 1 : 0)};

  transition:
    max-height ${({ theme }) => theme.transitions.normal},
    opacity ${({ theme }) => theme.transitions.fast};
`;

export const MenuLink = styled(NavLink)`
  width: 100%;
  min-height: 36px;
  padding: 7px 10px;

  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};

  gap: 10px;

  border-radius: ${({ theme }) => theme.radius.round};
  color: ${({ theme }) => theme.colors.textLight};

  font-size: 12px;
  font-weight: 400;

  transition:
    background-color ${({ theme }) => theme.transitions.fast},
    color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.menuHover};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.menuActive};
    color: ${({ theme }) => theme.colors.menuActiveText};
  }
`;

export const SubMenuLink = styled(NavLink)`
  min-height: 36px;
  padding: 7px 8px;

  display: flex;
  align-items: center;
  gap: 8px;

  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textLight};

  font-size: 11px;
  font-weight: 400;

  &:hover {
    background-color: ${({ theme }) => theme.colors.menuHover};
  }

  &.active {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

export const SidebarFooter = styled.div`
  padding-top: 12px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SettingsLink = styled(NavLink)`
  min-height: 34px;
  padding: 7px 10px;

  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};

  gap: 8px;

  border-radius: ${({ theme }) => theme.radius.round};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textLight};

  font-size: 11px;
  font-weight: 400;

  &:hover {
    background-color: ${({ theme }) => theme.colors.menuHover};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.menuActive};
    color: ${({ theme }) => theme.colors.menuActiveText};
  }
`;

export const UserContainer = styled.div`
  min-height: 36px;
  padding: 6px 10px;

  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) =>
    $collapsed ? "center" : "flex-start"};

  gap: 8px;

  color: ${({ theme }) => theme.colors.textLight};
`;

export const UserAvatar = styled.div`
  width: 24px;
  height: 24px;

  flex-shrink: 0;

  display: grid;
  place-items: center;

  border: 1px solid ${({ theme }) => theme.colors.textLight};
  border-radius: 50%;
`;

export const UserName = styled.span`
  overflow: hidden;
  white-space: nowrap;

  font-size: 11px;
  font-weight: 400;

  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  visibility: ${({ $collapsed }) =>
    $collapsed ? "hidden" : "visible"};
  width: ${({ $collapsed }) => ($collapsed ? "0" : "auto")};
`;

export const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;

  display: none;

  background-color: ${({ theme }) => theme.colors.overlay};
  z-index: 90;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
  }
`;