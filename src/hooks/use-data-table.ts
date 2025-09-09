import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type TableOptions
} from '@tanstack/react-table';

interface DataTableProps<TData, TValue>
  extends Omit<TableOptions<TData>, 'data' | 'columns' | 'getCoreRowModel'> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function useDataTable<TData, TValue>({
  columns,
  data,
  ...tableOptions
}: DataTableProps<TData, TValue>) {
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...tableOptions
  });
}
