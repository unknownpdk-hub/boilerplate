import { listProjects } from "@/lib/actions/project"
import { ProjectTable } from "@/components/app/project-table"
import { Button } from "@/components/ui/button"

export default async function ProjectsPage() {
  const result = await listProjects()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">프로젝트</h1>
        <Button size="sm">새 프로젝트</Button>
      </div>
      {result.error ? (
        <p className="text-sm text-destructive">{result.error}</p>
      ) : (
        <ProjectTable projects={result.data ?? []} />
      )}
    </div>
  )
}
