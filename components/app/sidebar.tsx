"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderKanban, CheckSquare } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/projects", label: "프로젝트", icon: FolderKanban },
  { href: "/tasks", label: "태스크", icon: CheckSquare },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-56 flex-col border-r bg-background px-3 py-4">
      <p className="mb-6 px-2 text-lg font-semibold">업무 관리</p>
      <nav className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent",
              pathname === href && "bg-accent",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
