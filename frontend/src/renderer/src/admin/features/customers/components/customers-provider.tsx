import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import useDialogState from '@/hooks/use-dialog-state'
import { customersApi } from '../data/api'
import type { Customer, CreateCustomerRequest } from '../data/schema'

type CustomersDialogType = 'add' | 'edit' | 'delete' | 'detail'

type CustomersContextType = {
  open: CustomersDialogType | null
  setOpen: (str: CustomersDialogType | null) => void
  currentRow: Customer | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Customer | null>>
  customers: Customer[]
  loading: boolean
  addCustomer: (data: CreateCustomerRequest) => Promise<void>
  updateCustomer: (id: number, data: CreateCustomerRequest) => Promise<void>
  deleteCustomer: (id: number) => Promise<void>
  refreshCustomers: () => Promise<void>
}

const CustomersContext = React.createContext<CustomersContextType | null>(null)

type CustomersProviderProps = {
  children: React.ReactNode
}

export function CustomersProvider({ children }: CustomersProviderProps) {
  const [open, setOpen] = useDialogState<CustomersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const page = await customersApi.list()
      setCustomers(page.content || [])
    } catch (error) {
      toast.error('Không thể tải danh sách khách hàng.')
      console.error('Failed to fetch customers:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const addCustomer = async (data: CreateCustomerRequest) => {
    const newCustomer = await customersApi.create(data)
    setCustomers((prev) => [newCustomer, ...prev])
  }

  const updateCustomer = async (id: number, data: CreateCustomerRequest) => {
    const updated = await customersApi.update(id, data)
    setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)))
  }

  const deleteCustomer = async (id: number) => {
    await customersApi.delete(id)
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <CustomersContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        customers,
        loading,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        refreshCustomers: fetchCustomers
      }}
    >
      {children}
    </CustomersContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCustomers = () => {
  const ctx = React.useContext(CustomersContext)

  if (!ctx) {
    throw new Error('useCustomers has to be used within <CustomersProvider>')
  }

  return ctx
}
