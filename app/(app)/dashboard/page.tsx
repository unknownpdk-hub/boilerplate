import { listProjects } from "@/lib/actions/project"
import { listTasks } from "@/lib/actions/task"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function DashboardPage() {
  const [projectsResult, tasksResult] = await Promise.all([
    listProjects(),
    listTasks(),
  ])

  const projectCount = projectsResult.data?.length ?? 0
  const taskCount = tasksResult.data?.length ?? 0
  const doneCount =
    tasksResult.data?.filter((t) => t.status === "DONE").length ?? 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 프로젝트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projectCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 태스크
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{taskCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              완료된 태스크
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{doneCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
