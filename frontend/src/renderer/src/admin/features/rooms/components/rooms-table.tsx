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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Room, RoomStatus } from '../data/schema'
import { useRooms } from './rooms-provider'

const PAGE_SIZE = 10

const statusColors: Record<RoomStatus, string> = {
  AVAILABLE: 'bg-green-100 text-green-800',
  OCCUPIED: 'bg-red-100 text-red-800',
  MAINTENANCE: 'bg-yellow-100 text-yellow-800',
  RESERVED: 'bg-blue-100 text-blue-800'
}

const statusLabels: Record<RoomStatus, string> = {
  AVAILABLE: 'Trống',
  OCCUPIED: 'Đang sử dụng',
  MAINTENANCE: 'Bảo trì',
  RESERVED: 'Đã đặt'
}

export function RoomsTable() {
  const { rooms, loading, setOpen, setCurrentRow, statusFilter, setStatusFilter } = useRooms()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRooms = rooms.filter((room) => {
    const searchLower = search.toLowerCase()
    return (
      room.roomNumber.toLowerCase().includes(searchLower) ||
      (room.roomTypeName ?? '').toLowerCase().includes(searchLower) ||
      String(room.floor).includes(searchLower)
    )
  })

  const totalPages = Math.ceil(filteredRooms.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedRooms = filteredRooms.slice(startIndex, startIndex + PAGE_SIZE)

  const handleEdit = (room: Room) => {
    setCurrentRow(room)
    setOpen('edit')
  }

  const handleDelete = (room: Room) => {
    setCurrentRow(room)
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
            placeholder="Tìm kiếm phòng..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value as RoomStatus | '')
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            <SelectItem value="AVAILABLE">Trống</SelectItem>
            <SelectItem value="OCCUPIED">Đang sử dụng</SelectItem>
            <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
            <SelectItem value="RESERVED">Đã đặt</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Số phòng</TableHead>
              <TableHead>Tầng</TableHead>
              <TableHead>Loại phòng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead className="w-17">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Không tìm thấy phòng nào.
                </TableCell>
              </TableRow>
            ) : (
              paginatedRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.roomNumber}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.roomTypeName || '—'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('border-0', statusColors[room.status])}>
                      {statusLabels[room.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{room.notes || '—'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(room)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(room)}
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
          Hiển thị {filteredRooms.length === 0 ? 0 : startIndex + 1} đến{' '}
          {Math.min(startIndex + PAGE_SIZE, filteredRooms.length)} trong tổng số{' '}
          {filteredRooms.length} phòng
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
