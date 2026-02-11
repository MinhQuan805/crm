import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import useDialogState from '@/hooks/use-dialog-state'
import { roomsApi, roomTypesApi } from '../data/api'
import type {
  Room,
  RoomType,
  RoomStatus,
  CreateRoomRequest,
  BulkCreateRoomRequest
} from '../data/schema'

type RoomsDialogType = 'add' | 'edit' | 'delete' | 'bulk'

type RoomsContextType = {
  open: RoomsDialogType | null
  setOpen: (str: RoomsDialogType | null) => void
  currentRow: Room | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Room | null>>
  rooms: Room[]
  roomTypes: RoomType[]
  loading: boolean
  statusFilter: RoomStatus | ''
  setStatusFilter: React.Dispatch<React.SetStateAction<RoomStatus | ''>>
  addRoom: (data: CreateRoomRequest) => Promise<void>
  bulkCreateRooms: (data: BulkCreateRoomRequest) => Promise<void>
  updateRoom: (id: number, data: CreateRoomRequest) => Promise<void>
  deleteRoom: (id: number) => Promise<void>
  updateRoomStatus: (id: number, status: RoomStatus) => Promise<void>
  refreshRooms: () => Promise<void>
  refreshRoomTypes: () => Promise<void>
}

const RoomsContext = React.createContext<RoomsContextType | null>(null)

type RoomsProviderProps = {
  children: React.ReactNode
}

export function RoomsProvider({ children }: RoomsProviderProps) {
  const [open, setOpen] = useDialogState<RoomsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Room | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<RoomStatus | ''>('')

  const fetchRoomTypes = useCallback(async () => {
    try {
      const data = await roomTypesApi.list()
      setRoomTypes(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error('Không thể tải danh sách loại phòng.')
      console.error('Failed to fetch room types:', error)
    }
  }, [])

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true)
      const params: { status?: RoomStatus } = {}
      if (statusFilter) params.status = statusFilter
      const data = await roomsApi.list(params)
      setRooms(data.content || [])
    } catch (error) {
      toast.error('Không thể tải danh sách phòng.')
      console.error('Failed to fetch rooms:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchRoomTypes()
  }, [fetchRoomTypes])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const addRoom = async (data: CreateRoomRequest) => {
    const newRoom = await roomsApi.create(data)
    setRooms((prev) => [newRoom, ...prev])
  }

  const bulkCreateRooms = async (data: BulkCreateRoomRequest) => {
    const newRooms = await roomsApi.bulkCreate(data)
    setRooms((prev) => [...newRooms, ...prev])
  }

  const updateRoom = async (id: number, data: CreateRoomRequest) => {
    const updated = await roomsApi.update(id, data)
    setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)))
  }

  const deleteRoom = async (id: number) => {
    await roomsApi.delete(id)
    setRooms((prev) => prev.filter((r) => r.id !== id))
  }

  const updateRoomStatus = async (id: number, status: RoomStatus) => {
    const updated = await roomsApi.updateStatus(id, status)
    setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)))
  }

  return (
    <RoomsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        rooms,
        roomTypes,
        loading,
        statusFilter,
        setStatusFilter,
        addRoom,
        bulkCreateRooms,
        updateRoom,
        deleteRoom,
        updateRoomStatus,
        refreshRooms: fetchRooms,
        refreshRoomTypes: fetchRoomTypes
      }}
    >
      {children}
    </RoomsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRooms = () => {
  const roomsContext = React.useContext(RoomsContext)

  if (!roomsContext) {
    throw new Error('useRooms has to be used within <RoomsProvider>')
  }

  return roomsContext
}
