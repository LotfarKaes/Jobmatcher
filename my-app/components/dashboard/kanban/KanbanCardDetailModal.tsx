"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  KANBAN_COLUMNS,
  type KanbanBadge,
  type KanbanCardData,
  type KanbanStageId,
} from "@/lib/dashboard/kanban-content";

export type KanbanCardSavePayload = {
  card: KanbanCardData;
  stageId: KanbanStageId;
};

type KanbanCardDetailModalProps = {
  open: boolean;
  card: KanbanCardData;
  stageId: KanbanStageId;
  onClose: () => void;
  onSave: (payload: KanbanCardSavePayload) => void;
  onDelete: (cardId: string) => void;
};

/** Popup: view shows all fields (read-only); Edit unlocks the same fields. */
export function KanbanCardDetailModal({
  open,
  card,
  stageId,
  onClose,
  onSave,
  onDelete,
}: KanbanCardDetailModalProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(card);
  const [draftStage, setDraftStage] = useState<KanbanStageId>(stageId);

  useEffect(() => {
    if (open) {
      setDraft(card);
      setDraftStage(stageId);
      setEditing(false);
    }
  }, [open, card, stageId]);

  if (!open) {
    return null;
  }

  const stageLabel = KANBAN_COLUMNS.find((c) => c.id === stageId)?.title ?? stageId;

  function handleSave() {
    onSave({
      card: sanitizeCard(draft),
      stageId: draftStage,
    });
    setEditing(false);
    onClose();
  }

  function handleDelete() {
    if (window.confirm(`Delete "${card.title}" at ${card.company}?`)) {
      onDelete(card.id);
      onClose();
    }
  }

  const displayStage = editing ? draftStage : stageId;
  const displayCard = editing ? draft : card;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-midnight/80 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kanban-detail-title"
        className="glass-panel relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl shadow-card"
      >
        <header className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
              {stageLabel} · {editing ? "Edit" : "View"} application
            </p>
            <h2 id="kanban-detail-title" className="mt-1 text-lg font-bold text-white">
              {displayCard.title}
            </h2>
            <p className="text-sm text-white/50">{displayCard.company}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 px-2 py-1 text-sm text-white/60 hover:text-white"
          >
            Close
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-4">
          <CardFieldsForm
            card={displayCard}
            stageId={displayStage}
            readOnly={!editing}
            onChange={setDraft}
            onStageChange={setDraftStage}
          />
        </div>

        <footer className="flex flex-wrap gap-2 border-t border-white/10 px-5 py-4">
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-accent/40"
            >
              Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-midnight hover:bg-accent-bright"
            >
              Save
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-300 hover:bg-rose-500/20"
          >
            Delete
          </button>
          {editing ? (
            <button
              type="button"
              onClick={() => {
                setDraft(card);
                setDraftStage(stageId);
                setEditing(false);
              }}
              className="ml-auto text-sm text-white/50 hover:text-white"
            >
              Cancel edit
            </button>
          ) : null}
        </footer>
      </div>
    </div>
  );
}

function sanitizeCard(draft: KanbanCardData): KanbanCardData {
  return {
    ...draft,
    matchPercent: draft.matchPercent === undefined || Number.isNaN(draft.matchPercent as number)
      ? undefined
      : draft.matchPercent,
    description: draft.description?.trim() || undefined,
    footer: draft.footer?.trim() || undefined,
    actionLink: draft.actionLink?.trim() || undefined,
    deadline: draft.deadline?.trim() || undefined,
    interviewEvent:
      draft.interviewEvent?.title?.trim() && draft.interviewEvent?.when?.trim()
        ? {
            title: draft.interviewEvent.title.trim(),
            when: draft.interviewEvent.when.trim(),
          }
        : undefined,
    badges: draft.badges?.length ? draft.badges : undefined,
  };
}

