import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import { theme } from "./Theme";

export const TableContainer = styled.section`
  width: 100%;
  min-width: 0;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.md};
  overflow: hidden;
`;

export const GridWrapper = styled.div`
  width: 100%;
  min-width: 0;
  height: ${({ $height }) => $height};
`;

export const StyledDataGrid = styled(DataGrid)`
  && {
    color: ${theme.colors.text};
    font-family: inherit;
    background-color: ${theme.colors.white};
    border: none;

    .MuiDataGrid-columnHeaders {
      color: ${theme.colors.text};
      font-weight: 600;
      background-color: ${theme.colors.background};
      border-bottom: 1px solid ${theme.colors.border};
    }

    .MuiDataGrid-columnHeaderTitle {
      font-weight: 600;
    }

    .MuiDataGrid-columnHeader:focus,
    .MuiDataGrid-columnHeader:focus-within,
    .MuiDataGrid-cell:focus,
    .MuiDataGrid-cell:focus-within {
      outline: none;
    }

    .MuiDataGrid-row {
      background-color: ${theme.colors.white};
      transition: background-color ${theme.transitions.fast};
      &:hover {
        background-color: ${theme.colors.background};
      }
    }

    .MuiDataGrid-cell {
      display: flex;
      align-items: center;
      border-bottom: 1px solid ${theme.colors.border};
    }

    .MuiDataGrid-footerContainer {
      min-height: 56px;
      background-color: ${theme.colors.white};
      border-top: 1px solid ${theme.colors.border};
    }

    .MuiTablePagination-root {
      color: ${theme.colors.text};
    }

    .MuiDataGrid-menuIconButton,
    .MuiDataGrid-sortIcon,
    .MuiDataGrid-iconButtonContainer {
      color: ${theme.colors.textMuted};
    }

    .MuiCheckbox-root {
      color: ${theme.colors.border};
      &.Mui-checked {
        color: ${theme.colors.primary};
      }
    }

    .MuiDataGrid-overlay {
      color: ${theme.colors.textMuted};
      background-color: ${theme.colors.white};
    }

    .MuiDataGrid-row.Mui-selected {
      background-color: ${theme.colors.secondaryBackground};
      &:hover {
        background-color: ${theme.colors.secondaryBackground};
      }
    }
  }
`;