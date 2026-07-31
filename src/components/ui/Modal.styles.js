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
  gap: 18px;
  min-height: 0;
  padding: 0 18px 0px 22px;
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
    padding: 0 12px 16px 16px;
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
  margin: 0 0 18px;
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
  @media (max-width: 800px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
  &[type="date"]::-webkit-calendar-picker-indicator,
  &[type="date"]::-webkit-inner-spin-button {
    display: none;
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
  grid-template-columns: repeat(2, 1fr);
  min-height: 40px;
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
    if (!$active) {
      return theme.colors.white;
    }
    return $variant === "danger"
      ? theme.colors.danger
      : theme.colors.primary;
  }};
  border: none;
  transition:
    color ${theme.transitions.fast},
    background-color ${theme.transitions.fast};
  &:not(:last-child) {
    border-right: 1px solid ${theme.colors.border};
  }
  &:hover {
    background-color: ${({ $active, $variant = "primary" }) => {
      if (!$active) {
        return theme.colors.background;
      }
      return $variant === "danger"
        ? theme.colors.danger
        : theme.colors.primary;
    }};
  }
  &:focus-visible {
    position: relative;
    z-index: 1;
    outline: 2px solid
      ${({ $variant = "primary" }) =>
        $variant === "danger"
          ? theme.colors.danger
          : theme.colors.primary};

    outline-offset: -2px;
  }
`;

export const ModalActions = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
  padding: 16px 22px 20px;
  background-color: ${theme.colors.background};
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