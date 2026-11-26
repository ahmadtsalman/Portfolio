import { useEffect, useRef, useState } from "react";
import site from "./content/site.json";
import {
  blobs,
  pages,
  palette,
  projects,
  sectionsOf,
  sheetColors,
  src,
  type Category,
  type Project,
} from "./portfolio";

type Entry = {
  title?: string;
  right?: string;
  lines?: { left: string; right: string }[];
  note?: string;
  bullets?: string[];
  skills?: { label: string; value: string }[];
};

const categories: Category[] = ["engineering", "design", "prototyping"];
const pageName = (id: string) => pages.find((page) => page.id === id)?.name ?? "Home";

/* ---------- Background ---------- */

function Blobs({ page }: { page: string }) {
  const [a, b, c] = blobs[page] ?? blobs.home;
  return (
    <div
      className="bg"
      aria-hidden="true"
      style={{ "--b1": a, "--b2": b, "--b3": c } as React.CSSProperties}
    >
      <i className="blob blob-1" />
      <i className="blob blob-2" />
      <i className="blob blob-3" />
    </div>
  );
}

/* ---------- Menu ---------- */

const cardColors: [string, string][] = [
  [palette.cane, palette.secret],
  [palette.espresso, palette.cane],
  [palette.bat, palette.secret],
  [palette.secret, palette.cane],
  [palette.cane, palette.secret],
  [palette.espresso, palette.cane],
];

