import styled from "styled-components";
import { theme } from "./Theme";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ $zIndex = 1500 }) => $zIndex};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${theme.colors.overlay};
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const ModalContainer = styled.section`
  display: flex;
  flex-direction: column;
  width: min(${({ $maxWidth = "800px" }) => $maxWidth}, 100%);
  max-height: ${({ $maxHeight = "calc(90vh - 48px)" }) => $maxHeight};
  overflow: hidden;
  background-color: ${theme.colors.background};
  border-radius: ${theme.radius.xl};
  box-shadow: 0 18px 55px rgba(31, 31, 31, 0.25);
  @media (max-width: 768px) {
    max-height: calc(100vh - 32px);
    border-radius: ${theme.radius.lg};
  }
  @media (max-width: 480px) {
    max-height: calc(90vh - 24px);
    border-radius: ${theme.radius.md};
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-shrink: 0;
  padding: 12px 22px;
  background-color: ${theme.colors.background};
  border-bottom: 1px solid rgba(199, 199, 199, 0.4);
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const ModalCloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  color: ${theme.colors.sidebar};
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: ${theme.radius.round};
  &:hover {
    background-color: rgba(57, 62, 70, 0.08);
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const ModalForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
`;

export const ModalContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ $gap = "18px" }) => $gap};
  min-height: 0;
  padding: ${({ $padding = "0 18px 0px 22px" }) => $padding};
  overflow-x: hidden;
  overflow-y: ${({ $scrollable = true }) => $scrollable ? "auto" : "visible"};
  scrollbar-width: thin;
  scrollbar-color: rgba(47, 87, 60, 0.55) transparent;
  &::-webkit-scrollbar {
    width: 8px;
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
    padding: ${({ $mobilePadding = "0 12px 16px 16px" }) =>
      $mobilePadding};
  }
`;

export const FormStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ModalSection = styled.section`
  padding: ${({ $compact }) => ($compact ? "22px" : "24px 32px")};
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.xl};
  &:first-child {
    margin-top: 18px;
  }
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: ${theme.radius.lg};
  }
  @media (max-width: 480px) {
    padding: 18px 16px;
  }
`;

export const ModalSectionTitle = styled.h3`
  margin: ${({ $noMargin }) => ($noMargin ? "0" : "0 0 18px")};
  color: ${theme.colors.text};
  font-size: 16px;
  font-weight: 500;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    ${({ $columns = 2 }) => $columns},
    minmax(0, 1fr)
  );
  gap: 18px 24px;
  & + & {
    margin-top: 18px;
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
`;

export const FormLabel = styled.label`
  color: ${theme.colors.textMuted};
  font-size: 12px;
  font-weight: 500;
`;

const controlStyles = `
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  color: ${theme.colors.text};
  font-family: inherit;
  font-size: 14px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  outline: none;
  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(47, 87, 60, 0.12);
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${theme.colors.background};
    opacity: 0.7;
  }
