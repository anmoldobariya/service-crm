import type { User } from "@/store/api/authApi";
import type { ColumnDef } from "@tanstack/react-table";
import { getCommonColumns } from "./commonColumns";

const COMMON_COLUMNS = getCommonColumns<User>();

export const USER_COLUMNS: ColumnDef<User>[] = [
  ...COMMON_COLUMNS,
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone_no',
    header: 'Phone No.',
  }
]