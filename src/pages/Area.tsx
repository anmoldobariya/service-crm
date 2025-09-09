import { ActionsCell, DeleteActionItem, EditActionItem, HeaderDeleteBtn } from "@/components/ActionsCell";
import { AREA_COLUMNS } from "@/components/columns/areaColumns";
import { DataTable } from "@/components/DataTable";
import Header from "@/components/layout/Header";
import { SearchBox } from "@/components/SearchBox";
import { useDataTable } from "@/hooks/use-data-table";
import type { Area } from "@/store/api/areaApi";
import type { RootState } from "@/store/store";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function AreaPage() {
  const [filteredAreas, setFilteredAreas] = useState<Area[]>([]);
  const [search, setSearch] = useState<string>('');
  const [searchTxt, setSearchTxt] = useState<string>('');

  const { areas, areaLoading } = useSelector((state: RootState) => state.resource);

  useEffect(() => {
    setFilteredAreas(areas);
  }, [areas]);

  useEffect(() => {
    if (search) {
      const lowerSearch = search.toLowerCase();
      setFilteredAreas(areas.filter(area =>
        area.area.toLowerCase().includes(lowerSearch)
      ));
    } else {
      setFilteredAreas(areas);
    }
  }, [search]);

  const columns = useMemo(() => [
    ...AREA_COLUMNS,
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

  const AreaTable = useDataTable({
    columns: columns,
    data: filteredAreas
  });

  const selectedRows = useMemo(() => {
    return AreaTable.getSelectedRowModel().flatRows.map(row => row.original._id);
  }, [AreaTable.getSelectedRowModel().flatRows]);

  const headerOptions = (
    <div className='flex items-center gap-2'>
      <HeaderDeleteBtn length={selectedRows.length} onClick={() => { }} />
      <SearchBox search={searchTxt} handleChange={setSearchTxt} debounceChange={setSearch} />
    </div>
  )

  return (
    <div className="h-full w-full p-4 flex flex-col gap-2">
      <Header title={"Area"} subTitle={`(${filteredAreas?.length}/${filteredAreas?.length})`} options={headerOptions} />

      <div className='flex-1 min-h-0'>
        <DataTable table={AreaTable} isLoading={areaLoading} />
      </div>
    </div>
  );
}