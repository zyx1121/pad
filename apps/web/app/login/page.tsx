// Login page — not linked from nav (obscurity to reduce noise).
// The real lock is owner check + @workspace/domain authz.
import { Suspense } from "react"
import { LoginButton } from "@/components/login-button"

export const metadata = {
  title: "登入",
  robots: { index: false },
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border p-8 shadow-sm">
        <h1 className="mb-2 text-xl font-bold">登入 Pad</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          使用 Google 帳號登入以留言。
        </p>
        <Suspense>
          <LoginButton />
        </Suspense>
      </div>
    </main>
  )
}
