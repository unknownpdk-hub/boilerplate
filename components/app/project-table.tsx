import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@prisma/client"

const statusLabel: Record<string, string> = {
  ACTIVE: "진행중",
  ARCHIVED: "보관됨",
}
const statusVariant: Record<string, "default" | "secondary"> = {
  ACTIVE: "default",
  ARCHIVED: "secondary",
}

export function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>제목</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>생성일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              프로젝트가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          projects.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[p.status]}>
                  {statusLabel[p.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(p.createdAt).toLocaleDateString("ko-KR")}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
