# Editing your portfolio without Figma Make

## Easiest: Pages CMS (forms, no code)

1. Go to https://app.pagescms.org and sign in with GitHub.
2. Open this repository. You'll see **Site text** (home, about, contact, resume) and **Projects**.
3. Change text, upload images, add or reorder projects, then click **Save**.
4. Each Save is a commit to GitHub; the site redeploys automatically in about a minute.

Uploaded images go into `public/`. The setup for these forms is in `.pages.yml`.
Every section with pictures has a **Picture size** option: Default, Large (1 per row), Medium (2 per row) or Small (3 per row). Phones always show 1 per row. Extra sections (like Expansion mechanism) can have pictures too.
Layout and design changes (fonts, colors in CSS, page structure) still need code edits.

## Editing the files directly

All text lives in JSON files in `src/content/`. Open them in any editor (VS Code, GitHub's web editor, etc.).

| File | What it controls |
| --- | --- |
| `src/content/portfolio.json` | Palette and every project: title (`t`), subtitle (`m`), category (`cat`: engineering, design, prototyping), cover (`hero`), brief, tools, and the Sketches (`sk`), Prototypes and documentation (`ide`), CAD models (`cad`), Final project (`fin`) sections with their `text` and `images`, plus `vid` (video) and `documents` (PDF downloads). Projects with a `secs` list (Ever Changing Desk, Rink at the Brink) use that list of sections instead. |
| `src/content/site.json` | Home line, About text, contact links, and the full Resume |

- Empty sections are hidden on a project page and the numbering adjusts automatically.
- Images live in `public/` and are referenced by path, for example `/case-studies/red-rover/04.jpg`. Phone Stand and Rink at the Brink use images from `public/kit/` because no other photos were available.
- Resume text in `site.json` mirrors `public/Ahmad-Salman-Resume.pdf`. Replace the PDF with the same file name to update the download.
- Colors and fonts: top of `src/index.css`. Page order and blob colors: `src/portfolio.ts`.

To run locally: `pnpm install` then `pnpm dev`.

Project working files and notes live in `boards/` (see `boards/README.md`); they are not part of the website.

## Boards view

Click the "A" in your name on the home page 5 times quickly, or open `#/boards` directly (both ask for the passcode), to see every project page side by side as artboards. Click one to open it. Adding a project to `portfolio.json` makes a new board appear automatically.

### Editing in the boards view

In `#/boards` you can click Edit on a board to change its text, colors and image paths, use the + card to add a project, and Delete to remove one. These are a **draft saved in your browser only**. To publish: click "Download portfolio.json", replace `src/content/portfolio.json` with the downloaded file, and push. "Discard draft" returns to the published content. Image files still need to be added to `public/` yourself.

### Section headings

Headings such as "Sketches" and "CAD models" are now text in `src/content/portfolio.json` under `sectionTitles` (applies to every project). To rename one for a single project, add `"titles": { "sk": "Early ideas" }` to that project (keys: brief, tools, sk, ide, cad, tech, fin, vid, docs).
