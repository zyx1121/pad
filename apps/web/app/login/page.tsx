// Login page — not linked from nav (obscurity to reduce noise).
// The real lock is owner check + @workspace/domain authz.
import { Suspense } from "react"
import { LoginButton } from "@/components/login-button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/ui/card"

export const metadata = {
  title: "登入",
  robots: { index: false },
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>登入 Pad</CardTitle>
          <CardDescription>使用 Google 帳號登入以留言。</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginButton />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  )
}
