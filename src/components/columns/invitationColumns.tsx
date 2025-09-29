import type { Invitation } from "@/store/api/invitation";
import { DATE_FORMATE } from "@/utils/constant";
import { formatDate } from "@/utils/helper";
import type { ColumnDef } from "@tanstack/react-table";
import { getCommonColumns } from "./commonColumns";

const COMMON_COLUMNS = getCommonColumns<Invitation>();

export const INVITED_COLUMNS: ColumnDef<Invitation>[] = [
  COMMON_COLUMNS[1],
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'invitedBy.email',
    header: 'Invited By'
  },
  {
    accessorKey: 'role',
    header: 'Role'
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => formatDate(row.getValue('date'), DATE_FORMATE.WITH_TIME)
  },
]

export const CURRENT_COLUMNS: ColumnDef<Invitation>[] = [
  COMMON_COLUMNS[1],
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'invitedBy.email',
    header: 'Invited By'
  },
  {
    accessorKey: 'role',
    header: 'Role'
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => formatDate(row.getValue('date'), DATE_FORMATE.WITH_TIME)
  },
]