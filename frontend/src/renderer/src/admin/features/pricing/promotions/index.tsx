import React, { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Header, Main, TopNav } from '@/admin/components/layout'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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
import { promotionsApi } from '../data/api'
import { type Promotion, type CreatePromotionRequest, createPromotionSchema } from '../data/schema'

// --- Helpers ---
const formatVND = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const formatDate = (date: string) => new Date(date).toLocaleDateString('vi-VN')

// --- Context ---
type DialogType = 'add' | 'edit' | 'delete'

type PromotionsContextType = {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: Promotion | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Promotion | null>>
  items: Promotion[]
  loading: boolean
  addItem: (data: CreatePromotionRequest) => Promise<void>
  updateItem: (id: number, data: CreatePromotionRequest) => Promise<void>
  deleteItem: (id: number) => Promise<void>
}

const PromotionsContext = React.createContext<PromotionsContextType | null>(null)

const usePromotions = () => {
  const ctx = React.useContext(PromotionsContext)
  if (!ctx) throw new Error('usePromotions must be used within provider')
  return ctx
}

// --- Provider ---
function PromotionsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<Promotion | null>(null)
  const [items, setItems] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const data = await promotionsApi.list()
      setItems(data || [])
    } catch (error) {
      toast.error('Không thể tải danh sách khuyến mãi.')
      console.error('Failed to fetch promotions:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const addItem = async (data: CreatePromotionRequest) => {
    const newItem = await promotionsApi.create(data)
    setItems((prev) => [newItem, ...prev])
  }

  const updateItem = async (id: number, data: CreatePromotionRequest) => {
    const updated = await promotionsApi.update(id, data)
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
  }

  const deleteItem = async (id: number) => {
    await promotionsApi.delete(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <PromotionsContext.Provider
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
    </PromotionsContext.Provider>
  )
}

// --- Action Dialog ---
function ActionDialog({
  currentRow,
  open,
  onOpenChange
}: {
  currentRow?: Promotion
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { addItem, updateItem } = usePromotions()
  const isEdit = !!currentRow
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CreatePromotionRequest>({
    resolver: zodResolver(createPromotionSchema),
    defaultValues: isEdit
      ? {
          code: currentRow.code,
          description: currentRow.description ?? '',
          discountType: currentRow.discountType,
          discountValue: currentRow.discountValue,
          startDate: currentRow.startDate,
          endDate: currentRow.endDate,
          minNights: currentRow.minNights ?? 0,
          maxUses: currentRow.maxUses ?? 0,
          isActive: currentRow.isActive
        }
      : {
          code: '',
          description: '',
          discountType: 'PERCENTAGE' as const,
          discountValue: 0,
          startDate: '',
          endDate: '',
          minNights: 0,
          maxUses: 0,
          isActive: true
        }
  })

  const onSubmit = async (values: CreatePromotionRequest) => {
    try {
      setSubmitting(true)
      if (isEdit && currentRow) {
        await updateItem(currentRow.id, values)
        toast.success('Cập nhật khuyến mãi thành công!')
      } else {
        await addItem(values)
        toast.success('Thêm khuyến mãi thành công!')
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(isEdit ? 'Cập nhật khuyến mãi thất bại.' : 'Thêm khuyến mãi thất bại.')
      console.error('Promotion form error:', error)
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
          <DialogTitle>{isEdit ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin khuyến mãi. ' : 'Nhập thông tin khuyến mãi mới. '}
            Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="promotion-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Mã khuyến mãi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: SUMMER2026"
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
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Mô tả</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mô tả khuyến mãi"
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
                name="discountType"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Loại giảm giá</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="col-span-4">
                          <SelectValue placeholder="Chọn loại giảm giá" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                        <SelectItem value="FIXED">Cố định (VND)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountValue"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Giá trị giảm</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="VD: 10 hoặc 50000"
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
                name="minNights"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Số đêm tối thiểu</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="VD: 2"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxUses"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Số lần sử dụng tối đa</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="VD: 100"
                        className="col-span-4"
                        autoComplete="off"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Trạng thái</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(val === 'true')}
                      defaultValue={String(field.value)}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-4">
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Đang hoạt động</SelectItem>
                        <SelectItem value="false">Ngừng hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
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
          <Button type="submit" form="promotion-form" disabled={submitting}>
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
  currentRow: Promotion
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { deleteItem } = usePromotions()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteItem(currentRow.id)
      toast.success(`Đã xóa khuyến mãi "${currentRow.code}".`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Xóa khuyến mãi thất bại.')
      console.error('Delete promotion error:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>Xóa khuyến mãi</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa khuyến mãi{' '}
            <span className="font-semibold">{currentRow.code}</span>?
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
function PromotionDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePromotions()

  return (
    <>
      <ActionDialog key="promotion-add" open={open === 'add'} onOpenChange={() => setOpen('add')} />

      {currentRow && (
        <>
          <ActionDialog
            key={`promotion-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            currentRow={currentRow}
          />

          <DeleteDialog
            key={`promotion-delete-${currentRow.id}`}
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

function PromotionsTable() {
  const { items, loading, setOpen, setCurrentRow } = usePromotions()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = items.filter((item) => {
    const s = search.toLowerCase()
    return item.code.toLowerCase().includes(s) || (item.description ?? '').toLowerCase().includes(s)
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  const handleEdit = (item: Promotion) => {
    setCurrentRow(item)
    setOpen('edit')
  }

  const handleDelete = (item: Promotion) => {
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
            placeholder="Tìm kiếm theo mã, mô tả..."
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
              <TableHead>Mã</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Loại giảm</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>Bắt đầu</TableHead>
              <TableHead>Kết thúc</TableHead>
              <TableHead>Đã dùng / Tối đa</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-17">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Không tìm thấy khuyến mãi nào.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium font-mono">{item.code}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {item.description || '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.discountType === 'PERCENTAGE' ? 'default' : 'secondary'}>
                      {item.discountType === 'PERCENTAGE' ? 'Phần trăm' : 'Cố định'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.discountType === 'PERCENTAGE'
                      ? `${item.discountValue}%`
                      : formatVND(item.discountValue)}
                  </TableCell>
                  <TableCell>{formatDate(item.startDate)}</TableCell>
                  <TableCell>{formatDate(item.endDate)}</TableCell>
                  <TableCell>
                    {item.usedCount} / {item.maxUses ?? '∞'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? 'default' : 'outline'}>
                      {item.isActive ? 'Hoạt động' : 'Ngừng'}
                    </Badge>
                  </TableCell>
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

// --- Top Nav ---
const topNav = [
  { title: 'Overview', href: '/', isActive: false },
  { title: 'Khuyến Mãi', href: '/pricing/promotions', isActive: true }
]

// --- Primary Button ---
function PrimaryButton() {
  const { setOpen } = usePromotions()
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen('add')}>
        <span>Thêm Khuyến Mãi</span> <Plus size={18} />
      </Button>
    </div>
  )
}

// --- Main Page ---
export function Promotions() {
  return (
    <PromotionsProvider>
      <Header>
        <TopNav links={topNav} />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quản lý khuyến mãi</h2>
            <p className="text-muted-foreground">Tạo và quản lý mã khuyến mãi cho khách hàng.</p>
          </div>
          <PrimaryButton />
        </div>
        <PromotionsTable />
      </Main>

      <PromotionDialogs />
    </PromotionsProvider>
  )
}
