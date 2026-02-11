import { toast } from 'sonner'

export function showSubmittedData(data: unknown, title: string = 'Bạn đã gửi các giá trị sau:') {
  toast.message(title, {
    description: (
      <pre className="mt-2 w-full overflow-x-auto rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
      </pre>
    )
  })
}
