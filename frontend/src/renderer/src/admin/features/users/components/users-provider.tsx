import React, { useEffect, useState, useCallback } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type User, type CreateUserRequest, type UpdateUserRequest } from '../data/schema'
import { toast } from 'sonner'
import { usersApi } from '../data/api'

type UsersDialogType = 'add' | 'edit' | 'delete'

type UsersContextType = {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  loading: boolean
  addUser: (data: CreateUserRequest) => Promise<void>
  updateUser: (id: number, data: UpdateUserRequest) => Promise<void>
  deleteUser: (id: number) => Promise<void>
  refreshUsers: () => Promise<void>
}

const UsersContext = React.createContext<UsersContextType | null>(null)

type UsersProviderProps = {
  children: React.ReactNode
}

export function UsersProvider({ children }: UsersProviderProps) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await usersApi.list()
      setUsers(data.content || [])
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng.')
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const addUser = async (data: CreateUserRequest) => {
    const newUser = await usersApi.create(data)
    setUsers((prev) => [newUser, ...prev])
  }

  const updateUser = async (id: number, data: UpdateUserRequest) => {
    const updated = await usersApi.update(id, data)
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)))
  }

  const deleteUser = async (id: number) => {
    await usersApi.delete(id)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <UsersContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        users,
        setUsers,
        loading,
        addUser,
        updateUser,
        deleteUser,
        refreshUsers: fetchUsers
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersProvider>')
  }

  return usersContext
}
