import { useState } from "react";
import type { Category, Project } from "./portfolio";

type Block = { text?: string | null; images: string[] };
const blockKeys = [
  ["sk", "Sketches"],
  ["ide", "Prototypes and documentation"],
  ["cad", "CAD models"],
  ["tech", "Technical drawings"],
  ["fin", "Final project"],
] as const;

const lines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="ed-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function BlockEditor({
  title,
  block,
  onChange,
}: {
  title: string;
  block: Block;
  onChange: (block: Block) => void;
}) {
  return (
    <fieldset className="ed-block">
      <legend>{title}</legend>
      <Field label="Text (HTML allowed)">
        <textarea
          rows={4}
          value={block.text ?? ""}
          onChange={(e) => onChange({ ...block, text: e.target.value || null })}
        />
      </Field>
      <Field label="Image paths, one per line">
        <textarea
          rows={3}
          defaultValue={block.images.join("\n")}
          onBlur={(e) => onChange({ ...block, images: lines(e.target.value) })}
        />
      </Field>
    </fieldset>
  );
}

export function ProjectEditor({
  project,
  onChange,
  onClose,
}: {
  project: Project;
  onChange: (project: Project) => void;
  onClose: () => void;
}) {
  const [raw, setRaw] = useState<string | null>(null);
  const [rawError, setRawError] = useState("");
  const set = (patch: Partial<Project>) => onChange({ ...project, ...patch });

  return (
    <aside className="ed" role="dialog" aria-label={`Edit ${project.t}`}>
      <div className="ed-head">
        <b>Edit board</b>
        <button type="button" onClick={onClose}>
          Done
        </button>
      </div>

      {raw === null ? (
        <>
          <Field label="Title">
            <input value={project.t} onChange={(e) => set({ t: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <input value={project.m} onChange={(e) => set({ m: e.target.value })} />
          </Field>
          <Field label="Category">
            <select
              value={project.cat}
              onChange={(e) => set({ cat: e.target.value as Category })}
            >
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="prototyping">Rapid Prototyping</option>
            </select>
          </Field>
          <Field label="Cover image path">
            <input value={project.hero ?? ""} onChange={(e) => set({ hero: e.target.value || null })} />
          </Field>
          <div className="ed-row">
            <Field label="Page color">
              <input value={project.bg ?? ""} placeholder="#e1d6cc" onChange={(e) => set({ bg: e.target.value || undefined })} />
            </Field>
            <Field label="Text color">
              <input value={project.fg ?? ""} placeholder="#341e09" onChange={(e) => set({ fg: e.target.value || undefined })} />
            </Field>
          </div>
          <Field label="Project brief (HTML allowed)">
            <textarea rows={6} value={project.brief ?? ""} onChange={(e) => set({ brief: e.target.value })} />
          </Field>
          <Field label="Tools, comma separated">
            <input
              defaultValue={(project.tools ?? []).join(", ")}
              onBlur={(e) =>
                set({ tools: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
              }
            />
          </Field>

          {project.secs
            ? project.secs.map((sec, i) => (
                <BlockEditor
                  key={i}
                  title={sec.title}
                  block={sec}
                  onChange={(block) =>
                    set({ secs: project.secs!.map((s, j) => (j === i ? { ...s, ...block } : s)) })
                  }
                />
              ))
            : blockKeys.map(([key, title]) => (
                <BlockEditor
                  key={key}
                  title={title}
                  block={project[key] ?? { text: null, images: [] }}
                  onChange={(block) => set({ [key]: block } as Partial<Project>)}
                />
              ))}

          <button
            type="button"
            className="ed-link"
            onClick={() => setRaw(JSON.stringify(project, null, 2))}
          >
            Advanced: edit raw JSON
          </button>
        </>
      ) : (
        <>
          <textarea
            className="ed-raw"
            rows={26}
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              try {
                onChange(JSON.parse(e.target.value) as Project);
                setRawError("");
              } catch {
                setRawError("Invalid JSON, not applied yet.");
              }
            }}
          />
          {rawError && <p className="ed-error">{rawError}</p>}
          <button type="button" className="ed-link" onClick={() => setRaw(null)}>
            Back to form
          </button>
        </>
      )}
    </aside>
  );
}
