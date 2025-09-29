import type { Area } from "@/store/api/area";
import type { ColumnDef } from "@tanstack/react-table";
import { getCommonColumns } from "./commonColumns";

const COMMON_COLUMNS = getCommonColumns<Area>();

export const AREA_COLUMNS: ColumnDef<Area>[] = [
  ...COMMON_COLUMNS,
  {
    accessorKey: 'area',
    header: 'Area',
    cell: ({ row }) => `${row.getValue('area') || ''}`,
  }
]