import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef } from "react";
import { Lock, Save, Loader2, Plus, Trash2, Pencil, X, ImageIcon, Upload } from "lucide-react";
import {
  getAdminOffsets,
  saveAdminOffsets,
  type OffsetRow,
} from "@/lib/admin.functions";
import {
  adminListAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  type DbProduct,
} from "@/lib/products.functions";
import { CATEGORIES } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AdminPage() {
  const fetchOffsets = useServerFn(getAdminOffsets);
  const saveOffsets = useServerFn(saveAdminOffsets);
  const fetchProducts = useServerFn(adminListAllProducts);

  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>(makeEmptyForm);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [tab, setTab] = useState<"rates" | "products">("products");

  async function refreshProducts(pw: string) {
    const res = await fetchProducts({ data: { password: pw } });
    if (res.ok) setProducts(res.products);
  }

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
      await refreshProducts(password);
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
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setTab("products")}
            className={`px-5 py-3 font-ui text-xs uppercase tracking-widest transition-colors ${
              tab === "products"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Ürünler & Fotoğraflar
          </button>
          <button
            onClick={() => setTab("rates")}
            className={`px-5 py-3 font-ui text-xs uppercase tracking-widest transition-colors ${
              tab === "rates"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Kur Farkları
          </button>
        </div>

        {tab === "rates" ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-3xl text-gradient-gold">
                  Fiyat Farkı Yönetimi
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Canlı kurpano fiyatlarına eklenecek TL farkını girin.
                </p>
              </div>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
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
          </>
        ) : (
          <ProductsManager
            password={password}
            products={products}
            onChanged={() => refreshProducts(password)}
          />
        )}
      </div>
    </main>
  );
}

function ProductsManager({
  password,
  products,
  onChanged,
}: {
  password: string;
  products: DbProduct[];
  onChanged: () => void | Promise<void>;
}) {
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [adding, setAdding] = useState(false);

  const grouped = CATEGORIES.map((c) => ({
    category: c,
    items: products.filter((p) => p.category_slug === c.slug),
  }));

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-gradient-gold">Ürün Yönetimi</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kategoriye fotoğraf ekleyin, açıklamayı düzenleyin veya silin.
          </p>
        </div>
        <Button onClick={() => setAdding(true)} className="gap-2">
          <Plus size={16} /> Yeni Ürün
        </Button>
      </div>

      <div className="space-y-8">
        {grouped.map(({ category, items }) => (
          <div key={category.slug} className="bg-card border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-gold-pale">
                {category.icon} {category.name}
                <span className="ml-3 font-ui text-[10px] text-muted-foreground">
                  {items.length} ürün
                </span>
              </h2>
            </div>
            {items.length === 0 ? (
              <p className="font-serif italic text-sm text-muted-foreground">
                Henüz ürün yok.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((p) => (
                  <div key={p.id} className="border border-border bg-background">
                    <div className="aspect-square bg-gradient-to-br from-background to-card flex items-center justify-center overflow-hidden">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-primary/40" size={40} strokeWidth={1} />
                      )}
                    </div>
                    <div className="p-3">
                      <div className="font-display text-sm text-foreground truncate">{p.name}</div>
                      <div className="font-serif italic text-xs text-muted-foreground line-clamp-2 mt-1">
                        {p.description || "—"}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 gap-1"
                          onClick={() => setEditing(p)}
                        >
                          <Pencil size={12} /> Düzenle
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={async () => {
                            if (!confirm(`"${p.name}" silinsin mi?`)) return;
                            const res = await deleteProduct({
                              data: { password, id: p.id },
                            });
                            if (!res.ok) toast.error(res.error || "Silinemedi");
                            else {
                              toast.success("Silindi");
                              await onChanged();
                            }
                          }}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {adding && (
        <ProductDialog
          password={password}
          mode="add"
          onClose={() => setAdding(false)}
          onSaved={async () => {
            setAdding(false);
            await onChanged();
          }}
        />
      )}
      {editing && (
        <ProductDialog
          password={password}
          mode="edit"
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await onChanged();
          }}
        />
      )}
    </>
  );
}

function ProductDialog({
  password,
  mode,
  initial,
  onClose,
  onSaved,
}: {
  password: string;
  mode: "add" | "edit";
  initial?: DbProduct;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [categorySlug, setCategorySlug] = useState(
    initial?.category_slug ?? CATEGORIES[0].slug,
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.image_url ?? null);
  const [removeImage, setRemoveImage] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File | null) {
    setFile(f);
    setRemoveImage(false);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(initial?.image_url ?? null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      let image_base64: string | undefined;
      if (file) {
        image_base64 = await fileToBase64(file);
      }
      if (mode === "add") {
        const res = await addProduct({
          data: {
            password,
            category_slug: categorySlug,
            name,
            description,
            image_base64,
            image_filename: file?.name,
            image_content_type: file?.type,
          },
        });
        if (!res.ok) {
          toast.error(res.error || "Eklenemedi");
          return;
        }
        toast.success("Ürün eklendi");
      } else if (initial) {
        const res = await updateProduct({
          data: {
            password,
            id: initial.id,
            name,
            description,
            image_base64,
            image_filename: file?.name,
            image_content_type: file?.type,
            remove_image: removeImage && !file,
          },
        });
        if (!res.ok) {
          toast.error(res.error || "Güncellenemedi");
          return;
        }
        toast.success("Güncellendi");
      }
      await onSaved();
    } catch (err) {
      toast.error((err as Error).message || "Bir hata oluştu");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg bg-card border-border">
        <DialogTitle className="font-display text-xl text-gradient-gold">
          {mode === "add" ? "Yeni Ürün" : "Ürünü Düzenle"}
        </DialogTitle>
        <DialogDescription className="sr-only">Ürün formu</DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "add" && (
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select value={categorySlug} onValueChange={setCategorySlug}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.icon} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Ürün Adı</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} />
          </div>
          <div className="space-y-2">
            <Label>Açıklama</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Fotoğraf</Label>
            <div className="flex items-start gap-3">
              <div className="w-24 h-24 border border-border bg-background flex items-center justify-center overflow-hidden flex-shrink-0">
                {preview && !removeImage ? (
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-primary/40" size={28} strokeWidth={1} />
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 w-full"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload size={14} /> {preview && !removeImage ? "Değiştir" : "Yükle"}
                </Button>
                {mode === "edit" && initial?.image_path && !file && !removeImage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full text-destructive"
                    onClick={() => {
                      setRemoveImage(true);
                      setPreview(null);
                    }}
                  >
                    <X size={14} /> Fotoğrafı Kaldır
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={busy} className="flex-1 gap-2">
              {busy ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Kaydet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
