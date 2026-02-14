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
import { seasonalPricingApi } from '../data/api'
import {
  type SeasonalPrice,
  type CreateSeasonalPriceRequest,
  createSeasonalPriceSchema
} from '../data/schema'

// --- Context ---
type DialogType = 'add' | 'edit' | 'delete'

type SeasonalPricingContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: SeasonalPrice | null
  setCurrentRow: React.Dispatch<React.SetStateAction<SeasonalPrice | null>>
  items: SeasonalPrice[]
  loading: boolean
  addItem: (data: CreateSeasonalPriceRequest) => Promise<void>
  updateItem: (id: number, data: CreateSeasonalPriceRequest) => Promise<void>
  deleteItem: (id: number) => Promise<void>
}

const SeasonalPricingContext = React.createContext<SeasonalPricingContextType | null>(null)

const useSeasonalPricing = () => {
  const ctx = React.useContext(SeasonalPricingContext)
  if (!ctx) throw new Error('useSeasonalPricing must be used within provider')
  return ctx
}

// --- Provider ---
function SeasonalPricingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<SeasonalPrice | null>(null)
  const [items, setItems] = useState<SeasonalPrice[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const data = await seasonalPricingApi.list()
      setItems(data)
    } catch (error) {
      toast.error('Không thể tải danh sách giá theo mùa.')
      console.error('Failed to fetch seasonal pricing:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addItem = async (data: CreateSeasonalPriceRequest) => {
    const newItem = await seasonalPricingApi.create(data)
    setItems((prev) => [newItem, ...prev])
  }

  const updateItem = async (id: number, data: CreateSeasonalPriceRequest) => {
    const updated = await seasonalPricingApi.update(id, data)
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
  }

  const deleteItem = async (id: number) => {
    await seasonalPricingApi.delete(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <SeasonalPricingContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        items,
        loading,
        addItem,
        updateItem,
        deleteItem
      }}
    >
      {children}
    </SeasonalPricingContext.Provider>
  )
}

// --- Action Dialog ---
function ActionDialog({
  currentRow,
  open,
  onOpenChange
}: {
  currentRow?: SeasonalPrice
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { addItem, updateItem } = useSeasonalPricing()
  const isEdit = !!currentRow
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CreateSeasonalPriceRequest>({
    resolver: zodResolver(createSeasonalPriceSchema),
    defaultValues: isEdit
      ? {
          roomTypeId: currentRow.roomTypeId,
          name: currentRow.name,
          startDate: currentRow.startDate,
          endDate: currentRow.endDate,
          priceMultiplier: currentRow.priceMultiplier,
          priority: currentRow.priority
        }
      : {
          roomTypeId: 0,
          name: '',
          startDate: '',
          endDate: '',
          priceMultiplier: 1,
          priority: 0
        }
  })

  const onSubmit = async (values: CreateSeasonalPriceRequest) => {
    try {
      setSubmitting(true)
      if (isEdit && currentRow) {
        await updateItem(currentRow.id, values)
        toast.success('Cập nhật giá theo mùa thành công!')
      } else {
        await addItem(values)
        toast.success('Thêm giá theo mùa thành công!')
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(isEdit ? 'Cập nhật giá theo mùa thất bại.' : 'Thêm giá theo mùa thất bại.')
      console.error('Seasonal pricing form error:', error)
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
          <DialogTitle>{isEdit ? 'Chỉnh sửa giá theo mùa' : 'Thêm giá theo mùa mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin giá theo mùa. ' : 'Nhập thông tin giá theo mùa mới. '}
            Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="seasonal-price-form"
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
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Tên mùa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: Mùa hè, Tết Nguyên Đán..."
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
                name="startDate"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <Input type="date" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Ngày kết thúc</FormLabel>
                    <FormControl>
                      <Input type="date" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceMultiplier"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Hệ số giá</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="VD: 1.5"
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
                name="priority"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Độ ưu tiên</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="VD: 1"
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
            </form>
          </Form>
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" form="seasonal-price-form" disabled={submitting}>
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
  currentRow: SeasonalPrice
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { deleteItem } = useSeasonalPricing()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteItem(currentRow.id)
      toast.success(`Đã xóa giá theo mùa "${currentRow.name}".`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Xóa giá theo mùa thất bại.')
      console.error('Delete seasonal pricing error:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>Xóa giá theo mùa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa giá theo mùa{' '}
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
function SeasonalDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSeasonalPricing()

  return (
    <>
      <ActionDialog key="seasonal-add" open={open === 'add'} onOpenChange={() => setOpen('add')} />

      {currentRow && (
        <>
          <ActionDialog
            key={`seasonal-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />

          <DeleteDialog
            key={`seasonal-delete-${currentRow.id}`}
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

// --- Table ---
const PAGE_SIZE = 10

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('vi-VN')
}

function SeasonalTable() {
  const { items, loading, setOpen, setCurrentRow } = useSeasonalPricing()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = items.filter((item) => {
    const s = search.toLowerCase()
    return (
      item.name.toLowerCase().includes(s) || (item.roomTypeName ?? '').toLowerCase().includes(s)
    )
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  const handleEdit = (item: SeasonalPrice) => {
    setCurrentRow(item)
    setOpen('edit')
  }

  const handleDelete = (item: SeasonalPrice) => {
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
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên mùa, loại phòng..."
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
              <TableHead>Tên mùa</TableHead>
              <TableHead>Loại phòng</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>Hệ số giá</TableHead>
              <TableHead>Độ ưu tiên</TableHead>
              <TableHead className="w-17">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Không tìm thấy giá theo mùa nào.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.roomTypeName || '—'}</TableCell>
                  <TableCell>{formatDate(item.startDate)}</TableCell>
                  <TableCell>{formatDate(item.endDate)}</TableCell>
                  <TableCell>x{item.priceMultiplier}</TableCell>
                  <TableCell>{item.priority}</TableCell>
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


// --- Primary Button ---
function PrimaryButton() {
  const { setOpen } = useSeasonalPricing()
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Thêm Giá Mùa</span> <Plus size={18} />
      </Button>
    </div>
  )
}

// --- Main Page ---
export function SeasonalPricing() {
  return (
    <SeasonalPricingProvider>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quản lý giá theo mùa</h2>
          </div>
          <PrimaryButton />
        </div>
        <SeasonalTable />
      </Main>

      <SeasonalDialogs />
    </SeasonalPricingProvider>
  )
}