`;

export const FormInput = styled.input`
  ${controlStyles}
  border-color: ${({ $invalid }) => $invalid ? "#FF2B2B" : theme.colors.border};
  &[type="date"]::-webkit-calendar-picker-indicator,
  &[type="date"]::-webkit-inner-spin-button {
    display: none;
  }
  &[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

export const FormTextarea = styled.textarea`
  ${controlStyles}
  min-height: 78px;
  padding: 10px 12px;
  line-height: 1.4;
  resize: vertical;
`;

export const FormSelect = styled.select`
  ${controlStyles}
  border-color: ${({ $invalid }) => $invalid ? "#FF2B2B" : theme.colors.border};
  cursor: pointer;
`;

export const InputIconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  ${FormInput} {
    padding-right: 44px;
  }
  > svg {
    position: absolute;
    right: 12px;
    color: ${theme.colors.textMuted};
    pointer-events: none;
  }
`;

export const InputIconButton = styled.button`
  position: absolute;
  right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: ${theme.colors.textMuted};
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: ${theme.radius.sm};
  &:hover {
    color: ${theme.colors.primary};
    background-color: rgba(47, 87, 60, 0.08);
  }
`;

export const ToggleGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns = 2 }) => $columns}, 1fr);
  min-height: 35px;
  overflow: hidden;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
`;

export const ToggleButton = styled.button`
  padding: 0 16px;
  color: ${({ $active }) => $active ? theme.colors.white : theme.colors.text};
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
  background-color: ${({ $active, $variant = "primary" }) => {
    if (!$active) return theme.colors.white;
    if ($variant === "danger") return theme.colors.danger;
    if ($variant === "info") return theme.colors.info;
    return theme.colors.primary;
  }};
  border: none;
  transition:
    color ${theme.transitions.fast},
    background-color ${theme.transitions.fast};
  &:not(:last-child) {
    border-right: 1px solid ${theme.colors.border};
  }
  &:hover {
    background-color: ${({ $active }) => !$active ? theme.colors.background : undefined};
  }
`;

// ============================================
// ACCIONES Y BOTONES
// ============================================
export const ModalActions = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
  padding: 16px 22px 20px;
  padding-top: ${({ $compact }) => ($compact ? "12px" : "16px")};
  background-color: ${theme.colors.background};
  border-top: ${({ $divided }) => $divided ? "1px solid rgba(199, 199, 199, 0.4)" : "none"};
  @media (max-width: 480px) {
    align-items: stretch;
    flex-direction: column-reverse;
  }
`;

const BaseActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 24px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: ${theme.radius.round};
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const CancelButton = styled(BaseActionButton)`
  min-width: 130px;
  color: ${theme.colors.primary};
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.primary};
  &:hover {
    background-color: ${theme.colors.background};
  }
`;

export const PrimaryButton = styled(BaseActionButton)`
  min-width: ${({ $minWidth = "170px" }) => $minWidth};
  color: ${theme.colors.white};
  background-color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  &:hover:not(:disabled) {
    opacity: 0.92;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const SelectableOptions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SelectableOptionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 14px;
  color: ${({ $active }) => $active ? theme.colors.white : theme.colors.textMuted};
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ $active }) => $active ? theme.colors.primary : theme.colors.white};
  border: 1px solid ${({ $active }) => $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.radius.sm};
  transition:
    color ${theme.transitions.fast},
    background-color ${theme.transitions.fast},
    border-color ${theme.transitions.fast};
  &:hover {
    color: ${({ $active }) => $active ? theme.colors.white : theme.colors.primary};
    border-color: ${theme.colors.primary};
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const FormHelperText = styled.span`
  color: ${theme.colors.textMuted};
  font-size: 11px;
  line-height: 1.4;
`;

export const FormErrorText = styled.span`
  color: ${theme.colors.danger};
  font-size: 11px;
  line-height: 1.4;
`;

// ============================================
// MULTISELECT
// ============================================
export const MultiSelect = styled.div`
  width: 100%;
`;

export const MultiSelectControl = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  padding: 6px 10px;
  color: ${theme.colors.text};
  font-family: inherit;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  background-color: ${theme.colors.white};
  border: 1px solid ${({ $open }) => $open ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.radius.sm};
  outline: none;
  box-shadow: ${({ $open }) => $open ? "0 0 0 2px rgba(47, 87, 60, 0.12)" : "none"};
  .values {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    min-width: 0;
  }
  .placeholder {
    color: ${theme.colors.textMuted};
  }
  > svg {
    flex-shrink: 0;
    color: ${theme.colors.textMuted};
    transition: transform ${theme.transitions.fast};
    transform: ${({ $open }) => $open ? "rotate(180deg)" : "rotate(0deg)"};
  }
`;

export const MultiSelectChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 100%;
  min-height: 28px;
  padding: 3px 8px;
  color: ${theme.colors.white};
  font-size: 12px;
  font-weight: 500;
  background-color: ${theme.colors.primary};
  border-radius: ${theme.radius.sm};
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    color: inherit;
    cursor: pointer;
    background-color: transparent;
    border: none;
    border-radius: ${theme.radius.round};
    &:hover {
      background-color: rgba(255, 255, 255, 0.16);
    }
    &:focus-visible {
      outline: 1px solid ${theme.colors.white};
      outline-offset: 1px;
    }
  }
`;

export const MultiSelectMenu = styled.div`
  position: fixed;
  z-index: 2000;
  max-height: 240px;
  padding: 4px;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  box-shadow: 0 10px 28px rgba(31, 31, 31, 0.2);
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(47, 87, 60, 0.55) transparent;
  &::-webkit-scrollbar {
    width: 7px;
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
`;

export const MultiSelectOption = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 40px;
  padding: 7px 10px;
  color: ${({ $selected }) => $selected ? theme.colors.primary : theme.colors.text};
  font-family: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  background-color: ${({ $selected }) => $selected ? "rgba(47, 87, 60, 0.08)" : theme.colors.white};
  border: none;
  border-radius: ${theme.radius.sm};
  &:hover {
    background-color: ${theme.colors.background};
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: -2px;
  }
  .checkbox {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 19px;
    height: 19px;
    flex-shrink: 0;
    color: ${theme.colors.white};
    background-color: ${({ $selected }) => $selected ? theme.colors.primary : theme.colors.white};
    border: 1px solid ${({ $selected }) => $selected ? theme.colors.primary : theme.colors.border};
    border-radius: 3px;
  }
`;

// ============================================
// CARGA Y VISTA PREVIA DE ARCHIVOS
// ============================================
export const DropZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  border: 2px dashed ${theme.colors.border};
  border-radius: ${theme.radius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  background-color: #fafbfc;
  input {
    display: none;
  }
  &:hover {
    border-color: ${theme.colors.primary};
    background-color: rgba(47, 87, 60, 0.02);
  }
  svg {
    color: ${theme.colors.primary};
  }
  p {
    margin: 0;
    font-size: 12px;
    color: ${theme.colors.textMuted};
  }
`;

export const PreviewWrapper = styled.div`
  margin-top: 16px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  overflow: hidden;
  background-color: #fdfdfd;
  display: flex;
  flex-direction: column;
`;

export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: #f7f7f7;
  border-bottom: 1px solid ${theme.colors.border};
  font-size: 13px;
  color: ${theme.colors.text};
  font-weight: 500;
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 80%;
  }
