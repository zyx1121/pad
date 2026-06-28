"use server"

import { revalidatePath } from "next/cache"
import { getPrincipal } from "@/lib/principal"
import {
  addComment,
  resolveComment,
  setVisibility,
  setShares,
} from "@workspace/domain/ops"

// [THREAT-T-1] All mutations route through @workspace/domain ops which enforce authz.
// Server actions MUST NOT implement their own authz — they only resolve the principal.

export async function addCommentAction(formData: FormData) {
  const docId = formData.get("docId")
  const body = formData.get("body")

  if (typeof docId !== "string" || typeof body !== "string") return
  if (!body.trim()) return

  const principal = await getPrincipal()
  const result = await addComment(principal, docId, body.trim())

  if (result.kind === "ok") {
    revalidatePath(`/d/${docId}`)
  }
  // forbidden: silently drop (no enumeration of doc existence for anon)
}

export async function resolveCommentAction(formData: FormData) {
  const commentId = Number(formData.get("commentId"))
  const docId = formData.get("docId")

  if (!Number.isInteger(commentId) || typeof docId !== "string") return

  const principal = await getPrincipal()
  const result = await resolveComment(principal, commentId)

  if (result.kind === "ok") {
    revalidatePath(`/d/${docId}`)
  }
}

export async function setVisibilityAction(formData: FormData) {
  const docId = formData.get("docId")
  const visibility = formData.get("visibility")

  if (typeof docId !== "string") return
  if (
    visibility !== "private" &&
    visibility !== "shared" &&
    visibility !== "public"
  )
    return

  const principal = await getPrincipal()
  await setVisibility(principal, docId, visibility)
  revalidatePath(`/d/${docId}`)
  revalidatePath("/")
}

export async function setSharesAction(formData: FormData) {
  const docId = formData.get("docId")
  if (typeof docId !== "string") return

  const emails = formData
    .getAll("emails")
    .filter((v): v is string => typeof v === "string")

  const principal = await getPrincipal()
  await setShares(principal, docId, emails)
  revalidatePath(`/d/${docId}`)
}
