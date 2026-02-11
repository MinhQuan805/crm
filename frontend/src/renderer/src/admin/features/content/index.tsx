import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { MoreHorizontal } from 'lucide-react'
import { Header, Main, TopNav } from '@/admin/components/layout'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Policy, PolicyType, CreatePolicyRequest } from './data/schema'
import { createPolicySchema } from './data/schema'
import { policiesApi } from './data/api'

// ─── Constants ───────────────────────────────────────────────

const topNav = [
  { title: 'Overview', href: '/', isActive: false },
  { title: 'Nội Dung', href: '/content', isActive: true }
]

const POLICY_TYPE_LABELS: Record<PolicyType, string> = {
  CANCELLATION: 'Hủy Phòng',
  TERMS: 'Điều Khoản',
  PRIVACY: 'Quyền Riêng Tư',
  CHECKIN_CHECKOUT: 'Check-in/out'
}

const POLICY_TYPE_COLORS: Record<PolicyType, string> = {
  CANCELLATION: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  TERMS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  PRIVACY: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  CHECKIN_CHECKOUT: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
}

// ─── Context ─────────────────────────────────────────────────

type ContentContextValue = {
  policies: Policy[]
  loading: boolean
  fetchPolicies: () => Promise<void>
  addPolicy: (data: CreatePolicyRequest) => Promise<void>
  updatePolicy: (id: number, data: CreatePolicyRequest) => Promise<void>
  removePolicy: (id: number) => Promise<void>
  publishPolicy: (id: number) => Promise<void>
}

const ContentContext = createContext<ContentContextValue | null>(null)

function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}

