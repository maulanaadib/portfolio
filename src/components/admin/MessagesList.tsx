"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  id: string; name: string; email: string; subject: string | null;
  content: string; read: boolean; createdAt: string | Date;
};

export function MessagesList({ initial }: { initial: Message[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filtered = initial.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "read") return m.read;
    return true;
  });

  async function toggleRead(m: Message) {
    await fetch(`/api/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !m.read }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-[rgb(var(--muted))] mt-1">Contact form submissions from your site</p>
        </div>
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm capitalize ${
                filter === f ? "bg-accent-500 text-white" : "btn-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center text-[rgb(var(--muted))]">
            No messages yet.
          </div>
        ) : (
          filtered.map((m) => (
            <div key={m.id} className={`card p-4 ${!m.read ? "border-accent-500/50 bg-accent-500/5" : ""}`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-sm text-[rgb(var(--muted))]">&lt;{m.email}&gt;</span>
                    {!m.read && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500 text-white">NEW</span>
                    )}
                  </div>
                  {m.subject && <div className="text-sm font-medium mt-1">Subject: {m.subject}</div>}
                  <p className="text-sm text-[rgb(var(--muted))] mt-2 whitespace-pre-line">{m.content}</p>
                  <div className="text-xs text-[rgb(var(--muted))] mt-2">
                    {new Date(m.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a href={`mailto:${m.email}`} className="btn-secondary text-sm py-1.5 px-3">Reply</a>
                  <button onClick={() => toggleRead(m)} className="btn-secondary text-sm py-1.5 px-3">
                    {m.read ? "Mark unread" : "Mark read"}
                  </button>
                  <button onClick={() => remove(m.id)} className="btn-danger text-sm py-1.5 px-3">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
