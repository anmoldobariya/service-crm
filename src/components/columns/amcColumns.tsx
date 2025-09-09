import type { Company } from "@/store/api/companyApi";
import { handleDays, handleIssueDate } from "@/utils/helper";
import type { ColumnDef } from "@tanstack/react-table";
import { getCommonColumns } from "./commonColumns";

const COMMON_COLUMNS = getCommonColumns<Company>();

export const AMC_COLUMNS: ColumnDef<Company>[] = [
  COMMON_COLUMNS[1],
  {
    accessorKey: 'name',
    header: 'Company',
    cell: ({ row }) => {
      const amc = row.original;
      return `${amc.code} - ${amc.name}`;
    },
  },
  {
    accessorKey: 'name',
    header: 'Expiry Date',
    cell: ({ row }) => {
      const amc = row.original;
      let formattedDate = 'No AMC';
      let tagColor = '#c7c5c5';

      if (amc.is_amc_active !== false) {
        const data = handleIssueDate(amc);
        if (data && typeof data === 'object') {
          formattedDate = data?.formattedDate;
          tagColor = data?.tagColor;
        }
      }

      return <span style={{ backgroundColor: tagColor }} className="py-0.5 px-1 rounded-md">{formattedDate}</span>
    }
  },
  {
    accessorKey: 'amc',
    header: 'Total AMC',
    cell: ({ row }) => {
      const amc = row.original;
      return amc?.amc?.length || 0;
    }
  },
  {
    accessorKey: 'amc',
    header: 'Total Amount',
    cell: ({ row }) => {
      const amc = row.original;
      const totalAmount = amc?.amc?.reduce((sum, current) => sum + (current.amount || 0), 0) || 0;
      return `₹ ${totalAmount}`;
    }
  },
  {
    accessorKey: 'name',
    header: 'Days',
    cell: ({ row }) => {
      const amc = row.original;
      return amc.is_amc_active !== false ? handleDays(amc) : '-'
    }
  }
]