import { createServerFn } from "@tanstack/react-start";

export interface NotifyProductSummary {
  id: string;
  name: string;
  category_slug: string;
}

export const listRecentProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<NotifyProductSummary[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, name, category_slug")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (data ?? []) as NotifyProductSummary[];
  },
);
