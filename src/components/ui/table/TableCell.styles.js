import styled from "styled-components";
import { theme } from "../Theme";

export const CellStack = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  min-width: 0;
`;

export const CellText = styled.span`
  display: block;
  width: 100%;
  overflow: hidden;
  color: ${theme.colors.text};
  font-size: 13px;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CellTitle = styled(CellText)`
  font-size: 14px;
  font-weight: 600;
`;

export const CellMutedText = styled(CellText)`
  color: ${theme.colors.textMuted};
`;

export const CellStrongText = styled(CellText)`
  font-weight: 700;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  padding: 4px 12px;
  overflow: hidden;
  color: ${({ $variant }) =>
    $variant === "danger"
      ? theme.colors.danger
      : theme.colors.primary};
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: ${({ $variant }) => $variant === "danger" ? "#FFD8D8" : "#CFF7D5"};
  border-radius: 999px;
`;

export const TableActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  height: 100%;
`;

export const TableActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  color: ${({ $danger }) => $danger ? theme.colors.danger : theme.colors.primary};
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: 10px;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
  &:hover {
    background-color: ${({ $danger }) =>
      $danger
        ? "rgba(255, 43, 43, 0.1)"
        : "rgba(47, 87, 60, 0.1)"};
  }
  &:active {
    transform: scale(0.94);
  }
  &:focus-visible {
    outline: 2px solid
      ${({ $danger }) =>
        $danger ? theme.colors.danger : theme.colors.primary};
    outline-offset: 1px;
  }
`;