import type { Installation } from "@/store/api/installationApi";
import { DATE_FORMATE } from "@/utils/constant";
import { formatDate } from "@/utils/helper";
import type { ColumnDef } from "@tanstack/react-table";
import { getCommonColumns } from "./commonColumns";

const COMMON_COLUMNS = getCommonColumns<Installation>();

const statusObj = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed'
}

export const INSTALLATION_COLUMNS: ColumnDef<Installation>[] = [
  ...COMMON_COLUMNS,
  {
    accessorKey: 'companyName',
    header: 'Company Name'
  },
  {
    accessorKey: 'createdAt',
    header: 'Order Date',
    cell: ({ row }) => formatDate(row.original.createdAt, DATE_FORMATE.WITH_TIME)
  },
  {
    accessorKey: 'assignedTo.name',
    header: 'Assigned To'
  },
  {
    accessorKey: 'currentStageIndex',
    header: 'Installation Progress',
    cell: ({ row }) => {
      const currentStageIndex = row.original.currentStageIndex;
      const totalStages = row.original.stages.length;
      return `${currentStageIndex} / ${totalStages}`;
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return statusObj[status] || status;
    }
  },
]