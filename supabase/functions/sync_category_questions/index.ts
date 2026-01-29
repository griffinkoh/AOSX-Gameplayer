import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type CategoryQ = {
  category: string;

  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";

  points: number; // 10/20/30/40
  time_limit_sec: number;
};

const REQUIRED_KEYS = [
  "category",
  "question",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_option",
  "points",
  "time_limit_sec",
] as const;

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: msg }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function cleanStr(x: any) {
  return String(x ?? "").trim();
}

function upper1(x: any) {
  return cleanStr(x).toUpperCase();
}

serve(async (req) => {
  try {
    if (req.method !== "POST") return bad("Only POST allowed", 405);

    // token auth
    const token = req.headers.get("x-sync-token");
    const expected = Deno.env.get("SYNC_TOKEN");
    if (!expected || !token || token !== expected) return bad("Unauthorized", 401);

    const body = await req.json().catch(() => null);
    if (!body) return bad("Invalid JSON body");

    const game_code = cleanStr(body.game_code);
    const questions = body.questions as unknown;

    if (!game_code) return bad("Missing game_code");
    if (!Array.isArray(questions)) return bad("questions must be an array");
    if (questions.length !== 16) return bad("Must provide exactly 16 questions");

    const slots = new Set<number>();

    const cleaned: CategoryQ[] = questions.map((raw: any, idx: number) => {
      for (const k of REQUIRED_KEYS) {
        if (raw?.[k] === undefined || raw?.[k] === null) {
          throw new Error(`Row ${idx + 1}: missing "${k}"`);
        }
      }

      const slot = Number(raw.slot);
      const points = Number(raw.points);
      const time_limit_sec = Number(raw.time_limit_sec);

      const category = cleanStr(raw.category);
      const question = cleanStr(raw.question);

      const option_a = cleanStr(raw.option_a);
      const option_b = cleanStr(raw.option_b);
      const option_c = cleanStr(raw.option_c);
      const option_d = cleanStr(raw.option_d);

      const correct_option = upper1(raw.correct_option) as CategoryQ["correct_option"];

      if (!Number.isInteger(slot) || slot < 1 || slot > 16) {
        throw new Error(`Row ${idx + 1}: slot must be 1–16`);
      }
      if (slots.has(slot)) throw new Error(`Duplicate slot: ${slot}`);
      slots.add(slot);

      if (!category) throw new Error(`Row ${idx + 1} (slot ${slot}): category is blank`);
      if (!question) throw new Error(`Row ${idx + 1} (slot ${slot}): question is blank`);

      if (!option_a || !option_b || !option_c || !option_d) {
        throw new Error(`Row ${idx + 1} (slot ${slot}): all options A-D must be filled`);
      }

      if (!["A", "B", "C", "D"].includes(correct_option)) {
        throw new Error(`Row ${idx + 1} (slot ${slot}): correct_option must be A/B/C/D`);
      }

      if (!Number.isFinite(points)) throw new Error(`Row ${idx + 1} (slot ${slot}): points must be number`);
      if (!Number.isFinite(time_limit_sec)) throw new Error(`Row ${idx + 1} (slot ${slot}): time_limit_sec must be number`);

      return {
        slot,
        category,
        question,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        points,
        time_limit_sec,
      };
    });

    for (let s = 1; s <= 16; s++) {
      if (!slots.has(s)) return bad(`Missing slot ${s}. Must have slots 1–16.`);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!,
    );

    // Replace-all per game_code
    const { error: delErr } = await supabase
      .from("category_questions")
      .delete()
      .eq("game_code", game_code);

    if (delErr) return bad(`Delete failed: ${delErr.message}`, 500);

    cleaned.sort((a, b) => a.slot - b.slot);

    const { error: insErr } = await supabase.from("category_questions").insert(
      cleaned.map((q) => ({
        game_code,
        slot: q.slot,
        category: q.category,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
        points: q.points,
        time_limit_sec: q.time_limit_sec,
      })),
    );

    if (insErr) return bad(`Insert failed: ${insErr.message}`, 500);

    return new Response(JSON.stringify({ ok: true, table: "category_questions", game_code, count: 16 }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return bad(String(e?.message ?? e), 400);
  }
});
