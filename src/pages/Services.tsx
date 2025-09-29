import { ActionsCell, DeleteActionItem, EditActionItem, HeaderDeleteBtn, LogsActionItem } from '@/components/ActionsCell';
import { SERVICE_COLUMNS } from '@/components/columns/servicesColumns';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import Dropdown from '@/components/Dropdown';
import Header from '@/components/layout/Header';
import type { ServiceFormData } from '@/components/Modals/ServiceModal';
import ServiceModal from '@/components/Modals/ServiceModal';
import { SearchBox } from '@/components/SearchBox';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import { cn } from '@/lib/utils';
import { useAddServiceMutation, useDeleteServiceMutation, useGetServiceListMutation, useUpdateServiceMutation, type Service } from '@/store/api/service';
import { setServiceRefetch } from '@/store/slices/refetchSlice';
import type { RootState } from '@/store/store';
import { PAGINATION_LIMIT, SERVICE_STATUS, SERVICE_STATUS_OPTIONS } from '@/utils/constant';
import { handleStatusesBadge } from '@/utils/helper';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

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
  const [addService, { isLoading: isAddingService }] = useAddServiceMutation();
  const [updateService, { isLoading: isUpdatingService }] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { areaOptions: AREA_OPTIONS } = useSelector((state: RootState) => state.resource);
  const { serviceRefetch } = useSelector((state: RootState) => state.refetch);
  const dispatch = useDispatch();

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
          page: serviceRefetch ? 1 : page,
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

          dispatch(setServiceRefetch(false));
        }
      } catch (error) {
        console.error('Failed to fetch services:', error)
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [serviceRefetch, page, statusFilter, areaFilter, search]);

  const handleOpenAddModal = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleServiceSubmit = async (serviceData: ServiceFormData) => {
    try {
      if (selectedService) {
        // Update existing service
        await updateService({
          _id: selectedService._id,
          body: {
            cid: serviceData.company,
            machine: serviceData.machine,
            issue: serviceData.issue,
            issued_on: serviceData.issued_on,
            status: serviceData.status,
            assigned_to: serviceData.assigned_to || undefined,
            services: serviceData.services
          }
        }).unwrap();

        toast.success('Service updated successfully!');
      } else {
        // Create new service
        await addService({
          body: {
            cid: serviceData.company,
            machine: serviceData.machine,
            issue: serviceData.issue,
            issued_on: serviceData.issued_on,
            status: serviceData.status,
            assigned_to: serviceData.assigned_to,
            services: serviceData.services
          }
        }).unwrap();

        toast.success('Service created successfully!');
      }

      handleCloseModal();

      // Trigger service list refetch
      setPage(1);
      dispatch(setServiceRefetch(true));

    } catch (error) {
      console.error('Failed to save service:', error);
      toast.error(selectedService ? 'Failed to update service' : 'Failed to create service');
    }
  };

  const handleDeleteService = async (serviceIds: string[]) => {
    try {
      await deleteService({ ids: serviceIds }).unwrap();
      toast.success('Service deleted successfully!');

      setPage(1);
      dispatch(setServiceRefetch(true));
    } catch (error) {
      console.error('Failed to delete service:', error);
      toast.error('Failed to delete service');
    }
  };

  const columns = useMemo(() => [
    ...SERVICE_COLUMNS,
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <ActionsCell>
          <EditActionItem onClick={() => handleOpenEditModal(row.original)} />
          <ConfirmDialog
            trigger={<DeleteActionItem onClick={() => { }} />}
            title="Confirm Delete"
            description="Are you sure you want to delete this service?"
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDeleteService([row.original._id])}
            variant="destructive"
          />
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
      <ConfirmDialog
        trigger={<HeaderDeleteBtn length={selectedRows.length} onClick={() => { }} />}
        title="Confirm Delete"
        description="Are you sure you want to delete all selected services?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => { handleDeleteService(selectedRows); ServiceTable.setRowSelection({}) }}
        variant="destructive"
      />
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
      <Button
        onClick={handleOpenAddModal}
        className="flex items-center gap-2"
        size="default"
      >
        <Plus className="h-4 w-4" />
        Add Service
      </Button>
    </div>
  )

  return (
    <>
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

      {/* Service Add/Edit Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleServiceSubmit}
        service={selectedService}
        loading={isAddingService || isUpdatingService}
      />
    </>
  )
}