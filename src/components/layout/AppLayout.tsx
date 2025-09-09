import Sidebar from '@/components/layout/Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-[100vh] w-[100vw] flex flex-col bg-gray-50 overflow-hidden">
      <Sidebar />

      {/* Main content area - adjusted for sidebar */}
      <main className="flex-1 min-h-0 ml-16">
        {children}
      </main>
    </div>
  )
}