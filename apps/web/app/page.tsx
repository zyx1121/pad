// Auth + DB read — must not be SSG
export const dynamic = "force-dynamic"

import Link from "next/link"
import { Lock, Users, Globe } from "lucide-react"
import { getPrincipal, isOwnerEmail } from "@/lib/principal"
import { listDocsFor } from "@workspace/domain/ops"
import { SignOutButton } from "@/components/sign-out-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

const visibilityIcon = {
  private: Lock,
  shared: Users,
  public: Globe,
} as const

export default async function HomePage() {
  const principal = await getPrincipal()

  const session = await auth.api.getSession({ headers: await headers() })
  const userEmail = session?.user?.email ?? null
  const ownerMode = isOwnerEmail(userEmail)

  const docs = await listDocsFor(principal)

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pad</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {userEmail ? (
            <>
              <span>{userEmail}</span>
              {ownerMode && <Badge>擁有者</Badge>}
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md px-3 py-1.5 text-sm ring-1 ring-border hover:bg-muted transition-colors"
            >
              登入
            </Link>
          )}
        </div>
      </div>

      {docs.length === 0 ? (
        <p className="text-muted-foreground">目前沒有可閱讀的文件。</p>
      ) : (
        <ul className="divide-y divide-border rounded-lg border">
          {docs.map((doc) => {
            const Icon = visibilityIcon[doc.visibility]
            return (
              <li key={doc.id}>
                <Link
                  href={`/d/${doc.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 font-medium">{doc.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(doc.updatedAt).toLocaleDateString("zh-TW")}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
