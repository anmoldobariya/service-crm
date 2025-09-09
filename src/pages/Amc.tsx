import { AMC_COLUMNS } from "@/components/columns/amcColumns";
import { DataTable } from "@/components/DataTable";
import Header from "@/components/layout/Header";
import { SearchBox } from "@/components/SearchBox";
import { useDataTable } from "@/hooks/use-data-table";
import { useGetAMCListsQuery } from "@/store/api/amcApi";
import type { Company } from "@/store/api/companyApi";
import { Pencil } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function AmcPage() {
  const [filteredAmcLists, setFilteredAmcLists] = useState<Company[]>([]);
  const [search, setSearch] = useState<string>('');
  const [searchTxt, setSearchTxt] = useState<string>('');

  const { data: amcList, isFetching } = useGetAMCListsQuery({});

  useEffect(() => {
    setFilteredAmcLists(amcList?.result || []);
  }, [amcList]);

  useEffect(() => {
    if (search) {
      const lowerSearch = search.toLowerCase();
      setFilteredAmcLists(amcList?.result?.filter(item =>
        item.code.toLowerCase().includes(lowerSearch)
        || item.name.toLowerCase().includes(lowerSearch)
      )!);
    } else {
      setFilteredAmcLists(amcList?.result!);
    }
  }, [search]);

  const columns = useMemo(() => [
    ...AMC_COLUMNS,
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <Pencil className="size-5 cursor-pointer" stroke="#1e3a8a" />
      ),
      enableSorting: false,
      enableHiding: false
    }
  ], []);

  const AmcTable = useDataTable({
    columns: columns,
    data: filteredAmcLists
  });

  const headerOptions = (
    <div className='flex items-center gap-2'>
      <SearchBox search={searchTxt} handleChange={setSearchTxt} debounceChange={setSearch} />
    </div>
  )

  return (
    <div className="h-full w-full p-4 flex flex-col gap-2">
      <Header title={"Amc"} subTitle={`(${filteredAmcLists?.length}/${filteredAmcLists?.length})`} options={headerOptions} />

      <div className='flex-1 min-h-0'>
        <DataTable
          table={AmcTable}
          isLoading={isFetching}
        />
      </div>
    </div>
  );
}