import styled, { css } from "styled-components";
import { theme } from "../ui/Theme";

export const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 100%;
  color: ${({ theme }) => theme.colors.text || "#1f1f1f"};
`;

export const DashboardHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
`;

export const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const HeaderTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin: 0;
  letter-spacing: -0.01em;
  @media (max-width: 768px) {
    font-size: 23px;
  }
`;

export const HeaderDate = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0;
  text-transform: capitalize;
`;

/* KPIs Grid */
export const KpisGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 14px;
`;

const KPI_VARIANTS = {
  green: css`
    background: #eef8f2;
    color: #17633a;
    border-color: #c7ead4;
    .kpi-ic {
      background: #d4f1e0;
      color: #17633a;
    }
  `,
  violet: css`
    background: #f4effd;
    color: #6a2bb4;
    border-color: #decbf9;
    .kpi-ic {
      background: #e8d9fb;
      color: #6a2bb4;
    }
  `,
  red: css`
    background: #fdf0f0;
    color: #b3262f;
    border-color: #f7cece;
    .kpi-ic {
      background: #fcd9d9;
      color: #b3262f;
    }
  `,
  blue: css`
    background: #eff4fe;
    color: #2447b8;
    border-color: #cfdcfd;
    .kpi-ic {
      background: #dbe6fc;
      color: #2447b8;
    }
  `,
  amber: css`
    background: #fff8eb;
    color: #b45309;
    border-color: #fde68a;
    .kpi-ic {
      background: #fef3c7;
      color: #b45309;
    }
  `,
};

export const KpiCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 18px;
  border-radius: 14px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  ${({ $variant }) => KPI_VARIANTS[$variant] || KPI_VARIANTS.green};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  }
`;

export const KpiIconWrapper = styled.div`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
`;

export const KpiLabel = styled.span`
  font-size: 12.5px;
  font-weight: 600;
  padding-right: 42px;
`;

export const KpiValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 6px;
  font-variant-numeric: tabular-nums;
`;

export const KpiHint = styled.span`
  font-size: 11.5px;
  opacity: 0.85;
  margin-top: 2px;
`;

/* Cards & Layout Grid */
export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
`;

export const Card = styled.section`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  &.span-8 {
    grid-column: span 8;
  }
  &.span-4 {
    grid-column: span 4;
  }
  &.span-6 {
    grid-column: span 6;
  }
  &.span-12 {
    grid-column: span 12;
  }

  @media (max-width: 1100px) {
    &.span-8 {
      grid-column: span 12;
    }
    &.span-4 {
      grid-column: span 12;
    }
  }

  @media (max-width: 900px) {
    &.span-6 {
      grid-column: span 12;
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const CardTitleGroup = styled.div`
  min-width: 0;
`;

export const CardTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

export const CardSubtitle = styled.p`
  color: #64748b;
  font-size: 12px;
  margin: 2px 0 0;
`;

/* Segmented Control / Tabs */
export const SegmentGroup = styled.div`
  display: inline-flex;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
  flex-wrap: wrap;
`;

export const SegmentButton = styled.button`
  border: 0;
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  border-radius: 8px;
  padding: 5px 11px;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? "600" : "500")};
  color: ${({ $active }) => ($active ? "#1e293b" : "#64748b")};
  display: inline-flex;
  gap: 6px;
  align-items: center;
  cursor: pointer;
  box-shadow: ${({ $active }) => ($active ? "0 1px 3px rgba(0,0,0,0.08)" : "none")};
  transition: all 0.15s ease;

  &:hover {
    color: #1e293b;
  }
