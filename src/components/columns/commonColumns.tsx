// commonColumns.ts
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";

export function getCommonColumns<T>() {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-gray-600"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-gray-400"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'sr',
      header: 'Sr. No.',
      cell: ({ row }) => row.index + 1,
    },
  ] as ColumnDef<T>[];
}