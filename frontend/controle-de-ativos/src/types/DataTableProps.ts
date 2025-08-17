import { Column } from "./Column";

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
}
 