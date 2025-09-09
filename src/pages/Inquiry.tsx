import { ActionsCell, DeleteActionItem, EditActionItem, HeaderDeleteBtn } from "@/components/ActionsCell";
import { INQUIRY_COLUMNS } from "@/components/columns/inquiryColumns";
import { DataTable } from "@/components/DataTable";
import Dropdown from "@/components/Dropdown";
import Header from "@/components/layout/Header";
import { SearchBox } from "@/components/SearchBox";
import { useDataTable } from "@/hooks/use-data-table";
import { useGetInquiryListQuery, type Inquiry } from "@/store/api/inquiryApi";
import { INQUIRY_STATUS, INQUIRY_STATUS_OPTIONS } from "@/utils/constant";
import { useEffect, useMemo, useState } from "react";

export default function InquiryPage() {
  const [filteredInquiries, setFilteredInquiry] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState<string>('');
  const [searchTxt, setSearchTxt] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(INQUIRY_STATUS.IN_PROGRESS);

  const { data: inquiryList, isFetching } = useGetInquiryListQuery({
    status: statusFilter || INQUIRY_STATUS.ALL,
    ...(search && { search })
  }, {
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    setFilteredInquiry(inquiryList?.result || []);
  }, [inquiryList]);

  const columns = useMemo(() => [
    ...INQUIRY_COLUMNS,
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

  const inquiryTable = useDataTable({
    columns,
    data: filteredInquiries || []
  });

  const selectedRows = useMemo(() => {
    return inquiryTable.getSelectedRowModel().flatRows.map(row => row.original._id);
  }, [inquiryTable.getSelectedRowModel().flatRows]);

  const headerOptions = (
    <div className='flex items-center gap-2'>
      <HeaderDeleteBtn length={selectedRows.length} onClick={() => { }} />
      <Dropdown
        placeholder="Filter by Status"
        items={INQUIRY_STATUS_OPTIONS}
        value={statusFilter}
        onChange={(value) => { setStatusFilter(value as string) }}
        className='w-[200px]'
      />
      <SearchBox search={searchTxt} handleChange={setSearchTxt} debounceChange={setSearch} />
    </div>
  )

  return (
    <div className="h-full w-full p-4 flex flex-col gap-2">
      <Header title={"Inquiry"} subTitle={`(${filteredInquiries?.length}/${filteredInquiries?.length})`} options={headerOptions} />
      <div className='flex-1 min-h-0'>
        <DataTable
          table={inquiryTable}
          isLoading={isFetching}
        />
      </div>
    </div>
  )
}