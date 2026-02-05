import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { LayoutProvider } from '@/context/layout-provider'
import { ProtectedRoute, PublicRoute } from '@/components/protected-route'
import { SignIn, SignUp } from '@/features/auth'
import { AdminApp } from '@/admin'
import { ClientApp } from '@/client'

function AppRouter(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Auth Pages */}
        <Route
          path="/sign-in"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminApp />
            </ProtectedRoute>
          }
        />

        {/* Protected Client Routes */}
        <Route
          path="/client/*"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientApp />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/sign-in" replace />} />

        {/* Catch all - redirect to sign-in */}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function App(): React.JSX.Element {
  return (
    <LayoutProvider>
      <AppRouter />
      <Toaster position="top-right" richColors closeButton />
    </LayoutProvider>
  )
}

export default App
