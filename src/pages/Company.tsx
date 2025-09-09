import { ActionsCell, DeleteActionItem, EditActionItem, HeaderDeleteBtn } from "@/components/ActionsCell";
import { COMPANY_COLUMNS } from "@/components/columns/companyColumns";
import { DataTable } from "@/components/DataTable";
import Dropdown from "@/components/Dropdown";
import Header from "@/components/layout/Header";
import { SearchBox } from "@/components/SearchBox";
import { useDataTable } from "@/hooks/use-data-table";
import { useLazyCompanyListQuery, type Company } from "@/store/api/companyApi";
import type { RootState } from "@/store/store";
import { PAGINATION_LIMIT } from "@/utils/constant";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function CompanyPage() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState<string>('');
  const [searchTxt, setSearchTxt] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<string[]>([]);
  const [userFilter, setUserFilter] = useState<string[]>([]);

  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [getCompanyList, { isLoading: isLoadingList }] = useLazyCompanyListQuery();

  const { areaOptions: AREA_OPTIONS, userOptioins: USER_OPTIONS } = useSelector((state: RootState) => state.resource);

  useEffect(() => {
    setPage(1);
  }, [areaFilter, search]);

  useEffect(() => {
    if (abortController) abortController.abort();

    const controller = new AbortController();
    setAbortController(controller);

    const fetchData = async () => {
      try {
        const response = await getCompanyList({
          page: page,
          limit: PAGINATION_LIMIT,
          ...(areaFilter.length && { area: areaFilter }),
          ...(userFilter.length && { user: userFilter }),
          ...(search && { search }),
        }).unwrap();

        if (!controller.signal.aborted) {
          const { result, itTotal } = response;
          const newServices = page === 1 ? result : [...companies, ...result];

          setCompanies(newServices);
          setTotalItems(itTotal);
          setHasMore((page * PAGINATION_LIMIT) < itTotal);
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error)
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [page, areaFilter, userFilter, search]);

  const columns = useMemo(() => [
    ...COMPANY_COLUMNS,
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <ActionsCell>
          <EditActionItem onClick={() => { }} />
          <DeleteActionItem onClick={() => { }} />
        </ActionsCell>
      ),
      enableSorting: false,
      enableHiding: false
    }
  ], []);

  const CompanyTable = useDataTable({
    columns: columns,
    data: companies
  });

  const selectedRows = useMemo(() => {
    return CompanyTable.getSelectedRowModel().flatRows.map(row => row.original._id);
  }, [CompanyTable.getSelectedRowModel().flatRows]);

  const headerOptions = (
    <div className='flex items-center gap-2'>
      <HeaderDeleteBtn length={selectedRows.length} onClick={() => { }} />
      <Dropdown
        placeholder="Filter by Area"
        items={AREA_OPTIONS}
        value={areaFilter}
        onChange={(value) => { setAreaFilter(value as string[]) }}
        className='w-[200px]'
        searchable
        multiple
      />
      <Dropdown
        placeholder="Filter by User"
        items={USER_OPTIONS}
        value={userFilter}
        onChange={(value) => { setUserFilter(value as string[]) }}
        className='w-[200px]'
        searchable
        multiple
      />
      <SearchBox search={searchTxt} handleChange={setSearchTxt} debounceChange={setSearch} />
    </div>
  )

  return (
    <div className="h-full w-full p-4 flex flex-col gap-2">
      <Header title={"Company"} subTitle={`(${companies?.length}/${totalItems})`} options={headerOptions} />
      <div className='flex-1 min-h-0'>
        <DataTable
          table={CompanyTable}
          isLoading={isLoadingList}
          hasMore={hasMore}
          threshold={0.1}
          onLoadMore={() => setPage(prev => prev + 1)}
        />
      </div>
    </div>
  )
}