`;

export const SegmentCount = styled.span`
  font-size: 10.5px;
  background: ${({ $active }) => ($active ? "#2f573c" : "#e2e8f0")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#475569")};
  border-radius: 999px;
  padding: 0 6px;
  font-variant-numeric: tabular-nums;
`;

/* List & Rows */
export const ItemsList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;

  &.scrollable {
    max-height: 380px;
    overflow-y: auto;
    padding-right: 6px;

    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
  }
`;

export const ItemRow = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid #f1f5f9;
  opacity: ${({ $dim }) => ($dim ? 0.6 : 1)};
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.12s ease;

  &:hover {
    background: #f8fafc;
    padding-left: 6px;
    padding-right: 6px;
  }

  &:first-child {
    border-top: 0;
  }

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

export const Avatar = styled.span`
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $bg }) => $bg || "#eef8f2"};
  color: ${({ $fg }) => $fg || "#17633a"};
`;

export const ItemMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ItemName = styled.p`
  font-weight: 600;
  font-size: 13px;
  color: #1e293b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ItemMeta = styled.p`
  color: #64748b;
  font-size: 11.5px;
  margin: 2px 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ItemRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
`;

export const ItemDate = styled.span`
  color: #475569;
  font-size: 11.5px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`;

/* Badges / Chips */
const CHIP_VARIANTS = {
  gray: css`
    background: #f1f5f9;
    color: #475569;
  `,
  violet: css`
    background: #6a2bb4;
    color: #ffffff;
  `,
  "violet-soft": css`
    background: #f3eafd;
    color: #6a2bb4;
    border: 1px solid #e9d5ff;
  `,
  green: css`
    background: #dcf6e5;
    color: #17633a;
    border: 1px solid #bbf7d0;
  `,
  red: css`
    background: #fee2e2;
    color: #b91c1c;
  `,
  "red-solid": css`
    background: #dc2626;
    color: #ffffff;
  `,
  amber: css`
    background: #fef3c7;
    color: #b45309;
  `,
  blue: css`
    background: #2563eb;
    color: #ffffff;
  `,
  "blue-soft": css`
    background: #eff6ff;
    color: #1d4ed8;
  `,
};

export const ChipBadge = styled.span`
  display: inline-block;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  ${({ $variant }) => CHIP_VARIANTS[$variant] || CHIP_VARIANTS.gray};
`;

/* Calendar Specific Styles */
export const CalendarControls = styled.div`
  display: flex;
  gap: 6px;
`;

export const IconButton = styled.button`
  height: 30px;
  min-width: 30px;
  display: grid;
  place-items: center;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  border-radius: 8px;
  cursor: pointer;
  color: #475569;
  transition: all 0.15s ease;

  &:hover {
    border-color: #2f573c;
    color: #2f573c;
  }

  &.text-btn {
    padding: 0 12px;
    font-size: 12px;
    font-weight: 600;
  }
`;

export const CalendarLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const LegendFilter = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #e2e8f0;
  background: ${({ $active }) => ($active ? "#f8fafc" : "#ffffff")};
  border-radius: 999px;
  padding: 4px 11px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#1e293b" : "#94a3b8")};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #94a3b8;
  }
`;

export const LegendDot = styled.i`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $color }) => $color || "#94a3b8"};
`;

export const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const CalendarHead = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
  margin-bottom: 4px;

  span {
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
    padding-bottom: 4px;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
`;

export const CalendarCell = styled.button`
  height: 56px;
  border: 1px solid ${({ $selected }) => ($selected ? "#2f573c" : "transparent")};
  background: ${({ $selected, $isToday }) => $selected ? "#e6f1ea" : $isToday ? "#f0f7f3" : "#f8fafc"};
  border-radius: 10px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: #2f573c;
  }

  &.empty {
    background: transparent;
    cursor: default;
    border: none;
  }
`;

export const DayNumber = styled.span`
  font-size: 12.5px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: #1e293b;

  ${({ $isToday }) =>
    $isToday &&
    css`
      background: #2f573c;
      color: #ffffff;
      border-radius: 999px;
      min-width: 22px;
      height: 22px;
      display: grid;
      place-items: center;
      margin: -2px 0 0 -3px;
      font-weight: 600;
    `}
`;

export const EventDotsGroup = styled.div`
  display: flex;
  gap: 3px;
`;

export const EventDot = styled.i`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color || "#2f573c"};
`;

export const DayDetailSection = styled.div`
  border-left: 1px solid #f1f5f9;
  padding-left: 20px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 900px) {
    border-left: 0;
    border-top: 1px solid #f1f5f9;
    padding-left: 0;
    padding-top: 16px;
  }
`;

export const DayDetailTitle = styled.p`
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
  margin: 0;
`;

/* Mini Stats (Contratos por vencer) */
export const MiniStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

export const MiniStatItem = styled.div`
  border-radius: 12px;
  padding: 10px 14px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  background: ${({ $bg }) => $bg || "#fee2e2"};
  color: ${({ $fg }) => $fg || "#b91c1c"};
  border: 1px solid ${({ $border }) => $border || "transparent"};

  b {
    font-size: 22px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  span {
    font-size: 12px;
    font-weight: 600;
  }
`;

/* Hito Icon / Badge */
export const HitoBadge = styled.span`
  flex: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
  background: ${({ $years }) => ($years === 2 ? "#eff6ff" : "#dcf6e5")};
  color: ${({ $years }) => ($years === 2 ? "#1d4ed8" : "#17633a")};

  b {
    font-size: 16px;
    font-weight: 700;
  }

  i {
    font-style: normal;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 2px;
  }
`;

export const EmptyState = styled.p`
  color: #94a3b8;
  padding: 24px 0;
  text-align: center;
  font-size: 13px;
  margin: 0;
`;