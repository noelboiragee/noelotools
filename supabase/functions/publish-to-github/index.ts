// Deploy as a Supabase Edge Function. GitHub credentials are server-side secrets only.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (body: unknown, status=200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const auth = req.headers.get("Authorization") || "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const client = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error: userError } = await client.auth.getUser();
  if (userError || !user) return json({ error: "Authentication required" }, 401);
  const { data: admin } = await client.from("admin_users").select("role,active").eq("user_id", user.id).maybeSingle();
  if (!admin?.active || !["owner", "admin"].includes(admin.role)) return json({ error: "Admin permission required" }, 403);
  const token = Deno.env.get("GITHUB_TOKEN");
  const repo = Deno.env.get("GITHUB_REPOSITORY") || "noelboiragee/noelotools";
  const branch = Deno.env.get("GITHUB_BRANCH") || "main";
  if (!token) return json({ error: "Publishing is not configured: missing server secret" }, 503);
  let input: { path?: string; content?: string; message?: string };
  try { input = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const path = input.path || "";
  const content = input.content;
  // Explicit allowlist prevents publishing arbitrary repository files or workflows.
  const allowed = /^(tools\/[a-z0-9-]+\/index\.html|pages\/[a-z0-9-]+\/index\.html|blog\/posts\/[a-z0-9-]+\.html|assets\/data\/tools\.json)$/;
  if (!allowed.test(path) || typeof content !== "string" || content.length > 500000) return json({ error: "Path or content is not allowed" }, 400);
  const ghHeaders = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  const endpoint = `https://api.github.com/repos/${repo}/contents/${path}`;
  const existing = await fetch(`${endpoint}?ref=${encodeURIComponent(branch)}`, { headers: ghHeaders });
  let sha: string | undefined;
  if (existing.ok) { const current = await existing.json(); sha = current.sha; }
  else if (existing.status !== 404) return json({ error: "Could not inspect target file", status: existing.status }, 502);
  const bytes = new TextEncoder().encode(content);\n  let binary = "";\n  const chunkSize = 0x8000;\n  for (let offset = 0; offset < bytes.length; offset += chunkSize) {\n    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));\n  }\n  const encoded = btoa(binary);
  const response = await fetch(endpoint, { method: "PUT", headers: { ...ghHeaders, "Content-Type": "application/json" }, body: JSON.stringify({ message: input.message || `Admin publish: update ${path}`, content: encoded, branch, ...(sha ? { sha } : {}) }) });
  const result = await response.json();
  if (!response.ok) return json({ error: "GitHub rejected the publish request", details: result.message || response.status }, 502);
  await client.from("audit_logs").insert({ actor: user.id, action: "publish_file", entity_type: "github_file", entity_id: path, details: { branch, commit: result.commit?.sha } });
  return json({ ok: true, path, branch, commit: result.commit?.sha, url: result.content?.html_url });
});