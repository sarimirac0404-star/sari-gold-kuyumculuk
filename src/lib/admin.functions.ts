import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const OffsetSchema = z.object({
  item_name: z.string().min(1).max(100),
  buying_offset: z.number().finite(),
  selling_offset: z.number().finite(),
});

const SaveInputSchema = z.object({
  password: z.string().min(1).max(200),
  offsets: z.array(OffsetSchema).max(100),
});

const PasswordInputSchema = z.object({
  password: z.string().min(1).max(200),
});

export type OffsetRow = z.infer<typeof OffsetSchema>;

export const verifyAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PasswordInputSchema.parse(d))
  .handler(async ({ data }) => {
    const { isValidAdminPassword } = await import("@/lib/auth.server");
    return { ok: isValidAdminPassword(data.password) };
  });

export const getAdminOffsets = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PasswordInputSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean; offsets: OffsetRow[] }> => {
    const { isValidAdminPassword } = await import("@/lib/auth.server");
    if (!isValidAdminPassword(data.password)) {
      return { ok: false, offsets: [] };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("rate_offsets")
      .select("item_name, buying_offset, selling_offset");
    if (error) throw new Error(error.message);
    return {
      ok: true,
      offsets: (rows ?? []).map((r) => ({
        item_name: r.item_name,
        buying_offset: Number(r.buying_offset),
        selling_offset: Number(r.selling_offset),
      })),
    };
  });

export const saveAdminOffsets = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SaveInputSchema.parse(d))
  .handler(async ({ data }) => {
    const { isValidAdminPassword } = await import("@/lib/auth.server");
    if (!isValidAdminPassword(data.password)) {
      return { ok: false as const, error: "Şifre hatalı" };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = data.offsets.map((o) => ({
      item_name: o.item_name,
      buying_offset: o.buying_offset,
      selling_offset: o.selling_offset,
      updated_at: new Date().toISOString(),
    }));
    const { error } = await supabaseAdmin
      .from("rate_offsets")
      .upsert(payload, { onConflict: "item_name" });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });
