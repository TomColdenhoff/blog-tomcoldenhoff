# tomcoldenhoff.com

Personal site source: [Hugo](https://gohugo.io/) with the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme (git submodule at `themes/PaperMod`).

Planning and BMAD artifacts live under `_bmad-output/` and `_bmad/`; they are separate from the Hugo site.

## Prerequisites

- **Hugo Extended** (Homebrew installs Extended by default). Confirmed version for this baseline:

  ```text
  hugo v0.158.0+extended+withdeploy darwin/arm64 BuildDate=2026-03-16T17:42:04Z VendorInfo=Homebrew
  ```

  Check locally: `hugo version`

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
