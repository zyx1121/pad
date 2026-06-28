import type { Metadata } from "next"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: { default: "Pad", template: "%s | Pad" },
  description: "協作 Markdown 閱讀與留言平台",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
