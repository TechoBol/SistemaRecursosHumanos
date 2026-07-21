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
  grid-template-columns:
    minmax(0, 1.3fr)
    minmax(280px, 0.7fr);
  gap: 28px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailSection = styled.section`
  min-width: 0;
`;

export const DetailTitle = styled.h3`
  margin: 0 0 14px;

  color: ${({ $variant }) =>
    $variant === "danger"
      ? theme.colors.danger
      : theme.colors.text};

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
  color: ${({ $variant }) =>
    $variant === "danger"
      ? theme.colors.danger
      : theme.colors.text};

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

  background-color: ${({ $variant = "success" }) =>
    $variant === "danger" ? "#FFD8D8" : "#CFF7D5"};

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