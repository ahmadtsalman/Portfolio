import data from "./content/portfolio.json";

export type Category = "engineering" | "design" | "prototyping";

type Block = { text?: string | null; images: string[] };
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
  fin: Block;
  vid?: string;
  documents?: { title: string; file: string }[];
  extra?: { title: string; text: string }[];
  secs?: { title: string; text?: string | null; images: string[] }[];
};

export type Section = {
  title: string;
  text?: string | null;
  images?: string[];
  chips?: string[];
  video?: string;
  documents?: { title: string; file: string }[];
  twoAcross?: boolean;
};

export const palette = {
  bat: data.palette["Bat Wing"],
  espresso: data.palette["Espresso Martini"],
  cane: data.palette["Cane Sugar"],
  secret: data.palette["Secret Passage"],
};

export const projects = data.projects as unknown as Project[];

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
export const src = (path: string) => import.meta.env.BASE_URL.replace(/\/$/, "") + path;

// Sections in order; empty ones are dropped so the numbering stays continuous.
export function sectionsOf(p: Project): Section[] {
  if (p.secs) {
    return p.secs
      .filter((s) => s.text || s.images.length)
      .map((s) => ({ title: s.title, text: s.text, images: s.images, twoAcross: true }));
  }
  const out: Section[] = [];
  if (p.brief) out.push({ title: "Project brief", text: p.brief });
  if (p.tools?.length) out.push({ title: "Tools used", chips: p.tools });
  p.extra?.forEach((e) => out.push({ title: e.title, text: e.text }));
  const blocks: [string, Block][] = [
    ["Sketches", p.sk],
    ["Prototypes and documentation", p.ide],
    ["CAD models", p.cad],
    ["Final project", p.fin],
  ];
  blocks.forEach(([title, b]) => {
    if (b.text || b.images.length) out.push({ title, text: b.text, images: b.images });
  });
  if (p.vid) out.push({ title: "Video", video: p.vid });
  if (p.documents?.length) out.push({ title: "Documents", documents: p.documents });
  return out;
}
