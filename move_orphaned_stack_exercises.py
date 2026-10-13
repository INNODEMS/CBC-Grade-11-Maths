#!/usr/bin/env python3
"""
Move orphaned STACK <exercise> blocks into their respective sections.

Each <exercise> in ORPHANED_FILE wraps a single <stack source="..."/>
whose `source` attribute encodes which chapter and section it belongs
to, e.g.:

    stack/top/1-numbers-and-algebra/07-matrices-i/04-multiplying-matrices-ii/Foo.xml
                                     ^chapter      ^section

That maps to SOURCE_DIR/07-matrices-i/sec-multiplying-matrices-ii.ptx.

For every section file, this script inserts that section's orphaned
<exercise> elements as the first children of the section's existing
<exercises> ... </exercises> block (right before any pre-existing
static exercises), so the moved STACK exercises sit immediately below
the worked examples without creating a second "Exercises" heading.

Exercises that can't be mapped to a section (unknown chapter/section,
or no <exercises> tag found in the target file) are left behind in
ORPHANED_FILE and reported, instead of being silently dropped.

Usage:
    python3 move_orphaned_stack_exercises.py            # dry run, just reports
    python3 move_orphaned_stack_exercises.py --apply     # writes the changes
"""

import argparse
import re
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Repo root -- everything below is resolved relative to this. Defaults to the
# folder this script lives in, so keep the script at the project root.
REPO_ROOT = Path(__file__).resolve().parent

# Name of the folder (inside REPO_ROOT) that holds every chapter's section
# files, e.g. REPO_ROOT/source/07-matrices-i/sec-multiplying-matrices-ii.ptx
SOURCE_DIR = "source"

# Path (relative to REPO_ROOT) to the file holding the orphaned STACK
# <exercise> blocks that need to be redistributed into SOURCE_DIR.
ORPHANED_FILE = "orphaned_older.ptx"

# Names of the chapter folders inside SOURCE_DIR that should actually be
# touched, e.g. ["07-matrices-i"] or ["07-matrices-i", "16-functions"].
# Only orphaned exercises whose stack `source` path resolves to one of
# these chapters are moved; everything else is left untouched in
# ORPHANED_FILE. Leave empty to process nothing (a safety default --
# this script intentionally will NOT touch every chapter unless you list
# the ones you want here).
TARGET_CHAPTERS: list[str] = ["07-matrices-i"]

# ---------------------------------------------------------------------------

EXERCISE_RE = re.compile(r"[ \t]*<exercise\b[^>]*>.*?</exercise>[ \t]*\n?", re.DOTALL)
STACK_SOURCE_RE = re.compile(r'<stack\b[^>]*\bsource="([^"]+)"')
XML_ID_RE = re.compile(r'xml:id="([^"]+)"')
EXERCISES_OPEN_RE = re.compile(r"<exercises\b[^>]*>")

EXERCISE_INDENT = 8


def resolve_section_file(source_dir: Path, stack_source: str) -> Path | None:
    """Map a stack `source` path to the section .ptx file it belongs to.

    Expects paths shaped like:
        stack/top/<part>/<chapter-folder>/<NN-section-name>/<file>.xml
    Returns None if the path is too short, or no matching chapter
    folder / section file exists.
    """
    parts = stack_source.split("/")
    if len(parts) < 5:
        return None
    chapter, section = parts[3], parts[4]
    chapter_dir = source_dir / chapter
    if not chapter_dir.is_dir():
        return None
    m = re.match(r"^\d+-(.+)$", section)
    section_name = m.group(1) if m else section
    section_file = chapter_dir / f"sec-{section_name}.ptx"
    return section_file if section_file.is_file() else None


def reindent_block(block: str, new_indent: int) -> str:
    """Shift every line of an <exercise>...</exercise> block so its
    opening tag sits at `new_indent` spaces, preserving relative
    nesting of everything inside it."""
    lines = block.rstrip("\n").splitlines()
    first = lines[0]
    old_indent = len(first) - len(first.lstrip(" "))
    out = []
    for line in lines:
        if line.strip() == "":
            out.append("")
            continue
        content = line[old_indent:] if line[:old_indent].strip() == "" else line.lstrip(" ")
        out.append(" " * new_indent + content)
    return "\n".join(out) + "\n"


