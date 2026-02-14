import React, { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Main } from '@/admin/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { roomTypesApi } from '../data/api'
import { type RoomType, type CreateRoomTypeRequest, createRoomTypeSchema } from '../data/schema'

type RoomTypesDialogType = 'add' | 'edit' | 'delete'

type RoomTypesContextType = {
  open: RoomTypesDialogType | null
  setOpen: (str: RoomTypesDialogType | null) => void
  currentRow: RoomType | null
  setCurrentRow: React.Dispatch<React.SetStateAction<RoomType | null>>
  roomTypes: RoomType[]
  loading: boolean
  addRoomType: (data: CreateRoomTypeRequest) => Promise<void>
  updateRoomType: (id: number, data: CreateRoomTypeRequest) => Promise<void>
  deleteRoomType: (id: number) => Promise<void>
}

const RoomTypesContext = React.createContext<RoomTypesContextType | null>(null)

const useRoomTypes = () => {
  const ctx = React.useContext(RoomTypesContext)
  if (!ctx) throw new Error('useRoomTypes must be used within RoomTypesProvider')
  return ctx
}

function RoomTypesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<RoomTypesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<RoomType | null>(null)
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRoomTypes = useCallback(async () => {
    try {
      setLoading(true)
      const data = await roomTypesApi.list()
      setRoomTypes(data || [])
    } catch (error) {
      toast.error('Không thể tải danh sách loại phòng.')
      console.error('Failed to fetch room types:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoomTypes()
  }, [fetchRoomTypes])

  const addRoomType = async (data: CreateRoomTypeRequest) => {
    const newRoomType = await roomTypesApi.create(data)
    setRoomTypes((prev) => [newRoomType, ...prev])
  }

  const updateRoomType = async (id: number, data: CreateRoomTypeRequest) => {
    const updated = await roomTypesApi.update(id, data)
    setRoomTypes((prev) => prev.map((rt) => (rt.id === id ? updated : rt)))
  }

  const deleteRoomType = async (id: number) => {
    await roomTypesApi.delete(id)
    setRoomTypes((prev) => prev.filter((rt) => rt.id !== id))
  }

  return (
    <RoomTypesContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        roomTypes,
        loading,
        addRoomType,
        updateRoomType,
        deleteRoomType
      }}
    >
      {children}
    </RoomTypesContext.Provider>
  )
}

function RoomTypesActionDialog({
  currentRow,
  open,
  onOpenChange
}: {
  currentRow?: RoomType
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { addRoomType, updateRoomType } = useRoomTypes()
  const isEdit = !!currentRow
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CreateRoomTypeRequest>({
    resolver: zodResolver(createRoomTypeSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          description: currentRow.description ?? '',
          capacity: currentRow.capacity,
          basePrice: currentRow.basePrice,
          images: currentRow.images ?? [],
          amenities: currentRow.amenities ?? []
        }
      : {
          name: '',
          description: '',
          capacity: 1,
          basePrice: 0,
          images: [],
          amenities: []
        }
  })

  const onSubmit = async (values: CreateRoomTypeRequest) => {
    try {
      setSubmitting(true)
      if (isEdit && currentRow) {
        await updateRoomType(currentRow.id, values)
        toast.success('Cập nhật loại phòng thành công!')
      } else {
        await addRoomType(values)
        toast.success('Thêm loại phòng thành công!')
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(isEdit ? 'Cập nhật loại phòng thất bại.' : 'Thêm loại phòng thất bại.')
      console.error('Room type form error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{isEdit ? 'Chỉnh sửa loại phòng' : 'Thêm loại phòng mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin loại phòng. ' : 'Nhập thông tin loại phòng mới. '}
            Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="room-type-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Tên loại phòng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Phòng Đơn, Phòng Đôi..."
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Sức chứa</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="VD: 2"
                        className="col-span-4"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Giá cơ bản</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="VD: 500000"
                        className="col-span-4"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 pt-3 text-end">Mô tả</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Nhập mô tả loại phòng"
                        className="col-span-4 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" form="room-type-form" disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RoomTypesDeleteDialog({
  currentRow,
  open,
  onOpenChange
}: {
  currentRow: RoomType
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { deleteRoomType } = useRoomTypes()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteRoomType(currentRow.id)
      toast.success(`Đã xóa loại phòng "${currentRow.name}".`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Xóa loại phòng thất bại.')
      console.error('Delete room type error:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>Xóa loại phòng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa loại phòng{' '}
            <span className="font-semibold">{currentRow.name}</span>?
            <br />
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- Dialogs Container ---
function RoomTypesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRoomTypes()

  return (
    <>
      <RoomTypesActionDialog
        key="room-type-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <RoomTypesActionDialog
            key={`room-type-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />

          <RoomTypesDeleteDialog
            key={`room-type-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}

const ROOM_TYPE_PAGE_SIZE = 10

function RoomTypesTable() {
  const { roomTypes, loading, setOpen, setCurrentRow } = useRoomTypes()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRoomTypes = roomTypes.filter((rt) => {
    const s = search.toLowerCase()
    return rt.name.toLowerCase().includes(s) || (rt.description ?? '').toLowerCase().includes(s)
  })

  const totalPages = Math.ceil(filteredRoomTypes.length / ROOM_TYPE_PAGE_SIZE)
  const startIndex = (currentPage - 1) * ROOM_TYPE_PAGE_SIZE
  const paginatedRoomTypes = filteredRoomTypes.slice(startIndex, startIndex + ROOM_TYPE_PAGE_SIZE)

  const handleEdit = (roomType: RoomType) => {
    setCurrentRow(roomType)
    setOpen('edit')
  }

  const handleDelete = (roomType: RoomType) => {
    setCurrentRow(roomType)
    setOpen('delete')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm loại phòng..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-8"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Tên loại phòng</TableHead>
              <TableHead>Sức chứa</TableHead>
              <TableHead>Giá cơ bản</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-17">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRoomTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không tìm thấy loại phòng nào.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRoomTypes.map((roomType) => (
                <TableRow key={roomType.id}>
                  <TableCell className="font-medium">{roomType.name}</TableCell>
                  <TableCell>{roomType.capacity} người</TableCell>
                  <TableCell>{formatPrice(roomType.basePrice)}</TableCell>
                  <TableCell className="max-w-xs truncate">{roomType.description || '—'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(roomType)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(roomType)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Hiển thị {filteredRoomTypes.length === 0 ? 0 : startIndex + 1} đến{' '}
          {Math.min(startIndex + ROOM_TYPE_PAGE_SIZE, filteredRoomTypes.length)} trong tổng số{' '}
          {filteredRoomTypes.length} loại phòng
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Trước
          </Button>
          <div className="text-sm font-medium">
            Trang {currentPage} / {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function RoomTypesPrimaryButton() {
  const { setOpen } = useRoomTypes()
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Thêm Loại Phòng</span> <Plus size={18} />
      </Button>
    </div>
  )
}

export function RoomTypes() {
  return (
    <RoomTypesProvider>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quản lý Loại Phòng</h2>
          </div>
          <RoomTypesPrimaryButton />
        </div>
        <RoomTypesTable />
      </Main>

      <RoomTypesDialogs />
    </RoomTypesProvider>
  )
}
