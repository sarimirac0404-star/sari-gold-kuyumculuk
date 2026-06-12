import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ADMIN_PASSWORD = "325641";
const BUCKET = "product-images";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365; // 1 year

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
  image_base64: z.string().optional(),
  image_filename: z.string().max(200).optional(),
  image_content_type: z.string().max(100).optional(),
});

const UpdateSchema = z.object({
  password: z.string().min(1).max(200),
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).default(""),
  karat: KaratSchema.optional(),
  image_base64: z.string().optional(),
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
      return { ...r, image_url };
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
    if (ext.length <= 5) return ext;
  }
  if (contentType?.startsWith("image/")) {
    return contentType.split("/")[1].split("+")[0];
  }
  return "jpg";
}

export const listProducts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SlugSchema.parse(d))
  .handler(async ({ data }): Promise<DbProduct[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("products")
      .select("id, category_slug, name, description, image_path, sort_order")
      .eq("category_slug", data.category_slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return signUrls(rows ?? []);
  });

export const adminListAllProducts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string() }).parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean; products: DbProduct[] }> => {
    if (data.password !== ADMIN_PASSWORD) return { ok: false, products: [] };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("products")
      .select("id, category_slug, name, description, image_path, sort_order")
      .order("category_slug", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { ok: true, products: await signUrls(rows ?? []) };
  });

export const addProduct = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => AddSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) {
      return { ok: false as const, error: "Şifre hatalı" };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let image_path: string | null = null;
    if (data.image_base64) {
      const ext = extFromName(data.image_filename, data.image_content_type);
      const path = `${data.category_slug}/${crypto.randomUUID()}.${ext}`;
      const bytes = decodeBase64(data.image_base64);
      const { error: upErr } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, bytes, {
          contentType: data.image_content_type || `image/${ext}`,
          upsert: false,
        });
      if (upErr) return { ok: false as const, error: upErr.message };
      image_path = path;
    }

    const { error } = await supabaseAdmin.from("products").insert({
      category_slug: data.category_slug,
      name: data.name,
      description: data.description,
      image_path,
    });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const updateProduct = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => UpdateSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) {
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
      if (existing.image_path) {
        await supabaseAdmin.storage.from(BUCKET).remove([existing.image_path]);
      }
      const ext = extFromName(data.image_filename, data.image_content_type);
      const path = `${existing.category_slug}/${crypto.randomUUID()}.${ext}`;
      const bytes = decodeBase64(data.image_base64);
      const { error: upErr } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(path, bytes, {
          contentType: data.image_content_type || `image/${ext}`,
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => DeleteSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) {
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
