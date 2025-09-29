import { cn } from "@/lib/utils";
import type { Company } from "@/store/api/company";
import { DATE_FORMATE } from "@/utils/constant";
import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { getCommonColumns } from "./commonColumns";

const COMMON_COLUMNS = getCommonColumns<Company>();

export const COMPANY_COLUMNS: ColumnDef<Company>[] = [
  ...COMMON_COLUMNS,
  {
    accessorKey: 'name',
    header: 'Company',
    cell: ({ row }) => {
      const amc = row.original;
      return `${amc.code} - ${amc.name}`;
    },
  },
  {
    accessorKey: 'link',
    header: 'Link',
    cell: ({ row }) => `${row.getValue('link') || '-'}`,
  },
  {
    accessorKey: 'whatsapp_id',
    header: 'Whatsapp ID',
    cell: ({ row }) => `${row.getValue('whatsapp_id') || '-'}`,
  },
  {
    accessorKey: 'contact_no',
    header: 'Contact No',
    cell: ({ row }) => `${row.getValue('contact_no') || '-'}`,
  },
  {
    accessorKey: 'assign_to.name',
    header: 'Assigned To',
    cell: ({ row }) => row.original?.assign_to?.name || "-",
  },
  {
    accessorKey: 'area.area',
    header: 'Area',
    cell: ({ row }) => row.original?.area?.area || "-",
  },
  {
    accessorKey: 'machines',
    header: 'Machines',
    cell: ({ row }) => `${row.getValue('machines') || '-'}`,
  },
  {
    accessorKey: 'anyDeskId',
    header: 'AnyDesk ID',
    cell: ({ row }) => `${row.getValue('anyDeskId') || '-'}`,
  },
  {
    accessorKey: 'anyDeskPassword',
    header: 'AnyDesk Password',
    cell: ({ row }) => `${row.getValue('anyDeskPassword') || '-'}`,
  },
  {
    accessorKey: 'remark',
    header: 'Remark',
    cell: ({ row }) => `${row.getValue('remark') || '-'}`,
  },
  {
    accessorKey: 'frequency',
    header: 'Frequency',
    cell: ({ row }) => `${row.getValue('frequency') || '-'}`,
  },
  {
    accessorKey: 'lastBackup',
    header: 'Last Backup',
    cell: ({ row }) => {
      const date = row.original.lastBackup;
      if (!date) return '-';

      return (
        <span
          className={cn(
            "py-0.5 px-1 rounded-md",
            moment().format(DATE_FORMATE.DEFAULT) === date ? "bg-green-300" : "bg-red-300"
          )}
        >
          {date}
        </span>
      )
    },
  },
]