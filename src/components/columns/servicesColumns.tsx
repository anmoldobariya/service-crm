import type { Service } from "@/store/api/serviceApi";
import type { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { formatDate, handleStatusesBadge } from "@/utils/helper";
import { DATE_FORMATE } from "@/utils/constant";
import moment from "moment";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { getCommonColumns } from "./commonColumns";

const COMMON_COLUMNS = getCommonColumns<Service>();

export const SERVICE_COLUMNS: ColumnDef<Service>[] = [
	...COMMON_COLUMNS,
	{
		accessorKey: 'issued_on',
		header: 'Issue Date',
		cell: ({ row }) => {
			const issued_on = row.original.issued_on;
			if (!issued_on) return null;

			return (
				<div className="truncate text-sm">
					{formatDate(issued_on, DATE_FORMATE.DEFAULT)}
				</div>
			)
		}
	},
	{
		accessorKey: 'cid',
		header: 'Company',
		cell: ({ row }) => {
			const value = row.original.cid;

			const handleLinkClick = (link: string) => {
				if (link) {
					window.open(link, '_blank')
				}
			}

			return (
				<div className="w-[200px] flex items-center justify-between gap-2">
					<span className="break-words whitespace-pre-wrap text-sm">{`${value?.code || ''} - ${value?.name || ''}`}</span>
					{value?.link && (
						<ExternalLink
							className="h-4 w-4 flex-shrink-0 cursor-pointer text-[#1e3a8a] hover:text-blue-800"
							onClick={() => handleLinkClick(value.link!)}
						/>
					)}
				</div>
			)
		}
	},
	{
		accessorKey: 'issue',
		header: 'Issue',
		cell: ({ row }) => (
			<div className="w-[300px] flex items-center gap-2">
				<span className="break-words whitespace-pre-wrap text-sm">{row.original.issue || "-"}</span>
			</div>
		)
	},
	{
		accessorKey: 'machine',
		header: 'Machine',
		cell: ({ row }) => (
			<div className="w-[100px] flex items-center gap-2">
				<span className="break-words whitespace-pre-wrap text-sm">{row.original.machine || "-"}</span>
			</div>
		)
	},
	{
		accessorKey: 'assigned_to',
		header: 'Assigned To',
		cell: ({ row }) => {
			const value = row.original.assigned_to;
			return <span className="truncate text-sm">{value?.name || '-'}</span>
		}
	},
	{
		accessorKey: 'area',
		header: 'Location',
		cell: ({ row }) => {
			const value = row.original.area;
			return <span className="truncate text-sm">{value?.area || '-'}</span>
		}
	},
	{
		accessorKey: 'phone_no',
		header: 'Phone No.',
		cell: ({ row }) => {
			const phoneNo = row.original.phone_no;
			const createBy = row.original.create_by;

			const displayText = (phoneNo && createBy) ? `${phoneNo} - ${createBy}` :
				(phoneNo && !createBy) ? phoneNo : '-'

			return (
				<div className="w-[180px] truncate text-sm" title={displayText}>
					{displayText}
				</div>
			)
		}
	},
	{
		accessorKey: 'machine_no',
		header: 'Machine No.',
		cell: ({ row }) => {
			const services = row.original.services;

			if (!services || services.length === 0) {
				return <span className="text-sm">-</span>
			}

			const machineNumbers = services.map(s => s?.machine_no).filter(Boolean).join(', ');

			return (
				<TooltipProvider>
					{services.map((service: any, index: number) => (
						<Tooltip key={index}>
							<TooltipTrigger asChild>
								<span className="cursor-help text-sm" title={machineNumbers}>
									{`${service?.machine_no}${index + 1 < services!.length ? "," : ""}`}
								</span>
							</TooltipTrigger>
							<TooltipContent>
								<p>{service?.remark || 'No remark'}</p>
							</TooltipContent>
						</Tooltip>
					))}
				</TooltipProvider>
			)
		}
	},
	{
		accessorKey: 'closedDate',
		header: 'Closed Date',
		cell: ({ row }) => {
			const closedDate = row.original.closedDate;
			if (!closedDate) return "-";

			return (
				<div className="truncate text-sm">
					{formatDate(closedDate, DATE_FORMATE.WITH_TIME)}
				</div>
			)
		}
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const rowValue = row.original;
			const startDate = moment(rowValue.date);
			const timeEnd = moment(rowValue.closedDate || new Date());
			const hour = timeEnd.diff(startDate, 'hours');
			const status = rowValue.status;

			return (
				<div className="w-[110px] flex justify-end">
					<Badge
						className={cn("text-center text-xs px-2 py-1  truncate", handleStatusesBadge(status))}
						title={`${status} ${hour <= 0 ? 0 : hour}h`}
					>
						{`${status} ${hour <= 0 ? 0 : hour}h`}
					</Badge>
				</div>
			)
		}
	}
];