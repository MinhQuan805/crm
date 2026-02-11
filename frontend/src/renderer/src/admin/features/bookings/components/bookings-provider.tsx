import React, { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'
import useDialogState from '@/hooks/use-dialog-state'
import { bookingsApi } from '../data/api'
import type { Booking, BookingStatus, CreateBookingRequest } from '../data/schema'

type BookingsDialogType = 'add' | 'edit' | 'delete' | 'detail'

type BookingsContextType = {
  open: BookingsDialogType | null
  setOpen: (str: BookingsDialogType | null) => void
  currentRow: Booking | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Booking | null>>
  bookings: Booking[]
  loading: boolean
  statusFilter: BookingStatus | ''
  setStatusFilter: React.Dispatch<React.SetStateAction<BookingStatus | ''>>
  addBooking: (data: CreateBookingRequest) => Promise<void>
  updateBooking: (id: number, data: CreateBookingRequest) => Promise<void>
  deleteBooking: (id: number) => Promise<void>
  confirmBooking: (id: number) => Promise<void>
  checkInBooking: (id: number) => Promise<void>
  checkOutBooking: (id: number) => Promise<void>
  cancelBooking: (id: number) => Promise<void>
  refreshBookings: () => Promise<void>
}

const BookingsContext = React.createContext<BookingsContextType | null>(null)

type BookingsProviderProps = {
  children: React.ReactNode
}

export function BookingsProvider({ children }: BookingsProviderProps) {
  const [open, setOpen] = useDialogState<BookingsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Booking | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('')

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      const params: { status?: BookingStatus } = {}
      if (statusFilter) params.status = statusFilter
      const data = await bookingsApi.list(params)
      setBookings(data.content || [])
    } catch (error) {
      toast.error('Không thể tải danh sách đặt phòng.')
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const addBooking = async (data: CreateBookingRequest) => {
    const newBooking = await bookingsApi.create(data)
    setBookings((prev) => [newBooking, ...prev])
  }

  const updateBooking = async (id: number, data: CreateBookingRequest) => {
    const updated = await bookingsApi.update(id, data)
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
  }

  const deleteBooking = async (id: number) => {
    await bookingsApi.delete(id)
    setBookings((prev) => prev.filter((b) => b.id !== id))
  }

  const confirmBooking = async (id: number) => {
    const updated = await bookingsApi.confirm(id)
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
    toast.success('Đã xác nhận đặt phòng.')
  }

  const checkInBooking = async (id: number) => {
    const updated = await bookingsApi.checkIn(id)
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
    toast.success('Đã check-in.')
  }

  const checkOutBooking = async (id: number) => {
    const updated = await bookingsApi.checkOut(id)
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
    toast.success('Đã check-out.')
  }

  const cancelBooking = async (id: number) => {
    const updated = await bookingsApi.cancel(id)
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
    toast.success('Đã hủy đặt phòng.')
  }

  return (
    <BookingsContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        bookings,
        loading,
        statusFilter,
        setStatusFilter,
        addBooking,
        updateBooking,
        deleteBooking,
        confirmBooking,
        checkInBooking,
        checkOutBooking,
        cancelBooking,
        refreshBookings: fetchBookings
      }}
    >
      {children}
    </BookingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBookings = () => {
  const bookingsContext = React.useContext(BookingsContext)

  if (!bookingsContext) {
    throw new Error('useBookings has to be used within <BookingsProvider>')
  }

  return bookingsContext
}
