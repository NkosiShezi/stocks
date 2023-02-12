import * as React from "react";
import { useState, useMemo } from "react";

import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { Button, Grid, TextField } from "@mui/material";

import TableHeader from "../table/TableHeader";
import Stocks from "@/models/stocks";
import { StockValues } from "@/models";
import Values from "./Values";
import { stableSort, getComparator } from "@/util/tableSort";
import useFetch from "@/hooks/useFetch";
import TableToolbar from "../table/TableToolbar";

type Order = "asc" | "desc";

interface Data {
  stock: string;
  industry: string;
  sector: string;
  currencyCode: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "stock",
    numeric: false,
    disablePadding: false,
    label: "Stock",
  },
  {
    id: "industry",
    numeric: false,
    disablePadding: true,
    label: "Industry",
  },
  {
    id: "sector",
    numeric: false,
    disablePadding: false,
    label: "Sector",
  },
  {
    id: "currencyCode",
    numeric: false,
    disablePadding: false,
    label: "currencyCode",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

interface Props {
  stocks: Stocks[];
}

export default function Stock({ stocks }: Props) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Stocks>("stock");
  const [selected, setSelected] = React.useState<number>(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [stockValues, setStockValues] = useState<StockValues[]>([]);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Stocks[]>(stocks);

  const { data, loading, error } = useFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/stockValues/${selected}`
  );

  const searchKeys: string[] = ["stock", "industry", "sector", "currencyCode"];

  useMemo(() => {
    const searchData = stocks.filter((stock) => {
      return searchKeys.some((key: string) => {
        return stock[key as keyof Stocks]
          .toString()
          .toLowerCase()
          .includes(search);
      });
    });

    setPage(0);
    setRows(searchData);
  }, [search]);

  useMemo(() => setStockValues(data), [data]);

  const getStockName = (stockId: number): string => {
    const selectedStock = stocks
      .filter((stock) => stock.id === stockId)
      .map((data) => data.stock);
    return selectedStock.length > 0 ? selectedStock[0] : "";
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Stocks
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    if (selected === id) {
      setSelected(0);
      setStockValues([]);
    } else {
      setSelected(id);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (search: string): void => {
    setSearch(search);
  };

  const isSelected = (id: number) => id === selected;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableToolbar
            numSelected={0}
            heading={"Stocks"}
          />
          <TextField
            sx={{ ml: 2 }}
            id='outlined-basic'
            label='Search'
            variant='outlined'
            onChange={(e) => handleSearch(e.target.value)}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby='tableTitle'
              size={"medium"}
            >
              <TableHeader
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={headCells}
                hasCheckBox={false}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding='checkbox'>
                          <Checkbox
                            color='primary'
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component='th'
                          id={labelId}
                          scope='row'
                          padding='none'
                        >
                          {row.stock}
                        </TableCell>
                        <TableCell align='center'>{row.industry}</TableCell>
                        <TableCell align='center'>{row.sector}</TableCell>
                        <TableCell align='center'>{row.currencyCode}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {stockValues.length > 0 && (
          <>
            <Values
              stockValues={stockValues}
              stockName={getStockName(selected)}
            />
          </>
        )}

        <Grid>
          <Grid
            item
            textAlign={"right"}
          >
            <Button
              disabled={!(stockValues.length > 0)}
              variant='contained'
              color='success'
              sx={{ mb: 2 }}
            >
              Export to JSON
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