`;

export const PreviewFrame = styled.div`
  width: 100%;
  height: 360px;
  max-height: 45vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ececec;
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  @media (max-width: 480px) {
    height: 240px;
    max-height: 35vh;
  }
`;

// ============================================
// BLOQUES Y SUBTÍTULOS
// ============================================
export const ModalBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ModalBlockTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
`;

export const ModalSubtitle = styled.div`
  margin-top: 2px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
`;

// ============================================
// TABLAS DENTRO DEL MODAL
// ============================================
export const ModalTableCard = styled.div`
  overflow: hidden;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
`;

export const ModalTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
`;

export const ModalTableHead = styled.thead`
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  th {
    padding: 10px 16px;
    font-weight: 600;
    color: #475569;
    text-align: left;
    &:last-child {
      text-align: right;
    }
  }
`;

export const ModalTableHeaderCell = styled.th`
  width: ${({ $width = "auto" }) => $width};
`;

export const ModalTableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.15s ease;
  &:hover {
    background-color: #f8fafc;
  }
  td {
    padding: 10px 16px;
    color: #1e293b;
    &:last-child {
      text-align: right;
      font-weight: 600;
      color: #0f172a;
    }
  }
`;

export const ModalEmptyCell = styled.td`
  padding: 16px !important;
  text-align: center !important;
  color: #64748b !important;
  font-weight: 400 !important;
`;

// ============================================
// TOTALES Y RESUMENES
// ============================================
const totalBarVariants = {
  success: {
    background: "#f0fdf4",
    color: "#15803d",
  },
  info: {
    background: "#eff6ff",
    color: "#1d4ed8",
  },
  default: {
    background: "#f8fafc",
    color: "#0f172a",
  },
};

export const ModalTotalBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding: 10px 16px;
  background-color: ${({ $variant = "default" }) => (totalBarVariants[$variant] || totalBarVariants.default).background};
  border-top: 1px solid #e2e8f0;
  font-size: 14px;
  .total-label {
    color: #334155;
    font-weight: 500;
  }
  .total-value {
    color: ${({ $variant = "default" }) =>
      (totalBarVariants[$variant] || totalBarVariants.default).color};
    font-weight: 700;
    font-size: 15px;
  }
