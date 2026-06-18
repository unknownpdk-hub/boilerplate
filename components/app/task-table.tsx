import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@prisma/client"

const statusLabel: Record<string, string> = {
  TODO: "할 일",
  IN_PROGRESS: "진행중",
  DONE: "완료",
}
const priorityLabel: Record<string, string> = {
  LOW: "낮음",
  MEDIUM: "보통",
  HIGH: "높음",
}
const priorityVariant: Record<
  string,
  "default" | "secondary" | "destructive"
> = {
  LOW: "secondary",
  MEDIUM: "default",
  HIGH: "destructive",
}

export function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>제목</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>우선순위</TableHead>
          <TableHead>생성일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              태스크가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          tasks.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.title}</TableCell>
              <TableCell>{statusLabel[t.status]}</TableCell>
              <TableCell>
                <Badge variant={priorityVariant[t.priority]}>
                  {priorityLabel[t.priority]}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(t.createdAt).toLocaleDateString("ko-KR")}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
