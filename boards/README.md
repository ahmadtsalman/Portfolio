# Project boards

One folder per project, kept separate from the portfolio build (`src/`, `public/`). Each board is a working space for that project: links, files, notes and next steps. Nothing here ships on the website.

```
boards/
  <project-slug>/
    board.md     brief, source links, status, notes
    files/       drop CAD, sketches, photos, PDFs here
  _template/board.md   copy this for a new project
```

## Source files
All project files: https://cmu.box.com/s/9ndyk7qp4fkcdqi81q2uylwpihclj3kx
That Box link sits behind CMU login, so it can't be opened automatically. Download what you need from Box and put it in the matching `files/` folder.

## Using a board with Claude
Open the project's folder (or attach `board.md` plus the files in `files/`) in Claude so it has the brief, links and files in one place. Keep `board.md` current so a new session can continue your workflow.

## Moving a file onto the website
Copy the image into `public/case-studies/<slug>/`, then list its path under `sk`, `cad`, `ide` or `fin` (in `images`) for that project in `src/content/portfolio.json`.
