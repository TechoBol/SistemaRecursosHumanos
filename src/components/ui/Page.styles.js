import styled, { keyframes } from "styled-components";
import { theme } from "../ui/Theme";

export const PageContainer = styled.main`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  min-width: 0;
  @media (max-width: 768px) {
    gap: 20px;
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

/* FECHAS DE CALENDARIO - MESES Y ANIOS */
export const PeriodSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 4px 14px;
`;

export const PeriodSelect = styled.select`
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #2f573c;
  outline: none;
  cursor: pointer;
`;

/* CARDS DE TOTALES DE PLANILLAS */
export const TotalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns = 7 }) => $columns}, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
  @media (max-width: 1400px) {
    grid-template-columns: repeat(${({ $columns = 7 }) => Math.min($columns, 4)}, minmax(0, 1fr));
  }
  @media (max-width: 900px) {
    grid-template-columns: repeat(${({ $columns = 7 }) => Math.min($columns, 3)}, minmax(0, 1fr));
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(${({ $columns = 7 }) => Math.min($columns, 2)}, minmax(0, 1fr));
  }
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

export const TotalCard = styled.div`
  display: flex;
  flex-direction: ${({ $horizontal }) => $horizontal ? "row" : "column"};
  align-items: ${({ $horizontal }) => $horizontal ? "center" : "stretch"};
  justify-content: ${({ $horizontal }) => $horizontal ? "space-between" : "center"};
  gap: 6px;
  padding: 14px 18px;
  border-radius: 18px;
  border: 1px solid
    ${({ $variant }) =>
      $variant === "danger" ? "#fca5a5"
      : $variant === "highlight" ? "#bfdbfe"
      : $variant === "purple" ? "#e9d5ff"
      : $variant === "dark" ? "#cbd5e1"
      : "#bbf7d0"};
  background-color: ${({ $variant }) =>
    $variant === "danger" ? "#fee2e2"
    : $variant === "highlight" ? "#e0e7ff"
    : $variant === "purple" ? "#f3e8ff"
    : $variant === "dark" ? "#e2e8f0"
    : "#dcfce7"};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }
`;

export const TotalLabel = styled.span`
  font-size: ${({ $emphasis }) => $emphasis ? "14px" : "13px"};
  font-weight: ${({ $emphasis }) => $emphasis ? 700 : 500};
  color: ${({ $variant }) =>
    $variant === "danger" ? "#991b1b"
    : $variant === "highlight" ? "#1e40af"
    : $variant === "purple" ? "#6b21a8"
    : $variant === "dark" ? "#334155"
    : "#14532d"};
`;

export const TotalValue = styled.span`
  font-size: ${({ $large }) => $large ? "32px" : "21px"};
  font-weight: ${({ $large }) => $large ? 800 : 700};
  color: ${({ $variant }) =>
    $variant === "danger" ? "#dc2626"
    : $variant === "highlight" ? "#1d4ed8"
    : $variant === "purple" ? "#7e22ce"
    : $variant === "dark" ? "#0f172a"
    : "#15803d"};
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
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.textMuted)};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.white)};
  border: 1px solid ${({ $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  border-radius: ${theme.radius.round};
  transition:
    color ${theme.transitions.fast},
    background-color ${theme.transitions.fast},
    border-color ${theme.transitions.fast},
    transform ${theme.transitions.fast};
  &:hover {
    color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.primary)};
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

/* BOTON DE BOLETAS, PLANILLAS, FINALIZAR  */
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const BaseActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 38px;
  padding: 0 18px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  border-radius: ${theme.radius.round};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  svg {
    color: currentColor;
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const ActionSecondaryButton = styled(BaseActionButton)`
  color: ${theme.colors.primary};
  background: rgba(47, 87, 60, 0.08);
  border: 1px solid rgba(47, 87, 60, 0.28);
  &:hover:not(:disabled) {
    color: ${theme.colors.white};
    background: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
  }
`;

export const ActionPrimaryButton = styled(BaseActionButton)`
  color: ${({ $isFinalized }) => $isFinalized ? "#15803d" : "#ffffff"};
  background: ${({ $isFinalized }) => $isFinalized ? "#f0fdf4" : "#2f573c"};
  border: 1px solid ${({ $isFinalized }) => $isFinalized ? "#bbf7d0" : "#2f573c"};
  cursor: ${({ $isFinalized }) => $isFinalized ? "default" : "pointer"};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  &:hover:not(:disabled) {
    background: ${({ $isFinalized }) => $isFinalized ? "#f0fdf4" : "#244530"};
    border-color: ${({ $isFinalized }) => $isFinalized ? "#bbf7d0" : "#244530"};
    box-shadow: ${({ $isFinalized }) =>
      $isFinalized
        ? "0 1px 2px rgba(0, 0, 0, 0.05)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.08)"};
    transform: ${({ $isFinalized }) => $isFinalized ? "none" : "translateY(-1px)"};
  }
  &:disabled {
    background: #f1f5f9;
    border-color: #e2e8f0;
    color: #94a3b8;
    svg {
      color: currentColor;
    }
  }
