import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BUCKET = "product-images";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365; // 1 year

// 10 MB image cap. Base64 expands by ~1.37×, so 13_700_000 chars ≈ 10 MB binary.
const MAX_IMAGE_BASE64_LENGTH = 13_700_000;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export type Karat = "14K" | "22K";

export interface DbProduct {
  id: string;
  category_slug: string;
  name: string;
  description: string;
  image_path: string | null;
  image_url: string | null;
  sort_order: number;
  karat: Karat;
}

const KaratSchema = z.enum(["14K", "22K"]);

const SlugSchema = z.object({ category_slug: z.string().min(1).max(50) });

const AddSchema = z.object({
  password: z.string().min(1).max(200),
  category_slug: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).default(""),
  karat: KaratSchema.default("22K"),
  image_base64: z.string().max(MAX_IMAGE_BASE64_LENGTH).optional(),
  image_filename: z.string().max(200).optional(),
  image_content_type: z.string().max(100).optional(),
});

const UpdateSchema = z.object({
  password: z.string().min(1).max(200),
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).default(""),
  karat: KaratSchema.optional(),
  image_base64: z.string().max(MAX_IMAGE_BASE64_LENGTH).optional(),
  image_filename: z.string().max(200).optional(),
  image_content_type: z.string().max(100).optional(),
  remove_image: z.boolean().optional(),
});

const DeleteSchema = z.object({
  password: z.string().min(1).max(200),
  id: z.string().uuid(),
});

async function signUrls(
  rows: Array<{
    id: string;
    category_slug: string;
    name: string;
    description: string;
    image_path: string | null;
    sort_order: number;
    karat?: string | null;
  }>,
): Promise<DbProduct[]> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return Promise.all(
    rows.map(async (r) => {
      let image_url: string | null = null;
      if (r.image_path) {
        const { data } = await supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUrl(r.image_path, SIGNED_URL_TTL);
        image_url = data?.signedUrl ?? null;
      }
      const karat: Karat = r.karat === "14K" ? "14K" : "22K";
      return { ...r, image_url, karat };
    }),
  );
}

function decodeBase64(input: string): Buffer {
  const stripped = input.includes(",") ? input.split(",")[1] : input;
  return Buffer.from(stripped, "base64");
}

function extFromName(name?: string, contentType?: string): string {
  if (name && name.includes(".")) {
    const ext = name.split(".").pop()!.toLowerCase();
    if (ALLOWED_EXTENSIONS.has(ext)) return ext;
  }
  if (contentType?.startsWith("image/")) {
    const ct = contentType.split("/")[1].split("+")[0].toLowerCase();
    if (ALLOWED_EXTENSIONS.has(ct)) return ct;
  }
  return "jpg";
}

/**
 * Validates the uploaded image type. Rejects SVG and any non-image content
 * to prevent stored XSS via signed URLs.
 */
function validateImageType(
  contentType: string | undefined,
  filename: string | undefined,
): { ok: true; mime: string; ext: string } | { ok: false; error: string } {
  const ext = filename && filename.includes(".")
    ? filename.split(".").pop()!.toLowerCase()
    : "";
  if (contentType) {
    const ct = contentType.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(ct)) {
      return { ok: false, error: "Desteklenmeyen dosya türü. Sadece JPG, PNG, WEBP, GIF kabul edilir." };
    }
  }
  if (ext && !ALLOWED_EXTENSIONS.has(ext)) {
    return { ok: false, error: "Desteklenmeyen dosya uzantısı. Sadece JPG, PNG, WEBP, GIF kabul edilir." };
  }
  const resolvedExt = extFromName(filename, contentType);
  const resolvedMime = contentType && ALLOWED_MIME_TYPES.has(contentType.toLowerCase())
    ? contentType.toLowerCase()
    : EXT_TO_MIME[resolvedExt];
  return { ok: true, mime: resolvedMime, ext: resolvedExt };
}

export const listProducts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SlugSchema.parse(d))
  .handler(async ({ data }): Promise<DbProduct[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("products")
      .select("id, category_slug, name, description, image_path, sort_order, karat")
      .eq("category_slug", data.category_slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return signUrls(rows ?? []);
  });

export const adminListAllProducts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string() }).parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean; products: DbProduct[] }> => {
    const { isValidAdminPassword } = await import("@/lib/auth.server");
    if (!isValidAdminPassword(data.password)) return { ok: false, products: [] };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("products")
      .select("id, category_slug, name, description, image_path, sort_order, karat")
      .order("category_slug", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { ok: true, products: await signUrls(rows ?? []) };
  });

export const addProduct = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => AddSchema.parse(d))
  .handler(async ({ data }) => {
    const { isValidAdminPassword } = await import("@/lib/auth.server");
    if (!isValidAdminPassword(data.password)) {
      return { ok: false as const, error: "Şifre hatalı" };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let image_path: string | null = null;
    if (data.image_base64) {
      const typeCheck = validateImageType(data.image_content_type, data.image_filename);
      if (!typeCheck.ok) return { ok: false as const, error: typeCheck.error };
      const path = `${data.category_slug}/${crypto.randomUUID()}.${typeCheck.ext}`;
      const bytes = decodeBase64(data.image_base64);
      const { error: upErr } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, bytes, {
          contentType: typeCheck.mime,
          upsert: false,
        });
      if (upErr) return { ok: false as const, error: upErr.message };
      image_path = path;
    }

    const { error } = await supabaseAdmin.from("products").insert({
      category_slug: data.category_slug,
      name: data.name,
      description: data.description,
      karat: data.karat,
      image_path,
    });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => UpdateSchema.parse(d))
  .handler(async ({ data }) => {
    const { isValidAdminPassword } = await import("@/lib/auth.server");
    if (!isValidAdminPassword(data.password)) {
      return { ok: false as const, error: "Şifre hatalı" };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing, error: exErr } = await supabaseAdmin
      .from("products")
      .select("category_slug, image_path")
      .eq("id", data.id)
      .maybeSingle();
    if (exErr) return { ok: false as const, error: exErr.message };
    if (!existing) return { ok: false as const, error: "Ürün bulunamadı" };

    let image_path: string | null = existing.image_path;
    if (data.remove_image && existing.image_path) {
      await supabaseAdmin.storage.from(BUCKET).remove([existing.image_path]);
      image_path = null;
    }
    if (data.image_base64) {
      const typeCheck = validateImageType(data.image_content_type, data.image_filename);
      if (!typeCheck.ok) return { ok: false as const, error: typeCheck.error };
      if (existing.image_path) {
        await supabaseAdmin.storage.from(BUCKET).remove([existing.image_path]);
      }
      const path = `${existing.category_slug}/${crypto.randomUUID()}.${typeCheck.ext}`;
      const bytes = decodeBase64(data.image_base64);
      const { error: upErr } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, bytes, {
          contentType: typeCheck.mime,
          upsert: false,
        });
      if (upErr) return { ok: false as const, error: upErr.message };
      image_path = path;
    }

    const { error } = await supabaseAdmin
      .from("products")
      .update({
        name: data.name,
        description: data.description,
        image_path,
        ...(data.karat ? { karat: data.karat } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => DeleteSchema.parse(d))
  .handler(async ({ data }) => {
    const { isValidAdminPassword } = await import("@/lib/auth.server");
    if (!isValidAdminPassword(data.password)) {
      return { ok: false as const, error: "Şifre hatalı" };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin
      .from("products")
      .select("image_path")
      .eq("id", data.id)
      .maybeSingle();
    if (existing?.image_path) {
      await supabaseAdmin.storage.from(BUCKET).remove([existing.image_path]);
    }
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
