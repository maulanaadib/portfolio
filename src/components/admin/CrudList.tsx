"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type FieldConfig =
  | { name: string; label: string; type: "text" | "textarea" | "number" | "url" | "checkbox"; placeholder?: string; required?: boolean }
  | { name: string; label: string; type: "select"; options: { label: string; value: string }[]; required?: boolean };

export type CrudItem = Record<string, unknown> & { id?: string };

type Props = {
  title: string;
  description?: string;
  apiBase: string;
  fields: FieldConfig[];
  initial: CrudItem[];
  emptyItem: () => CrudItem;
  transform?: (item: CrudItem) => CrudItem;
  itemKey?: (item: CrudItem) => string;
};

export function CrudList({
  title,
  description,
  apiBase,
  fields,
  initial,
  emptyItem,
  transform = (x) => x,
  itemKey,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<CrudItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { setItems(initial); }, [initial]);

  function startCreate() { setEditing(emptyItem()); setShowForm(true); setError(""); }
  function startEdit(item: CrudItem) { setEditing({ ...item }); setShowForm(true); setError(""); }
  function cancel() { setEditing(null); setShowForm(false); setError(""); }

  async function save() {
    if (!editing) return;
    setSaving(true); setError("");
    try {
      const id = editing.id;
      const isUpdate = typeof id === "string" && id.length > 0;
      const url = isUpdate ? `${apiBase}/${id}` : apiBase;
      const method = isUpdate ? "PUT" : "POST";
      const payload = transform(editing);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(typeof data.error === "string" ? data.error : "Failed to save");
      }
      cancel();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Failed to delete");
  }

  const editingHasId = editing && typeof editing.id === "string" && editing.id.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && <p className="text-[rgb(var(--muted))] mt-1">{description}</p>}
        </div>
        <button onClick={startCreate} className="btn-primary">+ Add new</button>
      </div>

      {showForm && editing && (
        <div className="mt-6 card p-6">
          <h2 className="font-semibold mb-4">{editingHasId ? "Edit" : "Create new"}</h2>
          <div className="space-y-4">
            {fields.map((f) => {
              const value = editing[f.name];
              if (f.type === "textarea") {
                return (
                  <div key={f.name}>
                    <label className="label">{f.label}</label>
                    <textarea
                      className="input"
                      rows={4}
                      value={String(value ?? "")}
                      onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                      placeholder={f.placeholder}
                      required={f.required}
                    />
                  </div>
                );
              }
              if (f.type === "checkbox") {
                return (
                  <label key={f.name} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(e) => setEditing({ ...editing, [f.name]: e.target.checked })}
                    />
                    <span className="text-sm">{f.label}</span>
                  </label>
                );
              }
              if (f.type === "select") {
                return (
                  <div key={f.name}>
                    <label className="label">{f.label}</label>
                    <select
                      className="input"
                      value={String(value ?? "")}
                      onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                      required={f.required}
                    >
                      {f.options.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                );
              }
              return (
                <div key={f.name}>
                  <label className="label">{f.label}</label>
                  <input
                    type={f.type}
                    className="input"
                    value={String(value ?? "")}
                    onChange={(e) => {
                      const v = f.type === "number" ? Number(e.target.value) : e.target.value;
                      setEditing({ ...editing, [f.name]: v });
                    }}
                    placeholder={f.placeholder}
                    required={f.required}
                  />
                </div>
              );
            })}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <button onClick={save} disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={cancel} disabled={saving} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-2">
        {items.length === 0 ? (
          <div className="card p-8 text-center text-[rgb(var(--muted))]">
            No items yet. Click "Add new" to get started.
          </div>
        ) : (
          items.map((item) => (
            <div key={String(item.id)} className="card p-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">
                  {itemKey
                    ? itemKey(item)
                    : String(item.name ?? item.title ?? item.id)}
                </div>
                {item.description != null && String(item.description).length > 0 && (
                  <div className="text-sm text-[rgb(var(--muted))] truncate">
                    {String(item.description)}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => startEdit(item)} className="btn-secondary text-sm py-1.5 px-3">Edit</button>
                <button onClick={() => remove(String(item.id))} className="btn-danger text-sm py-1.5 px-3">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
