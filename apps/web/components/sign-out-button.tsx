"use client"

import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function SignOutButton() {
  const router = useRouter()

  return (
    <button
      onClick={async () => {
        await signOut()
        router.refresh()
      }}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      登出
    </button>
  )
}
