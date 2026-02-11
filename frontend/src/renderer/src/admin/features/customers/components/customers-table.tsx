import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
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
  ChevronLeft,
  ChevronRight,
  Eye,
  Star
} from 'lucide-react'
import type { Customer } from '../data/schema'
import { useCustomers } from './customers-provider'

const PAGE_SIZE = 10

export function CustomersTable() {
  const { customers, loading, setOpen, setCurrentRow } = useCustomers()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [vipOnly, setVipOnly] = useState(false)

  const filteredCustomers = customers.filter((customer) => {
    if (vipOnly && !customer.isVIP) return false

    const searchLower = search.toLowerCase()
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase()
    return (
      fullName.includes(searchLower) ||
      (customer.email ?? '').toLowerCase().includes(searchLower) ||
      (customer.phone ?? '').toLowerCase().includes(searchLower) ||
      (customer.idNumber ?? '').toLowerCase().includes(searchLower)
    )
  })

  const totalPages = Math.ceil(filteredCustomers.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + PAGE_SIZE)

  const handleDetail = (customer: Customer) => {
    setCurrentRow(customer)
    setOpen('detail')
  }

  const handleEdit = (customer: Customer) => {
    setCurrentRow(customer)
    setOpen('edit')
  }

  const handleDelete = (customer: Customer) => {
    setCurrentRow(customer)
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
      {/* Search/Filter Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm khách hàng..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-8"
          />
        </div>
        <Button
          variant={vipOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setVipOnly((prev) => !prev)
            setCurrentPage(1)
          }}
          className="gap-1"
        >
          <Star className={cn('h-4 w-4', vipOnly && 'fill-current')} />
          VIP
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Họ và tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>CMND/CCCD</TableHead>
              <TableHead>Quốc tịch</TableHead>
              <TableHead>VIP</TableHead>
              <TableHead className="w-17">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Không tìm thấy khách hàng nào.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>{customer.email || '—'}</TableCell>
                  <TableCell>{customer.phone || '—'}</TableCell>
                  <TableCell>{customer.idNumber || '—'}</TableCell>
                  <TableCell>{customer.nationality || '—'}</TableCell>
                  <TableCell>
                    {customer.isVIP ? (
                      <Badge
                        variant="outline"
                        className="border-0 bg-amber-100 text-amber-800 gap-1"
                      >
                        <Star className="h-3 w-3 fill-current" />
                        VIP
                      </Badge>
                    ) : (
                      '—'
                    )}
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
                        <DropdownMenuItem onClick={() => handleDetail(customer)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(customer)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(customer)}
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

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Hiển thị {filteredCustomers.length === 0 ? 0 : startIndex + 1} đến{' '}
          {Math.min(startIndex + PAGE_SIZE, filteredCustomers.length)} trong tổng số{' '}
          {filteredCustomers.length} khách hàng
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
