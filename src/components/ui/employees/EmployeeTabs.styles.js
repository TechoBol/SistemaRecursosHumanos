import styled from "styled-components";
import { theme } from "../Theme";

export const TabHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 600px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const TabDescription = styled.p`
  margin: 5px 0 0;
  color: ${theme.colors.textMuted};
  font-size: 13px;
  line-height: 1.4;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    ${({ $columns = 3 }) => $columns},
    minmax(0, 1fr)
  );
  gap: 20px;
  width: 100%;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const cardVariants = {
  primary: {
    color: "#232A89",
    background: "#DCDDF8",
    border: "#6366F1",
  },
  neutral: {
    color: "#1F1F1F",
    background: "#E4E5E7",
    border: "#777777",
  },
  success: {
    color: "#2F573C",
    background: "#DCE5DF",
    border: "#62816C",
  },
  danger: {
    color: "#FF1717",
    background: "#FFD6D6",
    border: "#FF3B3B",
  },
  warning: {
    color: "#DF6C25",
    background: "#FFE6D5",
    border: "#F09A62",
  },
};

export const SummaryCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-width: 0;
  min-height: 106px;
  padding: 20px;
  color: ${({ $variant = "primary" }) =>
    cardVariants[$variant]?.color ??
    cardVariants.primary.color};
  background-color: ${({ $variant = "primary" }) =>
    cardVariants[$variant]?.background ??
    cardVariants.primary.background};
  border: 1px solid
    ${({ $variant = "primary" }) =>
      cardVariants[$variant]?.border ??
      cardVariants.primary.border};
  border-radius: ${theme.radius.lg};
`;

export const SummaryContent = styled.div`
  min-width: 0;
`;

export const SummaryLabel = styled.span`
  display: block;
  color: inherit;
  font-size: 13px;
  font-weight: 500;
`;

export const SummaryValue = styled.strong`
  display: block;
  margin-top: 10px;
  overflow: hidden;
  color: inherit;
  font-size: 25px;
  font-weight: 600;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

export const SummaryIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: inherit;
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  min-height: 120px;
  color: ${theme.colors.textMuted};
  text-align: center;
  > svg {
    color: ${theme.colors.textMuted};
  }
  strong {
    color: ${theme.colors.text};
    font-size: 13px;
    font-weight: 400;
  }
`;

export const EmptyStateAction = styled.button`
  padding: 0;
  color: ${theme.colors.primary};
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  background-color: transparent;
  border: none;
  &:hover {
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }
`;

export const ContentDivider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  background-color: ${theme.colors.border};
  border: none;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
  gap: 28px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailSection = styled.section`
  min-width: 0;
`;

export const DetailTitle = styled.h3`
  margin: 0 0 12px;
  color: ${({ $variant }) => $variant === "danger" ? theme.colors.danger : theme.colors.primary};
  font-size: 17px;
  font-weight: 600;
`;

export const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
`;

export const DetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const DetailLabel = styled.strong`
  color: ${theme.colors.text};
  font-size: 13px;
  font-weight: 500;
`;

export const DetailDescription = styled.span`
  color: ${theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.4;
`;

export const DetailValue = styled.span`
  color: ${({ $variant }) => $variant === "danger" ? theme.colors.danger : theme.colors.text};
  font-size: 13px;
  white-space: nowrap;
`;

export const HighlightCard = styled.article`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  min-height: 118px;
  padding: 24px;
  color: ${theme.colors.primary};
  background-color: rgba(47, 87, 60, 0.14);
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.lg};
  > svg {
    position: absolute;
    right: 24px;
    opacity: 0.95;
  }
`;

export const HighlightLabel = styled.span`
  color: inherit;
  font-size: 13px;
`;

export const HighlightValue = styled.strong`
  color: inherit;
  font-size: 25px;
  font-weight: 600;
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HistoryItem = styled.article`
  border-bottom: 1px solid ${theme.colors.border};
`;

export const HistoryHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-height: 50px;
  padding: 0 20px;
  color: ${theme.colors.text};
  font-family: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  background-color: transparent;
  border: none;
  &:hover {
    background-color: ${theme.colors.background};
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: -2px;
  }
  svg {
    flex-shrink: 0;
  }
`;

export const HistoryContent = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(160px, 1fr)
  );
  gap: 14px;
  padding: 16px 20px;
  background-color: ${theme.colors.background};
`;

export const HistoryValue = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  span {
    color: ${theme.colors.textMuted};
    font-size: 12px;
  }
  strong {
    color: ${theme.colors.text};
    font-size: 14px;
    font-weight: 600;
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  min-height: 22px;
  padding: 0 12px;
  color: ${({ $variant = "success" }) =>
    $variant === "danger"
      ? theme.colors.danger
      : theme.colors.primary};
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ $variant = "success" }) => $variant === "danger" ? "#FFD8D8" : "#CFF7D5"};
  border-radius: ${theme.radius.round};
`;

export const AlertCard = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 24px;
  width: min(940px, 100%);
  margin: 24px auto 0;
  padding: 24px 42px;
  color: ${({ $variant = "danger" }) =>
    $variant === "danger"
      ? theme.colors.danger
      : theme.colors.primary};
  background-color: ${({ $variant = "danger" }) =>
    $variant === "danger"
      ? "rgba(255, 43, 43, 0.05)"
      : "rgba(47, 87, 60, 0.08)"};
  border: 1px solid
    ${({ $variant = "danger" }) =>
      $variant === "danger"
        ? theme.colors.danger
        : theme.colors.primary};
  border-radius: ${theme.radius.lg};
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
    padding: 22px;
  }
`;

