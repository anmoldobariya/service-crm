import { ActionsCell, DeleteActionItem, EditActionItem, HeaderDeleteBtn, LogsActionItem } from '@/components/ActionsCell';
import { SERVICE_COLUMNS } from '@/components/columns/servicesColumns';
import { DataTable } from '@/components/DataTable';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/layout/Header';
import { SearchBox } from '@/components/SearchBox';
import { useDataTable } from '@/hooks/use-data-table';
import { cn } from '@/lib/utils';
import { useGetServiceListMutation, type Service } from '@/store/api/serviceApi';
import type { RootState } from '@/store/store';
import { PAGINATION_LIMIT, SERVICE_STATUS, SERVICE_STATUS_OPTIONS } from '@/utils/constant';
import { handleStatusesBadge } from '@/utils/helper';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ServicePage() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const [uniqueServiceLists, setUniqueServiceLists] = useState<string[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState<string>('');
  const [searchTxt, setSearchTxt] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string[]>([SERVICE_STATUS.PENDING, SERVICE_STATUS.IN_PROCESS]);
  const [statusCount, setStatusCount] = useState<{ [key: string]: number }>({});
  const [areaFilter, setAreaFilter] = useState<string[]>([]);

  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [getServiceList, { isLoading: isLoadingList }] = useGetServiceListMutation();

  const { areaOptions: AREA_OPTIONS } = useSelector((state: RootState) => state.resource);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, areaFilter, search]);

  useEffect(() => {
    if (abortController) abortController.abort();

    const controller = new AbortController();
    setAbortController(controller);

    const fetchData = async () => {
      try {
        const response = await getServiceList({
          page: page,
          limit: PAGINATION_LIMIT,
          ...(statusFilter.length && { status: statusFilter?.map(status => status.toLowerCase()) }),
          ...(areaFilter.length && { area: areaFilter }),
          ...(search && { search }),
        }).unwrap();

        if (!controller.signal.aborted) {
          const { result, itTotal } = response;
          const newServices = page === 1 ? result : [...services, ...result];

          setServices(newServices);
          setTotalItems(itTotal);
          setHasMore((page * PAGINATION_LIMIT) < itTotal);

          const uniqueService = [
            ...new Set(newServices?.map((item) => `${item?.cid?.code}`))
          ].filter(Boolean);
          setUniqueServiceLists(uniqueService);

          const newStatusCount = newServices.reduce((acc, service) => {
            const status = service.status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number });
          setStatusCount(newStatusCount);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error)
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [page, statusFilter, areaFilter, search]);

  const columns = useMemo(() => [
    ...SERVICE_COLUMNS,
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <ActionsCell>
          <EditActionItem onClick={() => { }} />
          <DeleteActionItem onClick={() => { }} />
          <LogsActionItem onClick={() => { }} />
        </ActionsCell>
      ),
      enableSorting: false,
      enableHiding: false
    }
  ], []);

  const ServiceTable = useDataTable({
    columns: columns,
    data: services
  });

  const selectedRows = useMemo(() => {
    return ServiceTable.getSelectedRowModel().flatRows.map(row => row.original._id);
  }, [ServiceTable.getSelectedRowModel().flatRows]);

  const headerOptions = (
    <div className='flex items-center gap-2'>
      <div className='flex gap-2'>
        {Object.entries(statusCount).map(([status, count]) => (
          <div key={status} className={cn('px-2', handleStatusesBadge("headerBadge-" + status))}>
            {`${status}: ${count}`}
          </div>
        ))}
      </div>
      <HeaderDeleteBtn length={selectedRows.length} onClick={() => { }} />
      <Dropdown
        placeholder='Filter by Area'
        items={AREA_OPTIONS}
        value={areaFilter}
        onChange={(value) => { setAreaFilter(value as string[]) }}
        className='w-[200px]'
        searchable
        multiple
      />
      <SearchBox search={searchTxt} handleChange={setSearchTxt} debounceChange={setSearch} />
      <Dropdown
        placeholder='Filter by Status'
        items={SERVICE_STATUS_OPTIONS}
        value={statusFilter}
        onChange={(value) => { setStatusFilter(value as string[]) }}
        className='w-[200px]'
        multiple
      />
    </div>
  )

  return (
    <div className="h-full w-full p-4 flex flex-col gap-2">
      <Header title={"Services"} subTitle={`(${services?.length}/${totalItems}) (${uniqueServiceLists?.length})`} options={headerOptions} />

      <div className='flex-1 min-h-0'>
        <DataTable
          table={ServiceTable}
          isLoading={isLoadingList}
          hasMore={hasMore}
          threshold={0.1}
          onLoadMore={() => { setPage(prev => prev + 1); }}
        />
      </div>
    </div>
  )
}