import type { FollowUp, Inquiry } from "@/store/api/inquiry";
import { DATE_FORMATE } from "@/utils/constant";
import { formatDate } from "@/utils/helper";
import type { ColumnDef } from "@tanstack/react-table";
import { getCommonColumns } from "./commonColumns";

const COMMON_COLUMNS = getCommonColumns<Inquiry>();

export const INQUIRY_COLUMNS: ColumnDef<Inquiry>[] = [
  ...COMMON_COLUMNS,
  {
    accessorKey: 'companyname',
    header: 'Company Name'
  },
  {
    accessorKey: 'personName',
    header: 'Person Name',
  },
  {
    accessorKey: 'contact',
    header: 'Phone Number',
    cell: ({ row }) => `${row.getValue('contact') || '-'}`,
  },
  {
    accessorKey: 'machinetype',
    header: 'Machine Type',
  },
  {
    accessorKey: 'machine',
    header: 'Machine Nunmber',
    cell: ({ row }) => `${row.getValue('machine') || '-'}`,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => `${row.getValue('address') || '-'}`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'followUp',
    header: 'Follow Up',
    cell: ({ row }) => {
      const followUp = row.original.followUp;
      let latestObj: FollowUp | undefined = undefined;

      if (followUp && followUp.length > 0) {
        const sorted = [...followUp].sort(
          (a, b) => new Date(b.followupDate).getTime() - new Date(a.followupDate).getTime()
        );
        latestObj = sorted[0];
      }

      if (!latestObj) return '-';

      return (
        <div
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <p>{formatDate(latestObj.followupDate, DATE_FORMATE.WITH_TIME)}</p>
          <span className="truncate">{latestObj.description}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => formatDate(row.getValue('date'), DATE_FORMATE.WITH_TIME) || '-',
  },
]