/** One form used for View (read-only) and Edit (editable). */
function CardFieldsForm({
  card,
  stageId,
  readOnly,
  onChange,
  onStageChange,
}: {
  card: KanbanCardData;
  stageId: KanbanStageId;
  readOnly: boolean;
  onChange: (c: KanbanCardData) => void;
  onStageChange: (s: KanbanStageId) => void;
}) {
  const badgeLine = card.badges?.map((b) => b.label).join(", ") ?? "";

  const set = (patch: Partial<KanbanCardData>) => onChange({ ...card, ...patch });

  return (
    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
      <Field label="Stage">
        {readOnly ? (
          <ReadOnlyBox>{KANBAN_COLUMNS.find((c) => c.id === stageId)?.title ?? stageId}</ReadOnlyBox>
        ) : (
          <select
            value={stageId}
            onChange={(e) => onStageChange(e.target.value as KanbanStageId)}
            className={inputClass}
          >
            {KANBAN_COLUMNS.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
        )}
      </Field>

      <Field label="Company">
        <TextControl
          readOnly={readOnly}
          value={card.company}
          onChange={(v) => set({ company: v })}
        />
      </Field>

      <Field label="Job title">
        <TextControl
          readOnly={readOnly}
          value={card.title}
          onChange={(v) => set({ title: v })}
        />
      </Field>

      <Field label="Match %">
        <TextControl
          readOnly={readOnly}
          value={card.matchPercent != null ? String(card.matchPercent) : ""}
          onChange={(v) => set({ matchPercent: v === "" ? undefined : Number(v) })}
          inputMode="numeric"
        />
      </Field>

      <Field label="Description">
        <TextAreaControl
          readOnly={readOnly}
          value={card.description ?? ""}
          onChange={(v) => set({ description: v || undefined })}
        />
      </Field>

      <Field label="Footer note">
        <TextControl
          readOnly={readOnly}
          value={card.footer ?? ""}
          onChange={(v) => set({ footer: v || undefined })}
        />
      </Field>

      <Field label="Action link label">
        <TextControl
          readOnly={readOnly}
          value={card.actionLink ?? ""}
          onChange={(v) => set({ actionLink: v || undefined })}
        />
      </Field>

      <Field label="Badge label">
        <TextControl
          readOnly={readOnly}
          value={badgeLine}
          onChange={(v) => {
            const tone: KanbanBadge["tone"] = card.badges?.[0]?.tone ?? "accent";
            set({
              badges: v.trim() ? [{ label: v.trim(), tone }] : undefined,
            });
          }}
        />
      </Field>

      <Field label="Interview title">
        <TextControl
          readOnly={readOnly}
          value={card.interviewEvent?.title ?? ""}
          onChange={(v) =>
            set({
              interviewEvent: {
                title: v,
                when: card.interviewEvent?.when ?? "",
              },
            })
          }
        />
      </Field>

      <Field label="Interview time">
        <TextControl
          readOnly={readOnly}
          value={card.interviewEvent?.when ?? ""}
          onChange={(v) =>
            set({
              interviewEvent: {
                title: card.interviewEvent?.title ?? "",
                when: v,
              },
            })
          }
        />
      </Field>

      <Field label="Deadline">
        <TextControl
          readOnly={readOnly}
          value={card.deadline ?? ""}
          onChange={(v) => set({ deadline: v || undefined })}
        />
      </Field>

    </form>
  );
}

function TextControl({
  readOnly,
  value,
  onChange,
  inputMode,
}: {
  readOnly: boolean;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "numeric" | "text";
}) {
  if (readOnly) {
    return <ReadOnlyBox>{value || "—"}</ReadOnlyBox>;
  }
  return (
    <input
      className={inputClass}
      value={value}
      inputMode={inputMode}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function TextAreaControl({
  readOnly,
  value,
  onChange,
}: {
  readOnly: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  if (readOnly) {
    return <ReadOnlyBox className="min-h-[4.5rem] whitespace-pre-wrap">{value || "—"}</ReadOnlyBox>;
  }
  return (
    <textarea
      rows={3}
      className={inputClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function ReadOnlyBox({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-midnight/70 px-3 py-2 text-sm text-white/85 ${className}`}
    >
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-white/70">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/15 bg-midnight px-3 py-2 text-sm text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";