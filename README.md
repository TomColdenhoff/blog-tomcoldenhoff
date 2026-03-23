# tomcoldenhoff.com

Personal site source: [Hugo](https://gohugo.io/) with the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme (git submodule at `themes/PaperMod`).

Planning and BMAD artifacts live under `_bmad-output/` and `_bmad/`; they are separate from the Hugo site.

## Prerequisites

- **Hugo Extended** — baseline targets **0.158.0** or newer (any OS/CI). Install from [Hugo’s documentation](https://gohugo.io/installation/) for your platform; confirm the binary is Extended:

  ```bash
  hugo version
  ```

  The output must include `extended` (required for this theme and typical asset pipelines).

- **Git** with submodule support (`git submodule update --init --recursive` after clone).

## Commands

```bash
# Development server
hugo server

# Production build (output in public/, gitignored)
hugo
```

## Theme

PaperMod is added as a submodule; do not copy theme files into the repo. Update the submodule pointer when you intentionally upgrade the theme.
