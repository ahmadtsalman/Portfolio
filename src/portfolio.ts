import data from "./content/portfolio.json";

export type Category = "engineering" | "design" | "prototyping";

// Picture size chosen in the editor: large = 1 per row, medium = 2, small = 3.
export type PictureSize = "default" | "large" | "medium" | "small";
type Block = { text?: string | null; images?: string[]; size?: PictureSize };
export type Project = {
  id: string;
  cat: Category;
  t: string;
  m: string;
  hero: string | null;
  bg?: string;
  fg?: string;
  brief?: string;
  tools?: string[];
  sk: Block;
  ide: Block;
  cad: Block;
  tech?: Block;
  fin: Block;
  vid?: string;
  documents?: { title: string; file: string }[];
  extra?: { title: string; text?: string | null; images?: string[]; size?: PictureSize }[];
  titles?: Partial<Record<string, string>>;
  secs?: { title: string; text?: string | null; images?: string[]; size?: PictureSize }[];
};

export type Section = {
  title: string;
  text?: string | null;
  images?: string[];
  chips?: string[];
  video?: string;
  documents?: { title: string; file: string }[];
  twoAcross?: boolean;
  oneAcross?: boolean;
  size?: PictureSize;
};

export const palette = {
  bat: data.palette["Bat Wing"],
  espresso: data.palette["Espresso Martini"],
  cane: data.palette["Cane Sugar"],
  secret: data.palette["Secret Passage"],
};

// Draft edits made in the boards view live in this browser only (localStorage).
// `projects` is mutated in place so every page sees the draft; the real site
// content is still src/content/portfolio.json.
const DRAFT_KEY = "portfolio-draft-v1";
const baseProjects = data.projects as unknown as Project[];

function loadDraft(): Project[] | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : null;
  } catch {
    return null;
  }
}

export const projects: Project[] = loadDraft() ?? [...baseProjects];

export function updateProjects(next: Project[]) {
  projects.splice(0, projects.length, ...next);
  localStorage.setItem(DRAFT_KEY, JSON.stringify(projects));
}

export const hasDraft = () => localStorage.getItem(DRAFT_KEY) !== null;

export function resetDraft() {
  localStorage.removeItem(DRAFT_KEY);
  projects.splice(0, projects.length, ...baseProjects);
}

export const exportJson = () =>
  JSON.stringify({ palette: data.palette, projects }, null, 2) + "\n";

export const pages = [
  { id: "home", name: "Home" },
  { id: "about", name: "About Me" },
  { id: "engineering", name: "Engineering" },
  { id: "design", name: "Design" },
  { id: "prototyping", name: "Rapid Prototyping" },
  { id: "contact", name: "Contact" },
] as const;

// Blob colors behind each page.
export const blobs: Record<string, string[]> = {
  home: [palette.espresso, palette.bat, palette.cane],
  about: [palette.bat, palette.espresso, palette.secret],
  engineering: [palette.espresso, palette.bat, palette.secret],
  design: [palette.cane, palette.espresso, palette.bat],
  prototyping: [palette.bat, palette.cane, palette.espresso],
  contact: [palette.espresso, palette.cane, palette.secret],
};

// Project sheet colors per category: [background, text].
export const sheetColors: Record<Category, [string, string]> = {
  engineering: [palette.espresso, palette.cane],
  design: [palette.cane, palette.secret],
  prototyping: [palette.bat, palette.secret],
};

// Root-relative path that also works when served from a sub-path.
// Accepts "/kit/a.jpg", "kit/a.jpg" or "//kit/a.jpg" (as editors may save them), and full URLs.
export const src = (path: string) => {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  return import.meta.env.BASE_URL.replace(/\/$/, "") + "/" + path.replace(/^\/+/, "");
};

// Sections in order; empty ones are dropped so the numbering stays continuous.
export function sectionsOf(p: Project): Section[] {
  const defaults = data.sectionTitles as Record<string, string>;
  const T = (key: string) => p.titles?.[key] || defaults[key];
  if (p.secs?.length) {
    return p.secs
      .filter((s) => s.text || s.images?.length)
      .map((s) => ({ title: s.title, text: s.text, images: s.images ?? [], twoAcross: true, size: s.size }));
  }
  const out: Section[] = [];
  if (p.brief) out.push({ title: T("brief"), text: p.brief });
  if (p.tools?.length) out.push({ title: T("tools"), chips: p.tools });
  p.extra?.forEach((e) => {
    if (e && (e.text || e.images?.length))
      out.push({ title: e.title, text: e.text, images: e.images ?? [], size: e.size });
  });
  const blocks: [string, Block | undefined][] = [
    ["sk", p.sk],
    ["ide", p.ide],
    ["cad", p.cad],
    ["tech", p.tech],
    ["fin", p.fin],
  ];
  blocks.forEach(([key, b]) => {
    const title = T(key);
    if (b && (b.text || b.images?.length))
      out.push({ title, text: b.text, images: b.images ?? [], oneAcross: key === "tech", size: b.size });
  });
  if (p.vid) out.push({ title: T("vid"), video: p.vid });
  if (p.documents?.length) out.push({ title: T("docs"), documents: p.documents });
  return out;
}

// CSS class for a section's picture grid. An editor-chosen size wins over the default layout.
export function galleryClass(section: Section): string {
  const bySize: Record<string, string> = { large: " one", medium: " two", small: " three" };
  if (section.size && bySize[section.size]) return "gal" + bySize[section.size];
  return `gal${section.twoAcross ? " two" : ""}${section.oneAcross ? " one" : ""}`;
}
