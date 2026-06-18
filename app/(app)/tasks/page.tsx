import { listTasks } from "@/lib/actions/task"
import { TaskTable } from "@/components/app/task-table"
import { Button } from "@/components/ui/button"

export default async function TasksPage() {
  const result = await listTasks()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">태스크</h1>
        <Button size="sm">새 태스크</Button>
      </div>
      {result.error ? (
        <p className="text-sm text-destructive">{result.error}</p>
      ) : (
        <TaskTable tasks={result.data ?? []} />
      )}
    </div>
  )
}
