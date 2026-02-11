import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { dashboardApi, type MonthlyRevenue } from '../data/api'

const formatVND = (val: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

export function Overview() {
  const [data, setData] = useState<MonthlyRevenue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    dashboardApi
      .getMonthlyRevenue(12)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex h-[350px] items-center justify-center text-muted-foreground">
        Đang tải dữ liệu...
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="flex h-[350px] items-center justify-center text-muted-foreground">
        Chưa có dữ liệu
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          direction="ltr"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatVND(value)}
        />
        <Tooltip
          formatter={(value: number) => [formatVND(value), 'Doanh thu']}
          labelFormatter={(label) => `Tháng ${label}`}
        />
        <Bar dataKey="revenue" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