def insert_exercises(text: str, blocks: list[str]) -> str | None:
    """Insert the orphaned STACK <exercise> elements as the first
    children of the section's existing <exercises> block, so they sit
    immediately below the examples without a second <exercises> /
    "Exercises" heading. Returns None if the file has no <exercises>
    tag to insert into.
    """
    m = EXERCISES_OPEN_RE.search(text)
    if not m:
        return None
    body = "".join(reindent_block(b, EXERCISE_INDENT) for b in blocks)
    return text[: m.end()] + "\n" + body + text[m.end() :]


def describe(block: str) -> str:
    id_m = XML_ID_RE.search(block)
    src_m = STACK_SOURCE_RE.search(block)
    return f"{id_m.group(1) if id_m else '?'} ({src_m.group(1) if src_m else 'no stack source'})"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write the changes. Without this flag, only a preview is printed.",
    )
    args = parser.parse_args()

    source_dir = REPO_ROOT / SOURCE_DIR
    orphaned_path = REPO_ROOT / ORPHANED_FILE

    if not source_dir.is_dir():
        raise SystemExit(f"Source folder not found: {source_dir}")
    if not orphaned_path.is_file():
        raise SystemExit(f"Orphaned file not found: {orphaned_path}")

    if not TARGET_CHAPTERS:
        print("TARGET_CHAPTERS is empty -- nothing to do. Set it to the chapter folder "
              "name(s) under SOURCE_DIR you want to process, e.g. [\"07-matrices-i\"].")
        return

    orphaned_text = orphaned_path.read_text(encoding="utf-8")
    exercise_blocks = EXERCISE_RE.findall(orphaned_text)
    print(f"Found {len(exercise_blocks)} orphaned exercise block(s) in {orphaned_path.name}")
    print(f"Restricting to chapter folder(s): {', '.join(TARGET_CHAPTERS)}\n")

    by_section: dict[Path, list[str]] = {}
    unresolved: list[str] = []
    out_of_scope: list[str] = []

    for block in exercise_blocks:
        m = STACK_SOURCE_RE.search(block)
        stack_source = m.group(1) if m else None
        parts = stack_source.split("/") if stack_source else []
        chapter = parts[3] if len(parts) >= 4 else None

        if chapter not in TARGET_CHAPTERS:
            out_of_scope.append(block)
            continue

        section_file = resolve_section_file(source_dir, stack_source) if stack_source else None
        if section_file is None:
            unresolved.append(block)
        else:
            by_section.setdefault(section_file, []).append(block)

    moved: list[str] = []
    for section_file in sorted(by_section):
        blocks = by_section[section_file]
        rel = section_file.relative_to(REPO_ROOT)
        text = section_file.read_text(encoding="utf-8")

        new_text = insert_exercises(text, blocks)
        if new_text is None:
            print(f"! {rel}: no <exercises> tag found, skipping {len(blocks)} exercise(s)")
            unresolved.extend(blocks)
            continue

        print(f"{rel}: {len(blocks)} exercise(s)")
        for b in blocks:
            print(f"    - {describe(b)}")

        if args.apply:
            section_file.write_text(new_text, encoding="utf-8")

        moved.extend(blocks)

    print()
    if args.apply:
        remaining = [b for b in exercise_blocks if b not in moved]
        if remaining:
            leftover = "\n" + "\n".join(b.rstrip("\n") for b in remaining) + "\n"
            orphaned_path.write_text(leftover, encoding="utf-8")
            print(f"Moved {len(moved)} exercise(s). {len(remaining)} left in {orphaned_path.name} "
                  f"(unmapped or outside TARGET_CHAPTERS).")
        else:
            orphaned_path.write_text("", encoding="utf-8")
            print(f"Moved all {len(moved)} exercise(s). {orphaned_path.name} is now empty.")
    else:
        print(f"[dry run] would move {len(moved)} exercise(s) into {len(by_section)} section file(s).")
        print("Re-run with --apply to write the changes.")

    if unresolved:
        print(f"\n{len(unresolved)} exercise(s) in TARGET_CHAPTERS could not be mapped and will stay in {orphaned_path.name}:")
        for b in unresolved:
            print(f"  - {describe(b)}")

    if out_of_scope:
        print(f"\n{len(out_of_scope)} exercise(s) belong to chapters outside TARGET_CHAPTERS and were left untouched.")


if __name__ == "__main__":
    main()