`;

export const LoadingSpinner = styled.div`
  width: 15px;
  height: 15px;
  border: 2px solid rgba(47, 87, 60, 0.2);
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

// Complementa TotalCard, TotalLabel y TotalValue sin duplicarlos.
export const SummaryCardIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 12px;
  color: ${({ $variant }) => $variant === "danger" ? "#e11d48" : $variant === "highlight" || $variant === "info" ? "#2563eb" : $variant === "purple" ? "#7e22ce" : "#16a34a"};
  background-color: ${({ $variant }) => $variant === "danger" ? "rgba(225, 29, 72, 0.1)" : $variant === "highlight" || $variant === "info" ? "rgba(37, 99, 235, 0.1)" : $variant === "purple" ? "rgba(126, 34, 206, 0.1)" : "rgba(22, 163, 74, 0.1)"};
`;

export const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const SectionBar = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

export const SectionHeading = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  font-size: 20px;
  font-weight: 700;
`;

export const SectionCountText = styled.span`
  color: ${theme.colors.textMuted};
  font-size: 14px;
  font-weight: 500;
`;

export const CollapsibleCard = styled.div`
  min-width: 0;
  overflow: hidden;
  background: ${theme.colors.white};
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const CollapsibleHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: ${theme.colors.white};
  cursor: pointer;
  user-select: none;
  &:hover { background: #fafafa; }

  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    padding: 16px;
  }
`;

export const CollapsibleTitle = styled.h3`
  min-width: 0;
  margin: 0;
  color: ${theme.colors.text};
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  overflow-wrap: anywhere;
`;

export const CollapsibleActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  @media (max-width: 700px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    width: 100%;
    align-items: end;
  }
`;

export const CollapsibleCounters = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const CollapsibleControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

export const CollapsibleBody = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 20px 20px;
  background: #fafbfc;
  border-top: 1px solid #f3f4f6;

  @media (max-width: 700px) {
    padding: 12px 16px 16px;
  }
`;

{/*export const DetailItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: 12px;
  width: 100%;
  min-width: 0;
`;*/}

export const DetailItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
  min-width: 0;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: ${theme.radius.round};
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $variant }) => $variant === "danger" ? "#fee2e2" : $variant === "success" ? "#dcfce7" : $variant === "info" ? "#dbeafe" : $variant === "purple" ? "#f3e8ff" : "#f3f4f6"};
  color: ${({ $variant }) => $variant === "danger" ? "#dc2626" : $variant === "success" ? "#15803d" : $variant === "info" ? "#2563eb" : $variant === "purple" ? "#7e22ce" : "#4b5563"};
`;

export const ActionIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: ${theme.radius.round};
  &:hover {
    color: ${theme.colors.primary};
    background: rgba(47, 87, 60, 0.08);
  }
  &:focus-visible { outline: 2px solid ${theme.colors.primary}; }
`;

export const DetailItemRow = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  border: 1px solid ${({ $variant }) =>
    $variant === "danger"
      ? "#fecdd3"
      : $variant === "success"
      ? "#bbf7d0"
      : $variant === "info"
      ? "#bfdbfe"
      : $variant === "warning"
      ? "#fed7aa"
      : $variant === "purple"
      ? "#e9d5ff"
      : "#e5e7eb"};
  border-radius: 12px;
  background: ${({ $variant }) =>
    $variant === "danger"
      ? "#fff1f2"
      : $variant === "success"
      ? "#f0fdf4"
      : $variant === "info"
      ? "#eff6ff"
      : $variant === "warning"
      ? "#fff7ed"
      : $variant === "purple"
      ? "#faf5ff"
      : "#ffffff"};
`;

export const DetailItemTagGroup = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  min-width: 0;
  gap: 6px 10px;
`;

export const DetailItemLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ $variant }) =>
    $variant === "danger"
      ? "#e11d48"
      : $variant === "success"
      ? "#16a34a"
      : $variant === "info"
      ? "#2563eb"
      : $variant === "warning"
      ? "#ea580c"
      : $variant === "purple"
      ? "#7e22ce"
      : "#374151"};
  svg { flex-shrink: 0; }
`;

export const DetailItemText = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
`;

export const DetailItemDescriptionBox = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px 16px;
  min-width: 0;
  padding-left: 24px;
  color: #4b5563;
  overflow-wrap: anywhere;
  > span { min-width: 0; }

  @media (max-width: 700px) {
    padding-left: 0;
  }
  font-size: 12px;
  strong { color: #1f2937; font-weight: 600; }
`;

export const EmptyStateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  text-align: center;
  background: ${theme.colors.white};
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
`;