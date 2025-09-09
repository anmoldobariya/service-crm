import { flexRender } from "@tanstack/react-table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableHeaderRow,
	TableRow,
} from "@/components/ui/table"
import { useMemo, useState } from "react"
import type { useDataTable } from "@/hooks/use-data-table";
import InfiniteScroll from "./ui/infinite-scroll";
import { Loader2 } from "lucide-react";

interface DataTable<TData> {
	table: ReturnType<typeof useDataTable<TData, any>>;
	isLoading?: boolean;
	hasMore?: boolean; // Optional: if you want to control this externally
	onLoadMore?: () => void; // Optional: custom load function
	threshold?: number;
}

export function DataTable<TData>({
	table,
	isLoading = false,
	hasMore = false,
	onLoadMore,
	threshold = 1,
}: DataTable<TData>) {
	// Combine external and internal states
	const rows = useMemo(() => table.getRowModel().rows, [table.getRowModel()]);
	const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

	const showNoResult = useMemo(() => !rows?.length && !isLoading, [rows?.length, isLoading]);

	// Load more data when intersection observer triggers
	const handleLoadMore = () => {
		if (!hasMore || isLoading) return;

		try {
			(onLoadMore ? onLoadMore() : Promise.resolve());
		} catch (error) {
			console.error("Failed to load more data:", error);
		}
	};

	return (
		<div ref={setScrollContainer} className="border rounded-md shadow-md bg-background max-h-full relative w-full flex flex-col">
			<Table>
				<TableHeader className="border-app-primary bg-gray-300 sticky top-0 z-10">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableHeaderRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
								</TableHead>
							))}
						</TableHeaderRow>
					))}
				</TableHeader>
				<TableBody>
					{rows?.length ? (
						<>
							{rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))}
							<InfiniteScroll
								hasMore={hasMore}
								isLoading={isLoading}
								next={handleLoadMore}
								threshold={threshold}
								root={scrollContainer}
								rootMargin="0px"
								reverse={false}
							>
								{hasMore && (
									<TableRow className="border-none">
										<TableCell colSpan={table.getFlatHeaders()?.length} className="p-4 text-center">
											<div className="flex items-center justify-center space-x-2">
												<Loader2 className="my-4 h-8 w-8 animate-spin" />
											</div>
										</TableCell>
									</TableRow>
								)}
							</InfiniteScroll>
						</>
					) :
						showNoResult ? <TableRow>
							<TableCell
								colSpan={table.getFlatHeaders()?.length}
								className="h-24 text-center"
							>
								No result found.
							</TableCell>
						</TableRow>
							: (
								<TableRow>
									<TableCell
										colSpan={table.getFlatHeaders()?.length}
										className="h-full text-center"
									>
										<div className="flex items-center justify-center h-[80vh]">
											<Loader2 stroke="#1e3a8a" className="size-10 animate-spin" />
										</div>
									</TableCell>
								</TableRow>
							)}
				</TableBody>
			</Table>
		</div>
	);
}