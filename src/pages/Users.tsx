import { ActionsCell, DeleteActionItem, EditActionItem, HeaderDeleteBtn } from "@/components/ActionsCell";
import { USER_COLUMNS } from "@/components/columns/userColumns";
import { DataTable } from "@/components/DataTable";
import Header from "@/components/layout/Header";
import { SearchBox } from "@/components/SearchBox";
import { useDataTable } from "@/hooks/use-data-table";
import type { User } from "@/store/api/auth";
import type { RootState } from "@/store/store";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function UsersPage() {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>('');
  const [searchTxt, setSearchTxt] = useState<string>('');

  const { users: userList, userLoading: isFetching } = useSelector((state: RootState) => state.resource);

  useEffect(() => {
    setFilteredUsers(userList!);
  }, [userList]);

  useEffect(() => {
    if (search) {
      const lowerSearch = search.toLowerCase();
      setFilteredUsers(userList?.filter(user =>
        user.name.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch) ||
        user.phone_no?.toLowerCase()?.includes(lowerSearch)
      )!);
    } else {
      setFilteredUsers(userList!);
    }
  }, [search]);

  const columns = useMemo(() => [
    ...USER_COLUMNS,
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

  const UserTable = useDataTable({
    columns: columns,
    data: filteredUsers
  });

  const selectedRows = useMemo(() => {
    return UserTable.getSelectedRowModel().flatRows.map(row => row.original._id);
  }, [UserTable.getSelectedRowModel().flatRows]);

  const headerOptions = (
    <div className='flex items-center gap-2'>
      <HeaderDeleteBtn length={selectedRows.length} onClick={() => { }} />
      <SearchBox search={searchTxt} handleChange={setSearchTxt} debounceChange={setSearch} />
    </div>
  )

  return (
    <div className="h-full w-full p-4 flex flex-col gap-2">
      <Header title={"Users"} subTitle={`(${filteredUsers?.length}/${filteredUsers?.length})`} options={headerOptions} />

      <div className='flex-1 min-h-0'>
        <DataTable
          table={UserTable}
          isLoading={isFetching}
        />
      </div>
    </div>
  );
}