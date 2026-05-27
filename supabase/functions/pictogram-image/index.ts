import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
};

const DEFAULT_BUCKET = "safety-pictograms";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

function cleanText(value: unknown, max = 200) {
  return String(value || "").trim().slice(0, max);
}

function notFound() {
  return new Response("not found", {
    status: 404,
    headers: {
      ...corsHeaders,
      "Cache-Control": "no-store",
    },
  });
}

function imageResponse(body: BodyInit | null, contentType: string) {
  return new Response(body, {
    headers: {
      ...corsHeaders,
      "Content-Type": contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function parseDataUrl(value: unknown) {
  const text = String(value || "");
  const match = text.match(/^data:([^;,]+);base64,([a-z0-9+/=\s]+)$/i);
  if (!match) return null;
  const mimeType = match[1].toLowerCase();
  if (!/^image\/(png|jpe?g|webp)$/.test(mimeType)) return null;
  const binary = atob(match[2].replace(/\s+/g, ""));
  return {
    mimeType: mimeType === "image/jpg" ? "image/jpeg" : mimeType,
    bytes: Uint8Array.from(binary, (char) => char.charCodeAt(0)),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("method not allowed", { status: 405, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const id = cleanText(url.searchParams.get("id"), 120);
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) return notFound();

  const { data, error } = await supabase
    .from("safety_pictograms")
    .select("storage_bucket,storage_path,mime_type,src")
    .eq("id", id)
    .eq("source", "custom")
    .eq("deleted", false)
    .maybeSingle();

  if (error || !data) return notFound();

  const row = data as Record<string, unknown>;
  const bucket = cleanText(row.storage_bucket || DEFAULT_BUCKET, 120);
  const storagePath = cleanText(row.storage_path, 500);
  if (storagePath) {
    const { data: blob, error: downloadError } = await supabase.storage.from(bucket).download(storagePath);
    if (downloadError || !blob) return notFound();
    return imageResponse(req.method === "HEAD" ? null : blob, cleanText(row.mime_type, 120) || blob.type);
  }

  const src = cleanText(row.src, 2 * 1024 * 1024);
  if (/^https:\/\//i.test(src)) return Response.redirect(src, 302);
  const legacy = parseDataUrl(src);
  if (legacy?.bytes?.length) return imageResponse(req.method === "HEAD" ? null : legacy.bytes, legacy.mimeType);

  return notFound();
});
