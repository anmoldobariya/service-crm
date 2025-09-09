import { ActionItem, ActionsCell, DeleteActionItem, EditActionItem } from "@/components/ActionsCell";
import { CURRENT_COLUMNS, INVITED_COLUMNS } from "@/components/columns/invitationColumns";
import { DataTable } from "@/components/DataTable";
import Header from "@/components/layout/Header";
import Navigation from "@/components/Navigation";
import { useDataTable } from "@/hooks/use-data-table";
import { useInvitationListQuery, type Invitation } from "@/store/api/invitationApi";
import { SendToBack } from "lucide-react";
import { useMemo, useState } from "react";

const NavItem = {
  InvitedUsers: "InvitedUsers",
  CurrentUsers: "CurrentUsers"
} as const;
type NavItemType = typeof NavItem[keyof typeof NavItem];

export default function InvitationPage() {
  const { data: invitedUsers, isLoading: invitedUsersFetching } = useInvitationListQuery({ isRequested: false });
  const { data: currentUsers, isLoading: currentUsersFetching } = useInvitationListQuery({ isRequested: true });
  const [activeNavItem, setActiveNavItem] = useState<NavItemType>(NavItem.InvitedUsers);

  const navigationItems = useMemo(() => [
    {
      label: "Invited Users",
      active: activeNavItem === NavItem.InvitedUsers,
      onClick: () => setActiveNavItem(NavItem.InvitedUsers),
      ...(!invitedUsersFetching && {
        badge: `${invitedUsers?.result?.length || 0}`
      })
    },
    {
      label: "Current Users",
      active: activeNavItem === NavItem.CurrentUsers,
      onClick: () => setActiveNavItem(NavItem.CurrentUsers),
      ...(!currentUsersFetching && {
        badge: `${currentUsers?.result?.length || 0}`
      })
    },
  ], [activeNavItem, invitedUsers, currentUsers, currentUsersFetching, invitedUsersFetching]);

  return (
    <div className="h-full w-full p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Header title={"Invitation"} />
        <Navigation items={navigationItems} variant="pills" className="w-fit border border-gray-300" />
      </div>
      <div className='flex-1 min-h-0'>
        {activeNavItem === NavItem.InvitedUsers && <InvitedUser users={invitedUsers?.result!} isLoading={invitedUsersFetching} />}
        {activeNavItem === NavItem.CurrentUsers && <CurrentUser users={currentUsers?.result!} isLoading={currentUsersFetching} />}
      </div>
    </div>
  )
}

interface InvitationProps {
  users: Invitation[];
  isLoading: boolean;
}

function InvitedUser({ users, isLoading }: InvitationProps) {
  const columns = useMemo(() => [
    ...INVITED_COLUMNS,
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <ActionsCell>
          <ActionItem icon={<SendToBack />} onClick={() => { }} >Resend</ActionItem>
          <DeleteActionItem onClick={() => { }} />
        </ActionsCell>
      ),
      enableSorting: false,
      enableHiding: false
    }
  ], []);

  const table = useDataTable({
    columns,
    data: users || []
  });

  return (
    <DataTable table={table} isLoading={isLoading} />
  )
}

function CurrentUser({ users, isLoading }: InvitationProps) {
  const columns = useMemo(() => [
    ...CURRENT_COLUMNS,
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

  const table = useDataTable({
    columns,
    data: users || []
  });

  return (
    <DataTable table={table} isLoading={isLoading} />
  )
}