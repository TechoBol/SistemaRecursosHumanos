import styled from "styled-components";

export const LayoutContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.sidebar};
`;

export const MainContent = styled.main`
  min-height: 100vh;
  margin-left: ${({ $collapsed, theme }) =>
    $collapsed
      ? theme.layout.sidebarCollapsed
      : theme.layout.sidebarExpanded};
  background-color: transparent;
  transition: margin-left ${({ theme }) => theme.transitions.normal};
  @media (max-width: 768px) {
    margin-left: 0;
    padding-top: 56px;
  }
`;

export const ContentShell = styled.div`
  min-height: 100vh;
  padding: 32px;
  background-color: ${({ theme }) => theme.colors.background};
  border-top-left-radius: 34px;
  border-bottom-left-radius: 34px;
  overflow: hidden;
  @media (max-width: 768px) {
    border-radius: 0;
    padding: 20px;
  }
`;

export const MobileHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  padding: 0 16px;
  display: none;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.sidebar};
  color: ${({ theme }) => theme.colors.textLight};
  z-index: 80;
  @media (max-width: 768px) {
    display: flex;
  }
`;

export const MobileBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textLight};
  font-weight: 600;
  img {
    width: 18px;
    height: 18px;
    display: block;
    object-fit: contain;
  }
`;

export const MobileMenuButton = styled.button`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
`;