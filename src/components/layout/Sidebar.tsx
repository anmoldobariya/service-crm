import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { RootState } from '@/store/store'
import {
	Building2,
	ChartArea,
	ChartNoAxesCombined,
	ChartPie,
	CircleQuestionMark,
	CircleUserRound,
	LayoutList,
	LogOut,
	Map,
	Settings,
	UserPen,
	UserRoundPlus
} from 'lucide-react'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../ConfirmDialog'

interface SidebarItem {
	icon: React.ComponentType<{ className?: string }>
	label: string
	path: string
}

const SidebarItems: SidebarItem[] = [
	{
		icon: LayoutList,
		label: 'Services',
		path: '/services'
	},
	{
		icon: ChartPie,
		label: 'AMC',
		path: '/amc'
	},
	{
		icon: CircleUserRound,
		label: 'Users',
		path: '/users'
	},
	{
		icon: UserPen,
		label: 'Attendance',
		path: '/attendance'
	},
	{
		icon: Settings,
		label: 'Installation',
		path: '/installation'
	},
	{
		icon: Building2,
		label: 'Company',
		path: '/company'
	},
	{
		icon: Map,
		label: 'Area',
		path: '/area'
	},
	{
		icon: CircleQuestionMark,
		label: 'Inquiry',
		path: '/inquiry'
	},
	{
		icon: ChartArea,
		label: 'Report',
		path: '/report'
	},
	{
		icon: ChartNoAxesCombined,
		label: 'AMC Report',
		path: '/amc-report'
	},
	{
		icon: UserRoundPlus,
		label: 'Invitation',
		path: '/invite-user'
	}
]

export default function Sidebar() {
	const navigate = useNavigate()
	const location = useLocation()
	const { logout } = useAuth()
	const { user } = useSelector((state: RootState) => state.auth);

	const sidebarItems = useMemo(() => {
		if (user?.role === 'root') return SidebarItems;
		return SidebarItems.filter(({ path }) => user?.accessFields?.includes(path.split('/')[1]));
	}, [user]);

	const handleNavigation = (path: string) => {
		navigate(path)
	}

	const isActive = (path: string) => {
		return location.pathname === path
	}

	const logoutBtn = (<Button
		variant="ghost"
		size="sm"
		className="w-12 h-12 p-0 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-200 transition-colors"
		title="Logout"
	>
		<LogOut className="h-10 w-10" />
	</Button>)

	return (
		< div
			className="fixed left-0 top-0 z-40 h-full w-16 bg-white border-r border-gray-200 shadow-sm transition-transform duration-200 ease-in-out lg:translate-x-0 -translate-x-full"
		>
			<div className="flex flex-col h-full">
				{/* Logo section */}
				<div className="flex items-center justify-center h-16 border-b border-gray-200">
					<img
						src="/logo2.svg"
						alt="EMS"
						className="h-12 w-12 object-contain"
					/>
				</div>

				{/* Navigation items */}
				<nav className="flex-1 flex flex-col py-4 space-y-2">
					{sidebarItems.map((item) => {
						const Icon = item.icon
						const active = isActive(item.path)

						return (
							<div key={item.path} className="px-2">
								<Button
									variant="ghost"
									size="sm"
									className={cn(
										"w-12 h-12 p-0 flex items-center justify-center rounded-lg transition-colors",
										active
											? "bg-[#1e3a8a] text-white hover:bg-[#1e40af]"
											: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
									)}
									onClick={() => handleNavigation(item.path)}
									title={item.label}
								>
									<Icon className="size-5 text-current" />
								</Button>
							</div>
						)
					})}
				</nav>

				{/* Logout button */}
				<div className="p-2 border-t border-gray-200">
					<ConfirmDialog
						trigger={logoutBtn}
						title="Confirm Logout"
						description="Are you sure you want to logout?"
						confirmText="Logout"
						cancelText="Cancel"
						onConfirm={logout}
						variant="destructive"
					/>
				</div>
			</div>
		</ div>
	)
}