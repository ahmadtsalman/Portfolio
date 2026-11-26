# Editing your portfolio without Figma Make

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