export const AlertContent = styled.div`
  min-width: 0;
`;

export const AlertTitle = styled.h3`
  margin: 0 0 20px;
  color: inherit;
  font-size: 17px;
  font-weight: 500;
`;

export const AlertList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding-left: 28px;
  color: inherit;
  font-size: 13px;
  line-height: 1.35;
`;

export const AlertIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: inherit;
  @media (max-width: 650px) {
    display: none;
  }
`;

export const TabActions = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: min(940px, 100%);
  margin: 12px auto 0;
  @media (max-width: 480px) {
    align-items: stretch;
    flex-direction: column-reverse;
  }
`;

export const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 172px;
  min-height: 38px;
  padding: 0 24px;
  color: ${theme.colors.white};
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${theme.colors.danger};
  border: 1px solid ${theme.colors.danger};
  border-radius: ${theme.radius.round};
  transition:
    opacity ${theme.transitions.fast},
    transform ${theme.transitions.fast};
  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  &:focus-visible {
    outline: 2px solid ${theme.colors.danger};
    outline-offset: 2px;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const IncidentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 12px;
  }
`;

export const IncidentDateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  text-align: center;
  flex-shrink: 0;
`;

export const IncidentDay = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: ${theme.colors.text};
  line-height: 1;
`;

export const IncidentMonth = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${theme.colors.textMuted};
  text-transform: uppercase;
  margin-top: 2px;
`;

export const IncidentIndicator = styled.div`
  width: 4px;
  align-self: stretch;
  background-color: ${({ $type }) => $type === "absence" ? "#dc2626" : $type === "lateness" ? "#2563eb" : "#16a34a"};
  border-radius: 2px;
  flex-shrink: 0;
`;

export const IncidentContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
  min-width: 0;
`;

export const IncidentHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const IncidentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 12px;
  text-transform: capitalize;
  ${({ $type }) =>
    $type === "absence"
      ? `
        color: #b91c1c;
        background-color: #fee2e2;
      `
      : $type === "lateness"
      ? `
        color: #1d4ed8;
        background-color: #dbeafe;
      `
      : `
        color: #15803d;
        background-color: #dcfce7;
      `}
`;

export const IncidentReason = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const IncidentMeta = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
  line-height: 1.4;
`;

export const IncidentValueBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
  min-width: 90px;
`;

export const IncidentDiscount = styled.strong`
  font-size: 15px;
  font-weight: 700;
  color: ${theme.colors.text};
`;

export const IncidentActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const IncidentActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  color: ${({ $variant }) => ($variant === "danger" ? "#FF2B2B" : theme.colors.textMuted)};
  cursor: pointer;
  background-color: transparent;
  border: none;
  border-radius: ${theme.radius.sm};
  &:hover {
    color: ${({ $variant }) => ($variant === "danger" ? "#D32F2F" : theme.colors.primary)};
    background-color: rgba(47, 87, 60, 0.08);
  }
`;

export const YearFilterSelect = styled.select`
  padding: 6px 12px;
  font-size: 13px;
  font-family: inherit;
  color: ${theme.colors.text};
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  cursor: pointer;
  outline: none;
  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

export const HistoryHeaderNew = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0px 20px 14px;
  background-color: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.border};
`;

export const GroupSummaryText = styled.span`
  font-size: 13px;
  color: ${theme.colors.textMuted};
`;

export const IncidentListContainer = styled.div`
  margin-top: 24px;
`;

export const FilterLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  margin-right: 8px;
  color: ${theme.colors.textMuted};
`;

export const HistoryEmptyState = styled.div`
  padding: 30px 20px;
  text-align: center;
  color: ${theme.colors.textMuted};
  font-size: 13px;
`;

export const HistoryMonthLabel = styled.span`
  text-transform: capitalize;
  font-weight: 600;
`;

export const HistoryGroupRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const HistoryGroupCount = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
`;

export const HistoryGroupDiscount = styled.strong`
  font-size: 13px;
  color: ${theme.colors.danger};
`;

export const HistoryGroupContent = styled.div`
  padding: 16px 20px;
  background-color: ${theme.colors.background};
`;

export const HistoryMonthHeader = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text};
  text-transform: capitalize;
  margin-bottom: 12px;
  padding-bottom: 6px;
`;

export const DesktopOnly = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 16px;
  @media (max-width: 600px) {
    display: none;
  }
`;

export const MobileOnly = styled.div`
  display: none;
  @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }
`;

export const IncidentMenu = styled.details`
  position: relative;
  display: inline-block;
  &[open] summary::before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: block;
    cursor: default;
    content: " ";
    background: transparent;
  }
`;

export const IncidentMenuButton = styled.summary`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: ${theme.colors.textMuted};
  list-style: none;
  cursor: pointer;
  border-radius: ${theme.radius.round};
  transition: background-color ${theme.transitions.fast};
  &::-webkit-details-marker {
    display: none;
  }
  &:hover {
    color: ${theme.colors.primary};
    background-color: rgba(47, 87, 60, 0.08);
  }
`;

export const IncidentMenuList = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  padding: 6px;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

export const IncidentMenuAction = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  font-family: inherit;
  font-size: 13px;
  text-align: left;
  color: ${({ $variant }) => ($variant === "danger" ? "#FF2B2B" : theme.colors.text)};
  background-color: transparent;
  border: none;
  border-radius: ${theme.radius.sm};
  cursor: pointer;
  &:hover {
    background-color: rgba(47, 87, 60, 0.08);
  }
`;

export const MobileHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const MobileHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;