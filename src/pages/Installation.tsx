import { ActionsCell, DeleteActionItem, EditActionItem, HeaderDeleteBtn } from "@/components/ActionsCell";
import { INSTALLATION_COLUMNS } from "@/components/columns/installationColumns";
import { DataTable } from "@/components/DataTable";
import Header from "@/components/layout/Header";
import { SearchBox } from "@/components/SearchBox";
import { useDataTable } from "@/hooks/use-data-table";
import { useInstallationListQuery } from "@/store/api/installation";
import { useMemo, useState } from "react";

export default function InstallationPage() {
  const { data: Installations, isFetching } = useInstallationListQuery({});
  const [_search, setSearch] = useState<string>('');
  const [searchTxt, setSearchTxt] = useState<string>('');

  const columns = useMemo(() => [
    ...INSTALLATION_COLUMNS,
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

  const InstallationTable = useDataTable({
    columns: columns,
    data: Installations || []
  });

  const selectedRows = useMemo(() => {
    return InstallationTable.getSelectedRowModel().flatRows.map(row => row.original._id);
  }, [InstallationTable.getSelectedRowModel().flatRows]);

  const headerOptions = (
    <div className='flex items-center gap-2'>
      <HeaderDeleteBtn length={selectedRows.length} onClick={() => { }} />
      <SearchBox search={searchTxt} handleChange={setSearchTxt} debounceChange={setSearch} />
    </div>
  )

  return (
    <div className="h-full w-full p-4 flex flex-col gap-2">
      <Header title={"Installations"} subTitle={`(${Installations?.length}/${Installations?.length})`} options={headerOptions} />

      <div className='flex-1 min-h-0'>
        <DataTable
          table={InstallationTable}
          isLoading={isFetching}
        />
      </div>
    </div>
  )
}