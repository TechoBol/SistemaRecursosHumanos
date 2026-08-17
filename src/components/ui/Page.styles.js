import styled from "styled-components";
import { theme } from "../ui/Theme";

export const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  min-width: 0;
  @media (max-width: 768px) {
    gap: 24px;
  }
`;

export const PageHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  @media (max-width: 800px) {
    flex-direction: column;
    align-items: start;
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  color: ${theme.colors.text};
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  @media (max-width: 768px) {
    font-size: 23px;
  }
`;

export const PageDescription = styled.p`
  margin: 8px 0 0;
  color: ${theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.5;
`;

export const PageActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  width: 100%;
  max-width: 550px;
  @media (max-width: 800px) {
    justify-content: space-between;
    max-width: none;
  }
  @media (max-width: 600px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 250px;
  padding: 0 16px;
  color: ${theme.colors.textMuted};
  background-color: ${theme.colors.white};
  border: 1px solid transparent;
  border-radius: 999px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  &:focus-within {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(47, 87, 60, 0.12);
  }
  svg {
    flex-shrink: 0;
  }
  @media (max-width: 600px) {
    max-width: none;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  padding: 7px 0;
  color: ${theme.colors.text};
  font-family: inherit;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
  &::placeholder {
    color: ${theme.colors.textMuted};
  }
  &::-webkit-search-cancel-button {
    cursor: pointer;
  }
`;

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 7px 24px;
  color: ${theme.colors.white};
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  background-color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: 999px;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  &:hover:not(:disabled) {
    opacity: 0.92;
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
  @media (max-width: 600px) {
    width: 100%;
    min-width: 0;
  }
`;

/* FILTROS */
export const FiltersWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: -8px;
`;

/* chip */
export const ChipFilters = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ChipFilterButton = styled.button`
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

/* switch */
export const SwitchFilters = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 3px;
`;

export const SwitchFilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 130px;
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ $active }) => ($active ? "rgba(47, 87, 60, 0.08)" : "transparent")};
  color: ${({ $active }) => ($active ? "#2f573c" : "#718096")};
  border: none;
  border-radius: 999px;
  transition: all 0.2s ease;
  font-family: inherit;

  svg {
    color: ${({ $active }) => ($active ? "#2f573c" : "#718096")};
    transition: color 0.2s ease;
  }

  &:hover {
    color: #2f573c;
    svg {
      color: #2f573c;
    }
  }
`;