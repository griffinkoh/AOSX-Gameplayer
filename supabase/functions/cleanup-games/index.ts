import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

serve(async (req) => {
  try {
    if (req.method !== "POST") return json(405, { ok: false, error: "Only POST allowed" })

    // Your custom token auth (from Apps Script)
    const token = req.headers.get("x-sync-token")
    const expected = Deno.env.get("SYNC_TOKEN")
    if (!expected || !token || token !== expected) return json(401, { ok: false, error: "Unauthorized" })

    const body = await req.json().catch(() => null) as any
    if (!body) return json(400, { ok: false, error: "Invalid JSON body" })

    const active = body.active_game_codes
    if (!Array.isArray(active)) return json(400, { ok: false, error: "active_game_codes must be an array" })

    const codes = Array.from(
      new Set(
        active
          .map((x: any) => String(x ?? "").trim())
          .filter((x: string) => x.length > 0),
      ),
    )

    if (codes.length === 0) {
      return json(400, {
        ok: false,
        error: "active_game_codes is empty. Refusing to delete everything.",
      })
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!, // NOTE: your renamed secret
    )

    // Delete all question rows whose game_code is NOT in current sheet list
    const { error } = await supabase
      .from("questions")
      .delete()
      .not("game_code", "in", `(${codes.map((c) => `"${c.replace(/"/g, '\\"')}"`).join(",")})`)

    if (error) return json(500, { ok: false, error: error.message })

    return json(200, { ok: true, kept: codes })
  } catch (e: any) {
    return json(400, { ok: false, error: String(e?.message ?? e) })
  }
})
