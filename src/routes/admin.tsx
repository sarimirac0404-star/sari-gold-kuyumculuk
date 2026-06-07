import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Lock, Save, Loader2 } from "lucide-react";
import {
  getAdminOffsets,
  saveAdminOffsets,
  type OffsetRow,
} from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Yönetim" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const ALL_ITEMS = [
  "EUR",
  "USD",
  "HAS ALTIN",
  "24 AYAR 1 GR",
  "22 AYAR BİLEZİK",
  "ESKİ ATA LİRA",
  "YENİ ATA LİRA",
  "GÜMÜŞ",
  "ESKİ ÇEYREK",
  "ESKİ YARIM",
  "ESKİ TAM",
  "YENİ ÇEYREK",
  "YENİ YARIM",
  "YENİ TAM",
] as const;

type FormState = Record<string, { buying: string; selling: string }>;

function makeEmptyForm(): FormState {
  const f: FormState = {};
  for (const name of ALL_ITEMS) f[name] = { buying: "0", selling: "0" };
  return f;
}

function AdminPage() {
  const fetchOffsets = useServerFn(getAdminOffsets);
  const saveOffsets = useServerFn(saveAdminOffsets);

  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(makeEmptyForm);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchOffsets({ data: { password } });
      if (!res.ok) {
        toast.error("Şifre hatalı");
        return;
      }
      const next = makeEmptyForm();
      for (const o of res.offsets as OffsetRow[]) {
        if (next[o.item_name]) {
          next[o.item_name] = {
            buying: String(o.buying_offset),
            selling: String(o.selling_offset),
          };
        }
      }
      setForm(next);
      setAuthed(true);
      toast.success("Giriş başarılı");
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const offsets: OffsetRow[] = ALL_ITEMS.map((name) => ({
        item_name: name,
        buying_offset: parseFloat(form[name].buying) || 0,
        selling_offset: parseFloat(form[name].selling) || 0,
      }));
      const res = await saveOffsets({ data: { password, offsets } });
      if (!res.ok) {
        toast.error(res.error || "Kaydedilemedi");
        return;
      }
      toast.success("Farklar kaydedildi — fiyatlar 1 dk içinde güncellenir");
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  function updateField(name: string, key: "buying" | "selling", value: string) {
    setForm((f) => ({ ...f, [name]: { ...f[name], [key]: value } }));
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-card border border-border p-8 space-y-5"
        >
          <div className="flex items-center gap-2 text-primary">
            <Lock size={18} />
            <h1 className="font-display text-xl">Yönetim Girişi</h1>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw">Şifre</Label>
            <Input
              id="pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Giriş"}
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-gradient-gold">
              Fiyat Farkı Yönetimi
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Harem Altın canlı fiyatlarına eklenecek TL farkını girin
              (negatif değer = altında).
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Kaydet
          </Button>
        </div>

        <div className="bg-card border border-border">
          <div className="grid grid-cols-[1fr_120px_120px] gap-4 p-4 border-b border-border font-ui text-xs uppercase tracking-widest text-muted-foreground">
            <div>Ürün</div>
            <div className="text-right">Alış Farkı</div>
            <div className="text-right">Satış Farkı</div>
          </div>
          {ALL_ITEMS.map((name) => (
            <div
              key={name}
              className="grid grid-cols-[1fr_120px_120px] gap-4 p-4 items-center border-b border-border/40 last:border-b-0"
            >
              <div className="font-display text-foreground">{name}</div>
              <Input
                type="number"
                step="0.01"
                inputMode="decimal"
                value={form[name].buying}
                onChange={(e) => updateField(name, "buying", e.target.value)}
                className="text-right"
              />
              <Input
                type="number"
                step="0.01"
                inputMode="decimal"
                value={form[name].selling}
                onChange={(e) => updateField(name, "selling", e.target.value)}
                className="text-right"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Kaydet
          </Button>
        </div>
      </div>
    </main>
  );
}
