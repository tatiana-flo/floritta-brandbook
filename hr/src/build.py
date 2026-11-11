#!/usr/bin/env python3
"""Build index.html = shell.html + screens/*.html (sorted). Run from this folder."""
import pathlib

here = pathlib.Path(__file__).resolve().parent
shell = (here / "shell.html").read_text(encoding="utf-8")
parts = []
for f in sorted((here / "screens").glob("*.html")):
    parts.append(f"\n<!-- ===== {f.name} ===== -->\n" + f.read_text(encoding="utf-8"))
out = shell.replace("<!--SCREENS-->", "\n".join(parts))
(here / "index.html").write_text(out, encoding="utf-8")
print(f"index.html: {len(out):,} bytes from {len(parts)} screen files")
