import styled from "styled-components";
import { theme } from "./Theme";

/* chip */
export const CatalogFilters = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
`;

export const CatalogFilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 82px;
  min-height: 36px;
  padding: 0 20px;
  color: ${({ $active }) => $active ? theme.colors.white : theme.colors.textMuted};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ $active }) => $active ? theme.colors.primary : theme.colors.white};
  border: 1px solid ${({ $active }) => $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.radius.round};
  transition:
    color ${theme.transitions.fast},
    background-color ${theme.transitions.fast},
    border-color ${theme.transitions.fast},
    transform ${theme.transitions.fast};
  &:hover { color: ${({ $active }) => $active ? theme.colors.white : theme.colors.primary};
    border-color: ${theme.colors.primary};
  }
  &:active {
    transform: scale(0.98);
  }
`;

/* contenedor */
export const CatalogContainer = styled.section`
  width: 100%;
  min-width: 0;
  padding: 16px 28px;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: ${theme.colors.white};
  border: 1px solid rgba(199, 199, 199, 0.45);
  border-radius: ${theme.radius.xl};
  scrollbar-width: thin;
  scrollbar-color: rgba(47, 87, 60, 0.55) transparent;
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(47, 87, 60, 0.55);
    border-radius: ${theme.radius.round};
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(47, 87, 60, 0.78);
  }
  @media (max-width: 768px) {
    padding: 16px 20px;
    border-radius: ${theme.radius.lg};
  }
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const CatalogTable = styled.div`
  width: 100%;
  min-width: ${({ $minWidth = "900px" }) => $minWidth};
`;

export const CatalogHeader = styled.div`
  display: grid;
  grid-template-columns: ${({ $columns = "2fr 110px" }) => $columns};
  gap: 24px;
  min-height: 45px;
  padding: 0 8px;
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid ${theme.colors.border};
  > span {
    display: flex;
    align-items: center;
    min-width: 0;
  }
  > span:last-child {
    justify-content: center;
  }
  @media (max-width: 700px) {
    display: none;
  }
`;

export const CatalogList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CatalogRow = styled.article`
  display: grid;
  grid-template-columns: ${({ $columns = "2fr 110px" }) => $columns};
  align-items: center;
  gap: 24px;
  width: 100%;
  min-height: 82px;
  padding: 14px 8px;
  border-bottom: 1px solid ${theme.colors.border};
  transition: background-color ${theme.transitions.fast};
  &:hover {
    background-color: ${theme.colors.background};
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr auto;
    align-items: start;
    gap: 18px;
    padding: 18px 8px;
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const CatalogMain = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  @media (max-width: 480px) {
    align-items: flex-start;
  }
`;

export const CatalogIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  color: ${theme.colors.primary};
  background-color: rgba(57, 62, 70, 0.14);
  border-radius: ${theme.radius.md};
`;

export const CatalogInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

export const CatalogTitle = styled.h3`
  margin: 0;
  overflow: hidden;
  color: ${theme.colors.text};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 480px) {
    white-space: normal;
  }
`;

export const CatalogDescription = styled.p`
  margin: 0;
  overflow: hidden;
  color: ${theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 480px) {
    white-space: normal;
  }
`;

export const CatalogMeta = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  min-width: 0;
  color: ${theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.4;
  svg {
    flex-shrink: 0;
    color: ${theme.colors.primary};
  }
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const CatalogColumn = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  min-width: 0;
  color: ${theme.colors.text};
  font-size: 13px;
  @media (max-width: 700px) {
    grid-column: 1 / 2;
    &::before {
      content: attr(data-label);
      color: ${theme.colors.textMuted};
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
  }
  @media (max-width: 480px) {
    grid-column: auto;
  }
`;

export const CatalogBadgeList = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  width: 100%;
  min-width: 0;
`;

export const CatalogBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  min-height: 22px;
  padding: 2px 12px;
  overflow: hidden;
  color: ${theme.colors.text};
  font-size: 12px;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: rgba(47, 87, 60, 0.12);
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.round};
`;

export const CatalogActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 0;
  @media (max-width: 700px) {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    align-self: center;
  }
  @media (max-width: 480px) {
    grid-column: auto;
    grid-row: auto;
    justify-content: flex-end;
  }
`;

export const CatalogActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: ${({ $danger }) => $danger ? theme.colors.danger : theme.colors.primary};
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: ${theme.radius.md};
  transition:
    color ${theme.transitions.fast},
    background-color ${theme.transitions.fast},
    transform ${theme.transitions.fast};
  &:hover {
    background-color: ${({ $danger }) =>
      $danger
        ? "rgba(255, 43, 43, 0.08)"
        : "rgba(47, 87, 60, 0.1)"};
  }
  &:active {
    transform: scale(0.94);
  }
  &:focus-visible {
    outline: 2px solid
      ${({ $danger }) =>
        $danger
          ? theme.colors.danger
          : theme.colors.primary};
    outline-offset: 1px;
  }
`;

export const CatalogEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: 24px;
  color: ${theme.colors.textMuted};
  font-size: 14px;
  text-align: center;
`;