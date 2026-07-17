import {
  GridWrapper,
  StyledDataGrid,
  TableContainer,
} from "../ui/DataTable.styles";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 30, 50];

const DataTable = ({
  rows = [],
  columns = [],
  loading = false,

  pageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  height = "560px",

  getRowId,
  checkboxSelection = false,
  disableColumnMenu = false,
  disableColumnSorting = false,
  disablePagination = false,
  hideFooter = false,

  onRowClick,
  onRowDoubleClick,
  onRowSelectionModelChange,

  localeText,
  ...dataGridProps
}) => {
  return (
    <TableContainer>
      <GridWrapper $height={height}>
        <StyledDataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          pagination={!disablePagination}
          initialState={{
            pagination: {
              paginationModel: {
                page: 0,
                pageSize,
              },
            },
          }}
          pageSizeOptions={pageSizeOptions}
          checkboxSelection={checkboxSelection}
          disableRowSelectionOnClick
          disableColumnMenu={disableColumnMenu}
          disableColumnSorting={disableColumnSorting}
          hideFooter={hideFooter}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          onRowSelectionModelChange={onRowSelectionModelChange}
          localeText={{
            noRowsLabel: "No existen registros",
            noResultsOverlayLabel: "No se encontraron resultados",
            footerRowSelected: (count) =>
              count === 1
                ? "1 fila seleccionada"
                : `${count} filas seleccionadas`,
            ...localeText,
          }}
          {...dataGridProps}
        />
      </GridWrapper>
    </TableContainer>
  );
};

export default DataTable;