function Menu({ current }: { current: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <div className="menu" ref={ref}>
      <button
        type="button"
        className="menu-pill"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{pageName(current)}</span>
        <b>Menu</b>
      </button>
      {open && (
        <ul className="menu-stack" style={{ height: pages.length * 58 + 26 }}>
          {pages.map((page, i) => {
            const [bg, fg] = cardColors[i];
            return (
              <li
                key={page.id}
                style={
                  {
                    "--i": i,
                    background: bg,
                    color: fg,
                    borderColor: palette.cane,
                    zIndex: i + 1,
                  } as React.CSSProperties
                }
              >
                <a
                  href={page.id === "home" ? "#/" : `#/${page.id}`}
                  aria-current={page.id === current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {page.name}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ---------- Pages ---------- */

function Home() {
  return (
    <section className="page home">
      <h1>
        {site.hero.name[0]}
        <br />
        {site.hero.name[1]}
      </h1>
      <img className="portrait" src={src("/kit/portrait.jpg")} alt="Ahmad Salman" />
      <p className="sub">{site.hero.line}</p>
    </section>
  );
}

function ResumeEntry({ entry }: { entry: Entry }) {
  if (entry.skills) {
    return (
      <div className="resume-entry">
        {entry.skills.map((skill) => (
          <p key={skill.label}>
            <strong>{skill.label}:</strong> {skill.value}
          </p>
        ))}
      </div>
    );
  }
  return (
    <div className="resume-entry">
      <div className="resume-row">
        <h4>{entry.title}</h4>
        {entry.right && <span>{entry.right}</span>}
      </div>
      {entry.lines?.map((line) => (
        <div className="resume-row" key={line.left}>
          <p>{line.left}</p>
          <span>{line.right}</span>
        </div>
      ))}
      {entry.note && <p>{entry.note}</p>}
      {entry.bullets && (
        <ul>
          {entry.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function About() {
  return (
    <section className="page">
      <h2>{site.about.heading}</h2>
      {site.about.paragraphs.map((paragraph) => (
        <p className="body" key={paragraph}>
          {paragraph}
        </p>
      ))}
      <h2 className="resume-title">Resume</h2>
      <div className="resume">
        <header>
          <h3>{site.name}</h3>
          <p>{site.resume.contact.join(" | ")}</p>
        </header>
        {(site.resume.sections as { title: string; entries: Entry[] }[]).map((section) => (
          <div className="resume-block" key={section.title}>
            <h4>{section.title}</h4>
            {section.entries.map((entry, i) => (
              <ResumeEntry entry={entry} key={entry.title || i} />
            ))}
          </div>
        ))}
        <a className="btn" href={src(site.resume.file)} download="Ahmad-Salman-Resume.pdf">
          Download resume PDF
        </a>
      </div>
    </section>
  );
}

function Tile({ project, index }: { project: Project; index: number }) {
  const strips: [string, string][] = [
    [palette.espresso, palette.cane],
    [palette.cane, palette.secret],
    [palette.bat, palette.secret],
  ];
  const [bg, fg] = strips[index % strips.length];
  return (
    <a
      className={`tile${index === 0 ? " wide" : ""}${project.hero ? "" : " plain"}`}
      href={`#/project/${project.id}`}
      style={{ background: bg, color: fg }}
    >
      {project.hero && <img src={src(project.hero)} alt="" loading={index > 3 ? "lazy" : "eager"} />}
      <div className="tile-strip">
        <b>{project.t}</b>
        {project.m && <small>{project.m}</small>}
      </div>
    </a>
  );
}

function CategoryPage({ id }: { id: Category }) {
  const items = projects.filter((project) => project.cat === id);
  return (
    <section className="page">
      <div className="hint-wrap">
        <div className="hint-head">
          <h2 className="hint-title" tabIndex={0} aria-describedby={`hint-${id}`}>
            {pageName(id)}
          </h2>
          <svg className="hint-arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7l10 10M17 8v9H8" />
          </svg>
        </div>
        <p className="hint" id={`hint-${id}`} role="tooltip">
          {(site.hints as Record<string, string>)[id]}
        </p>
      </div>
      <div className="grid">
        {items.map((project, i) => (
          <Tile key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

const icons = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z",
  medium:
    "M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z",
  mail: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
};

function Contact() {
  const links = [
    { label: "LinkedIn", href: site.contact.linkedin, path: icons.linkedin, external: true },
    { label: "Medium", href: site.contact.medium, path: icons.medium, external: true },
    { label: "Email", href: `mailto:${site.contact.email}`, path: icons.mail, external: false },
  ];
  return (
    <section className="page">
      <h2>Contact</h2>
      <p className="sub">{site.contact.email}</p>
      <div className="links">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={link.path} />
            </svg>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- Project sheet ---------- */

function Sheet({ project }: { project: Project }) {
  // Background and text colors come from the project's own cover image.
  const [bg, fg] = project.bg && project.fg ? [project.bg, project.fg] : sheetColors[project.cat];
  const sections = sectionsOf(project);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") window.location.hash = `#/${project.cat}`;
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [project]);

  return (
    <article
      className="sheet"
      style={{ background: bg, color: fg, "--ink": fg, "--sbg": bg } as React.CSSProperties}
      key={project.id}
    >
      <div className="sheet-inner">
        <a className="back" href={`#/${project.cat}`}>
          Back
        </a>
        <h1>{project.t}</h1>
        {project.m && <p className="sub">{project.m}</p>}
        {project.hero && <img className="sheet-hero" src={src(project.hero)} alt={project.t} />}
        {sections.map((section, i) => (
          <section className="sec" key={section.title}>
            <h3>
              <i>{String(i + 1).padStart(2, "0")}</i>
              {section.title}
            </h3>
            {section.text && (
              <p className="body" dangerouslySetInnerHTML={{ __html: section.text }} />
            )}
            {section.chips && (
              <div className="chips">
                {section.chips.map((chip) => (
                  <span key={chip}>{chip}</span>
                ))}
              </div>
            )}
            {section.images && section.images.length > 0 && (
              <div className={`gal${section.twoAcross ? " two" : ""}`}>
                {section.images.map((image) => (
                  <img key={image} src={src(image)} alt="" loading="lazy" />
                ))}
              </div>
            )}
            {section.video && (
              <video className="video" src={src(section.video)} controls playsInline preload="metadata" />
            )}
            {section.documents && (
              <div className="docs">
                {section.documents.map((doc) => (
                  <a
                    className="btn"
                    key={doc.file}
                    href={src(doc.file)}
                    download={doc.file.split("/").pop()}
                  >
                    {doc.title}: Download PDF
                  </a>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}

/* ---------- App ---------- */

export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const projectId = hash.match(/^#\/project\/(.+)$/)?.[1];
  const project = projects.find((item) => item.id === projectId);
  const routeId = hash.replace(/^#\//, "");
  const page = project
    ? project.cat
    : pages.some((item) => item.id === routeId)
      ? routeId
      : "home";

  useEffect(() => {
    if (!project) window.scrollTo(0, 0);
  }, [page, project]);

  useEffect(() => {
    document.body.style.overflow = project ? "hidden" : "";
  }, [project]);

  return (
    <>
      <Blobs page={page} />
      <Menu current={page} />
      <main>
        {page === "home" && <Home />}
        {page === "about" && <About />}
        {categories.includes(page as Category) && <CategoryPage id={page as Category} />}
        {page === "contact" && <Contact />}
      </main>
      {project && <Sheet project={project} />}
    </>
  );
}