function ContentProvider({ children }: { children: React.ReactNode }) {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPolicies = useCallback(async () => {
    try {
      setLoading(true)
      const data = await policiesApi.list()
      setPolicies(data)
    } catch (error) {
      toast.error('Không thể tải danh sách chính sách.')
      console.error('Fetch policies error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPolicies()
  }, [fetchPolicies])

  const addPolicy = useCallback(async (data: CreatePolicyRequest) => {
    const created = await policiesApi.create(data)
    setPolicies((prev) => [...prev, created])
  }, [])

  const updatePolicy = useCallback(async (id: number, data: CreatePolicyRequest) => {
    const updated = await policiesApi.update(id, data)
    setPolicies((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }, [])

  const removePolicy = useCallback(async (id: number) => {
    await policiesApi.delete(id)
    setPolicies((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const publishPolicy = useCallback(async (id: number) => {
    const updated = await policiesApi.publish(id)
    setPolicies((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }, [])

  return (
    <ContentContext.Provider
      value={{
        policies,
        loading,
        fetchPolicies,
        addPolicy,
        updatePolicy,
        removePolicy,
        publishPolicy
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}

// ─── Action Dialog (Add / Edit) ──────────────────────────────

type ActionDialogProps = {
  currentRow?: Policy
  open: boolean
  onOpenChange: (open: boolean) => void
}

function PolicyActionDialog({ currentRow, open, onOpenChange }: ActionDialogProps) {
  const { addPolicy, updatePolicy } = useContent()
  const isEdit = !!currentRow
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<CreatePolicyRequest>({
    resolver: zodResolver(createPolicySchema),
    defaultValues: isEdit
      ? {
          type: currentRow.type,
          title: currentRow.title,
          content: currentRow.content,
          language: currentRow.language
        }
      : {
          type: 'CANCELLATION',
          title: '',
          content: '',
          language: 'vi'
        }
  })

  // Reset form when dialog opens with different row
  useEffect(() => {
    if (open) {
      form.reset(
        isEdit
          ? {
              type: currentRow.type,
              title: currentRow.title,
              content: currentRow.content,
              language: currentRow.language
            }
          : {
              type: 'CANCELLATION',
              title: '',
              content: '',
              language: 'vi'
            }
      )
    }
  }, [open, currentRow, isEdit, form])

  const onSubmit = async (values: CreatePolicyRequest) => {
    try {
      setSubmitting(true)
      if (isEdit && currentRow) {
        await updatePolicy(currentRow.id, values)
        toast.success('Cập nhật chính sách thành công!')
      } else {
        await addPolicy(values)
        toast.success('Thêm chính sách thành công!')
      }
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(isEdit ? 'Cập nhật chính sách thất bại.' : 'Thêm chính sách thất bại.')
      console.error('Policy form error:', error)
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
          <DialogTitle>{isEdit ? 'Sửa chính sách' : 'Thêm chính sách mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin chính sách. ' : 'Nhập thông tin chính sách mới. '}
            Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-1 pe-3">
          <Form {...form}>
            <form
              id="policy-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-0.5"
            >
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Loại</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="col-span-4">
                          <SelectValue placeholder="Chọn loại chính sách" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CANCELLATION">Hủy Phòng</SelectItem>
                        <SelectItem value="TERMS">Điều Khoản</SelectItem>
                        <SelectItem value="PRIVACY">Quyền Riêng Tư</SelectItem>
                        <SelectItem value="CHECKIN_CHECKOUT">Check-in/out</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Tiêu đề</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 pt-3 text-end">Nội dung</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung chính sách"
                        className="col-span-4 min-h-[120px]"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                    <FormLabel className="col-span-2 text-end">Ngôn ngữ</FormLabel>
                    <FormControl>
                      <Input placeholder="VD: vi" className="col-span-4" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-4 col-start-3" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Hủy
          </Button>
          <Button type="submit" form="policy-form" disabled={submitting}>
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Delete Dialog ───────────────────────────────────────────

type DeleteDialogProps = {
  policy: Policy | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function PolicyDeleteDialog({ policy, open, onOpenChange }: DeleteDialogProps) {
  const { removePolicy } = useContent()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!policy) return
    try {
      setDeleting(true)
      await removePolicy(policy.id)
      toast.success('Xóa chính sách thành công!')
      onOpenChange(false)
    } catch (error) {
      toast.error('Xóa chính sách thất bại.')
      console.error('Delete policy error:', error)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>Xóa chính sách</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa chính sách{' '}
            <span className="font-semibold">{policy?.title}</span> không? Hành động này không thể
            hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
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

// ─── Policy Table ────────────────────────────────────────────

function PoliciesTable({ policies }: { policies: Policy[] }) {
  const { publishPolicy } = useContent()
  const [actionRow, setActionRow] = useState<Policy | undefined>(undefined)
  const [actionOpen, setActionOpen] = useState(false)
  const [deleteRow, setDeleteRow] = useState<Policy | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handlePublish = async (policy: Policy) => {
    try {
      await publishPolicy(policy.id)
      toast.success('Đã xuất bản phiên bản mới')
    } catch (error) {
      toast.error('Xuất bản thất bại.')
      console.error('Publish policy error:', error)
    }
  }

  if (policies.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        Không có chính sách nào.
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Ngôn ngữ</TableHead>
              <TableHead>Phiên bản</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Cập nhật</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.title}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${POLICY_TYPE_COLORS[policy.type]}`}
                  >
                    {POLICY_TYPE_LABELS[policy.type]}
                  </span>
                </TableCell>
                <TableCell>{policy.language}</TableCell>
                <TableCell>v{policy.version}</TableCell>
                <TableCell>
                  <Badge variant={policy.isActive ? 'default' : 'secondary'}>
                    {policy.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {policy.updatedAt ? new Date(policy.updatedAt).toLocaleDateString('vi-VN') : '—'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mở menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setActionRow(policy)
                          setActionOpen(true)
                        }}
                      >
                        Sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePublish(policy)}>
                        Xuất bản
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          setDeleteRow(policy)
                          setDeleteOpen(true)
                        }}
                      >
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PolicyActionDialog
        currentRow={actionRow}
        open={actionOpen}
        onOpenChange={(state) => {
          setActionOpen(state)
          if (!state) setActionRow(undefined)
        }}
      />

      <PolicyDeleteDialog
        policy={deleteRow}
        open={deleteOpen}
        onOpenChange={(state) => {
          setDeleteOpen(state)
          if (!state) setDeleteRow(null)
        }}
      />
    </>
  )
}

// ─── Main Page ───────────────────────────────────────────────

export function Content() {
  return (
    <ContentProvider>
      <ContentPage />
    </ContentProvider>
  )
}

function ContentPage() {
  const { policies, loading } = useContent()
  const [addOpen, setAddOpen] = useState(false)

  const filterByType = (type?: PolicyType) =>
    type ? policies.filter((p) => p.type === type) : policies

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quản lý Nội Dung</h2>
          </div>
          <Button onClick={() => setAddOpen(true)}>Thêm Chính Sách</Button>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
            Đang tải...
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">Tất Cả</TabsTrigger>
              <TabsTrigger value="CANCELLATION">Hủy Phòng</TabsTrigger>
              <TabsTrigger value="TERMS">Điều Khoản</TabsTrigger>
              <TabsTrigger value="PRIVACY">Quyền Riêng Tư</TabsTrigger>
              <TabsTrigger value="CHECKIN_CHECKOUT">Check-in/out</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <PoliciesTable policies={filterByType()} />
            </TabsContent>
            <TabsContent value="CANCELLATION" className="mt-4">
              <PoliciesTable policies={filterByType('CANCELLATION')} />
            </TabsContent>
            <TabsContent value="TERMS" className="mt-4">
              <PoliciesTable policies={filterByType('TERMS')} />
            </TabsContent>
            <TabsContent value="PRIVACY" className="mt-4">
              <PoliciesTable policies={filterByType('PRIVACY')} />
            </TabsContent>
            <TabsContent value="CHECKIN_CHECKOUT" className="mt-4">
              <PoliciesTable policies={filterByType('CHECKIN_CHECKOUT')} />
            </TabsContent>
          </Tabs>
        )}
      </Main>

      <PolicyActionDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  )
}
