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
import { dailyPricingApi } from '../data/api'
import {
  type DailyPrice,
  type CreateDailyPriceRequest,
  createDailyPriceSchema
} from '../data/schema'

// --- Helpers ---
const formatVND = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN')

// --- Context ---
type DialogType = 'add' | 'edit' | 'delete'

type DailyPricingContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: DailyPrice | null
  setCurrentRow: React.Dispatch<React.SetStateAction<DailyPrice | null>>
  items: DailyPrice[]
  loading: boolean
  filterStartDate: string
  setFilterStartDate: (date: string) => void
  filterEndDate: string
  setFilterEndDate: (date: string) => void
  refetch: () => Promise<void>
  addItem: (data: CreateDailyPriceRequest) => Promise<void>
  updateItem: (id: number, data: CreateDailyPriceRequest) => Promise<void>
  deleteItem: (id: number) => Promise<void>
}

const DailyPricingContext = React.createContext<DailyPricingContextType | null>(null)

const useDailyPricing = () => {
  const ctx = React.useContext(DailyPricingContext)
  if (!ctx) throw new Error('useDailyPricing must be used within provider')
  return ctx
}

// --- Provider ---
function DailyPricingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<DailyPrice | null>(null)
  const [items, setItems] = useState<DailyPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const data = await dailyPricingApi.list({
        startDate: filterStartDate || undefined,
        endDate: filterEndDate || undefined
      })
      setItems(data || [])
    } catch (error) {
      toast.error('Không thể tải danh sách giá theo ngày.')
      console.error('Failed to fetch daily pricing:', error)
    } finally {
      setLoading(false)
    }
  }, [filterStartDate, filterEndDate])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addItem = async (data: CreateDailyPriceRequest) => {
    const newItem = await dailyPricingApi.create(data)
    setItems((prev) => [newItem, ...prev])
  }

  const updateItem = async (id: number, data: CreateDailyPriceRequest) => {
    const updated = await dailyPricingApi.update(id, data)
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
  }

  const deleteItem = async (id: number) => {
    await dailyPricingApi.delete(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <DailyPricingContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        items,
        loading,
        filterStartDate,
        setFilterStartDate,
        filterEndDate,
        setFilterEndDate,
        refetch: fetchItems,
        addItem,
        updateItem,
        deleteItem
      }}
    >
      {children}
    </DailyPricingContext.Provider>
  )
}

// --- Action Dialog ---
function ActionDialog({
  currentRow,
  open,
  onOpenChange
}: {
  currentRow?: DailyPrice
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { addItem, updateItem } = useDailyPricing()
  const isEdit = !!currentRow
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CreateDailyPriceRequest>({
    resolver: zodResolver(createDailyPriceSchema),
    defaultValues: isEdit
      ? {
          roomTypeId: currentRow.roomTypeId,
          date: currentRow.date,
          price: currentRow.price,
          reason: currentRow.reason ?? ''
        }
      : {
          roomTypeId: 0,
          date: '',
          price: 0,
          reason: ''
        }
  })

  const onSubmit = async (values: CreateDailyPriceRequest) => {
    try {
      setSubmitting(true)
      if (isEdit && currentRow) {
        await updateItem(currentRow.id, values)
        toast.success('Cập nhật giá theo ngày thành công!')
      } else {
        await addItem(values)
        toast.success('Thêm giá theo ngày thành công!')
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(isEdit ? 'Cập nhật giá theo ngày thất bại.' : 'Thêm giá theo ngày thất bại.')
      console.error('Daily pricing form error:', error)
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
          <DialogTitle>{isEdit ? 'Chỉnh sửa giá theo ngày' : 'Thêm giá theo ngày mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin giá theo ngày. ' : 'Nhập thông tin giá theo ngày mới. '}
            Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="daily-price-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              <FormField
                control={form.control}
                name="roomTypeId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Loại phòng (ID)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập ID loại phòng"
                        className="col-span-4"
                        autoComplete="off"
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
                name="date"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Ngày</FormLabel>
                    <FormControl>
                      <Input type="date" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Giá (VND)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập giá"
                        className="col-span-4"
                        autoComplete="off"
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
                name="reason"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Lý do</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Lễ 30/4, Cuối tuần..."
                        className="col-span-4"
                        autoComplete="off"
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
          <Button type="submit" form="daily-price-form" disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- Delete Dialog ---
function DeleteDialog({
  currentRow,
  open,
  onOpenChange
}: {
  currentRow: DailyPrice
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { deleteItem } = useDailyPricing()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteItem(currentRow.id)
      toast.success(`Đã xóa giá ngày ${formatDate(currentRow.date)}.`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Xóa giá theo ngày thất bại.')
      console.error('Delete daily pricing error:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>Xóa giá theo ngày</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa giá ngày{' '}
            <span className="font-semibold">{formatDate(currentRow.date)}</span>
            {currentRow.roomTypeName && ` cho ${currentRow.roomTypeName}`}?
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
function DailyDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDailyPricing()

  return (
    <>
      <ActionDialog key="daily-add" open={open === 'add'} onOpenChange={() => setOpen('add')} />

      {currentRow && (
        <>
          <ActionDialog
            key={`daily-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />

          <DeleteDialog
            key={`daily-delete-${currentRow.id}`}
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

const PAGE_SIZE = 10

function DailyTable() {
  const {
    items,
    loading,
    setOpen,
    setCurrentRow,
    filterStartDate,
    setFilterStartDate,
    filterEndDate,
    setFilterEndDate
  } = useDailyPricing()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = items.filter((item) => {
    const s = search.toLowerCase()
    return (
      (item.roomTypeName ?? '').toLowerCase().includes(s) ||
      (item.reason ?? '').toLowerCase().includes(s)
    )
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  const handleEdit = (item: DailyPrice) => {
    setCurrentRow(item)
    setOpen('edit')
  }

  const handleDelete = (item: DailyPrice) => {
    setCurrentRow(item)
    setOpen('delete')
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
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo loại phòng, lý do..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="w-40"
            placeholder="Từ ngày"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="w-40"
            placeholder="Đến ngày"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Loại phòng</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Lý do</TableHead>
              <TableHead className="w-17">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Không tìm thấy giá theo ngày nào.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.roomTypeName || '—'}</TableCell>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>{formatVND(item.price)}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.reason || '—'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item)}
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
          Hiển thị {filtered.length === 0 ? 0 : startIndex + 1} đến{' '}
          {Math.min(startIndex + PAGE_SIZE, filtered.length)} trong tổng số {filtered.length} mục
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


function PrimaryButton() {
  const { setOpen } = useDailyPricing()
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Thêm Giá Ngày</span> <Plus size={18} />
      </Button>
    </div>
  )
}

export function DailyPricing() {
  return (
    <DailyPricingProvider>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quản lý giá theo ngày</h2>
          </div>
          <PrimaryButton />
        </div>
        <DailyTable />
      </Main>

      <DailyDialogs />
    </DailyPricingProvider>
  )
}