`;

export const ModalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $compact }) => ($compact ? "4px" : "0")};
  padding: ${({ $compact }) => $compact ? "4px 10px" : "3px 12px"};
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ $bg = "#f1f5f9" }) => $bg};
  color: ${({ $color = "#334155" }) => $color};
`;

// ============================================
// TARJETAS DE INFORMACIÓN
// ============================================
export const ModalInfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 22px;
  background-color: ${({ $bg = "#f0fdf4" }) => $bg};
  border: 1px solid ${({ $borderColor = "#bbf7d0" }) => $borderColor};
  border-radius: 12px;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ModalInfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $color = "#16a34a" }) => $color};
`;

export const ModalInfoColumn = styled.div`
  display: flex;
  flex: ${({ $flex = 1 }) => $flex};
  flex-direction: column;
  gap: ${({ $gap = "8px" }) => $gap};
  min-width: 0;
  font-size: 13.5px;
  color: #334155;
  .item {
    display: flex;
    align-items: center;
    justify-content: ${({ $spread }) =>
      $spread ? "space-between" : "flex-start"};
    gap: 8px;
    flex-wrap: wrap;
  }
  .label {
    color: #475569;
  }
  .val {
    font-weight: 600;
    color: #0f172a;
  }
`;

export const ModalInfoDivider = styled.div`
  width: 1px;
  height: 64px;
  flex-shrink: 0;
  background-color: #cbd5e1;
  opacity: 0.7;
  @media (max-width: 600px) {
    width: 100%;
    height: 1px;
  }
`;

export const ModalResultBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px;
  background-color: ${({ $bg = "#dcfce7" }) => $bg};
  border-radius: 8px;
  font-size: 13.5px;
  .label {
    color: ${({ $labelColor = "#166534" }) => $labelColor};
    font-weight: 600;
  }
  .amount {
    color: ${({ $valueColor = "#15803d" }) => $valueColor};
    font-weight: 700;
    font-size: 14.5px;
  }
`;

// ============================================
// ESTADO DE CARGA
// ============================================
export const ModalLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 30px;
  color: ${theme.colors.primary};
  font-size: 14px;
  svg {
    animation: modalLoadingSpin 1s linear infinite;
  }
  @keyframes modalLoadingSpin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// ============================================
// ENCABEZADOS Y BOTONES REUTILIZABLES
// ============================================
export const ModalSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const ModalOutlineButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: #1a422b;
  border: 1.5px solid #1a422b;
  border-radius: 9999px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #1a422b;
    color: #ffffff;
  }
`;

// ============================================
// ACORDEONES REUTILIZABLES
// ============================================
export const ModalAccordionCard = styled.div`
  border: 1.5px solid ${({ $highlighted }) => $highlighted ? "#278e54" : "#d0d7de"};
  background: ${({ $highlighted }) => $highlighted ? "#fbfdfc" : "#f8f9fa"};
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.2s ease;
`;

export const ModalAccordionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ $highlighted }) => $highlighted ? "#eaf5ee" : "#f1f5f9"};
  cursor: pointer;
  user-select: none;
`;

export const ModalAccordionLeading = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ModalCircleIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $highlighted }) => $highlighted ? "#c8ebd4" : "#e2e8f0"};
  color: ${({ $highlighted }) => $highlighted ? "#1e7e44" : "#64748b"};
`;

export const ModalAccordionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ModalAccordionTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
`;

export const ModalAccordionSubtitle = styled.div`
  font-size: 0.8rem;
  color: #64748b;
`;

export const ModalAccordionTrailing = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ModalChevron = styled.div`
  color: #475569;
  display: flex;
  align-items: center;
`;

export const ModalAccordionBody = styled.div`
  padding: 16px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
`;

// ============================================
// ALERTAS REUTILIZABLES
// ============================================
export const ModalAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 14px;
  font-size: 0.85rem;
  font-weight: 500;
`;