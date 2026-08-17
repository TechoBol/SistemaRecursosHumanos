import styled from "styled-components";
import { theme } from "./Theme";

export const DetailPage = styled.main`
  width: 100%;
  min-width: 0;
`;

export const DetailContainer = styled.section`
  width: 100%;
  min-width: 0;
  background-color: ${theme.colors.background};
  border-radius: ${theme.radius.xl};
`;

export const DetailTabs = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 4px;
  overflow-x: auto;
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.round};
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const DetailTab = styled.button`
  flex: 1;
  min-width: max-content;
  min-height: 34px;
  padding: 0 18px;
  color: ${({ $active }) => $active ? theme.colors.white : theme.colors.text};
  font-family: inherit;
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
  background-color: ${({ $active }) => $active ? theme.colors.primary : "transparent"};
  border: none;
  border-radius: ${theme.radius.round};
  transition: background-color ${theme.transitions.fast};
  &:hover {
    background-color: ${({ $active }) =>
      $active
        ? theme.colors.primary
        : theme.colors.background};
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const DetailNavigation = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  color: ${theme.colors.textMuted};
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: ${theme.radius.sm};
  svg {
    flex-shrink: 0;
  }
  &:hover {
    color: ${theme.colors.primary};
    background-color: ${theme.colors.background};
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
`;

export const DetailHeaderGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 1fr);
  gap: 14px;
  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }
`;

const headerCardStyles = `
  min-width: 0;
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  box-shadow: 0 3px 8px rgba(31, 31, 31, 0.12);
`;

export const DetailMainCard = styled.section`
  ${headerCardStyles}
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 28px;
  @media (max-width: 600px) {
    padding: 20px;
  }
`;

export const EmployeeName = styled.h1`
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 700;
  line-height: 1.2;
`;

export const EmployeeMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

export const EmployeeMetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: ${theme.colors.text};
  font-size: 13px;
  svg {
    flex-shrink: 0;
    color: ${theme.colors.primary};
  }
`;

export const EmployeeMetaDivider = styled.span`
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  background-color: ${theme.colors.text};
  border-radius: ${theme.radius.round};
`;

export const EmployeeStatus = styled.span`
  padding: 5px 16px;
  color: ${({ $status }) =>
    $status === "Activo"
      ? theme.colors.primary
      : theme.colors.danger};
  font-size: 13px;
  background-color: ${({ $status }) => $status === "Activo" ? "#cff7d5" : "#ffd8d8"};
  border-radius: ${theme.radius.round};
`;

export const ContactCard = styled.section`
  ${headerCardStyles}
  display: flex;
  flex-direction: column;
  padding: 20px 24px;
  @media (max-width: 600px) {
    padding: 20px;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const ContactSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContactDataItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
  padding: 10px 0;
  color: ${theme.colors.primary};
  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.border};
  }
  > svg {
    flex-shrink: 0;
  }
  > span {
    overflow: hidden;
    color: ${theme.colors.text};
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ContactActionGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
`;

const baseButtonStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 20px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: ${theme.radius.round};
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

export const ActionButton = styled.button`
  ${baseButtonStyles}
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

export const SecondaryButton = styled.button`
  ${baseButtonStyles}
  color: ${theme.colors.textMuted};
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  &:hover:not(:disabled) {
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const TabContentCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
  padding: 20px 24px;
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.lg};
  @media (max-width: 768px) {
    min-height: auto;
    padding: 20px;
  }
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const EmptyTabContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: ${theme.colors.textMuted};
  font-size: 14px;
  text-align: center;
`;