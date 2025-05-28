import { Transactions } from "@/api";
import { ColumnDef, RowData } from "@tanstack/react-table";
declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select" | "range-date";
  }
}
export const TRANSACTIONS_COLUMNS: ColumnDef<Transactions, any>[] = [
  {
    accessorKey: "doc_no",
    header: "Số CT",
    cell: (info) => info.getValue(),
    size: 60,
  },
  {
    accessorKey: "date_time",
    header: "Ngày giao dịch",
    cell: (info) => info.getValue(),
    size: 50,
    enableResizing: false,
  },
  {
    accessorKey: "credit",
    header: "Credit",
    cell: (info) => {
      const value = info.getValue();
      const formattedValue = new Intl.NumberFormat("de-DE").format(value);
      return formattedValue;
    },
    size: 80,
  },
  {
    accessorKey: "debit",
    header: "Debit",
    cell: (info) => info.getValue(),
    size: 50,
  },
  {
    accessorKey: "detail",
    header: "Detail",
    cell: (info) => info.getValue(),
    // size: 250,
  },
];
