import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { useSetResource } from './hooks/use-set-resource'
import { Toaster } from './components/ui/sonner';
import { useCurrentUser } from './hooks/useAuth';

function App() {
  useSetResource();
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      </div>
    )
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position='bottom-right' />
    </>
  )
}

export default App
