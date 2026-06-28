"use client"

import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/ui/button"

export function SignOutButton() {
  const router = useRouter()

  return (
    <Button
      variant="raw"
      onClick={async () => {
        await signOut()
        router.refresh()
      }}
    >
      登出
    </Button>
  )
}
