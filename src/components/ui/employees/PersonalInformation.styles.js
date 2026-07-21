import styled from "styled-components";
import { theme } from "../Theme";

export const FileCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 10px 16px;
  background-color: ${theme.colors.secondaryBackground};
  border-radius: ${theme.radius.lg};
  @media (max-width: 700px) {
    align-items: stretch;
    flex-direction: column;
    gap: 10px;
  }
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
  @media (max-width: 700px) {
    gap: 10px;
  }
`;

export const FileIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  color: ${theme.colors.primary};
`;

export const FileTitle = styled.h3`
  margin: 0 0 6px;
  color: ${theme.colors.text};
  font-size: 17px;
  font-weight: 500;
`;

export const FileDescription = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: 13px;
  line-height: 1.5;
`;

export const FileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  @media (max-width: 480px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const InformationColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

export const InformationSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`;

export const SectionHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const ContactData = styled.div`
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
`;

export const ContactDataText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  strong {
    color: ${theme.colors.text};
    font-size: 15px;
    font-weight: 600;
  }
  span {
    overflow: hidden;
    color: ${theme.colors.textMuted};
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const roundButtonStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  border-radius: ${theme.radius.round};
`;

export const AddButton = styled.button`
  ${roundButtonStyles}
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  color: ${theme.colors.white};
  background-color: ${theme.colors.primary};
  border: none;
  &:hover {
    opacity: 0.9;
  }
`;

export const EmergencyCard = styled.div`
  min-height: 155px;
  padding: 20px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  min-height: 115px;
  color: ${theme.colors.text};
  text-align: center;
  strong {
    font-size: 15px;
  }
  span {
    color: ${theme.colors.textMuted};
    font-size: 12px;
    line-height: 1.4;
  }
`;

export const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ContactItem = styled.article`
  padding: 18px;
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const ContactTopRow = styled.div`
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr)
    30px;
  align-items: flex-start;
  gap: 16px 24px;
  margin-bottom: 16px;
  @media (max-width: 560px) {
    position: relative;
    grid-template-columns: 1fr;
    gap: 16px;
    padding-right: 36px;
  }
`;

export const ContactBottomRow = styled.div`
  display: grid;
  grid-template-columns:
    minmax(0, 1fr)
    minmax(0, 1fr)
    30px;
  gap: 16px 24px;
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const ContactDetail = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  color: ${theme.colors.primary};
  > svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
  > div {
    display: flex;
    flex-direction: column;
    gap: 4px;

    min-width: 0;
  }
  strong {
    color: ${theme.colors.textMuted};

    font-size: 12px;
    font-weight: 500;
  }
  span {
    overflow: hidden;
    color: ${theme.colors.text};
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ContactMenu = styled.details`
  position: relative;
  justify-self: end;
  &[open] {
    z-index: 5;
  }
  @media (max-width: 560px) {
    position: absolute;
    top: -6px;
    right: 0;
  }
`;

export const ContactMenuButton = styled.summary`
  ${roundButtonStyles}
  width: 30px;
  height: 30px;
  color: ${theme.colors.primary};
  list-style: none;
  &::-webkit-details-marker {
    display: none;
  }
  &::marker {
    content: "";
  }
  &:hover {
    background-color: rgba(47, 87, 60, 0.08);
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 1px;
  }
  svg {
    display: block;
  }
`;

export const ContactMenuList = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  min-width: 132px;
  padding: 6px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  box-shadow: 0 8px 24px rgba(31, 31, 31, 0.14);
`;

export const ContactMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  min-height: 34px;
  padding: 0 10px;
  color: ${({ $danger }) => $danger ? theme.colors.danger : theme.colors.text};
  font-family: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: ${theme.radius.sm};
  &:hover {
    background-color: ${({ $danger }) =>
      $danger
        ? "rgba(255, 43, 43, 0.08)"
        : theme.colors.background};
  }
  svg {
    flex-shrink: 0;
  }
`;