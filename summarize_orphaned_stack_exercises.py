#!/usr/bin/env python3
"""
Summarise which chapters still have STACK exercises sitting in
ORPHANED_FILE that have not yet been moved into their sections.

Read-only companion to move_orphaned_stack_exercises.py: it uses the
same rules to map each orphaned <exercise> (via its <stack source="...">
path) to a chapter folder and section file, then reports, per chapter:

  * how many exercises are still waiting to be moved, per section
  * whether each target section file exists and has an <exercises> block
    (i.e. whether the move script would be able to place them)
  * exercises whose xml:id already appears in the target section file
    (moved but never removed from ORPHANED_FILE)

Usage:
    python3 summarize_orphaned_stack_exercises.py              # all chapters
    python3 summarize_orphaned_stack_exercises.py -v           # also list each exercise
    python3 summarize_orphaned_stack_exercises.py 16-functions # only these chapters
"""

import argparse
import re
from collections import defaultdict
from pathlib import Path

from move_orphaned_stack_exercises import (
    EXERCISE_RE,
    EXERCISES_OPEN_RE,
    ORPHANED_FILE,
    REPO_ROOT,
    SOURCE_DIR,
    STACK_SOURCE_RE,
    XML_ID_RE,
    describe,
)

NO_CHAPTER = "(no chapter in stack source)"


def section_file_for(source_dir: Path, chapter: str, section: str) -> Path:
    """Same naming rule as resolve_section_file, but returns the expected
    path even when it doesn't exist so it can be reported."""
    m = re.match(r"^\d+-(.+)$", section)
    return source_dir / chapter / f"sec-{m.group(1) if m else section}.ptx"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("chapters", nargs="*", help="Only report these chapter folders (default: all).")
    parser.add_argument("-v", "--verbose", action="store_true", help="List every orphaned exercise.")
    args = parser.parse_args()

    source_dir = REPO_ROOT / SOURCE_DIR
    orphaned_path = REPO_ROOT / ORPHANED_FILE
    if not orphaned_path.is_file():
        raise SystemExit(f"Orphaned file not found: {orphaned_path}")

    blocks = EXERCISE_RE.findall(orphaned_path.read_text(encoding="utf-8"))

    # chapter -> section -> [blocks]
    tree: dict[str, dict[str, list[str]]] = defaultdict(lambda: defaultdict(list))
    for block in blocks:
        m = STACK_SOURCE_RE.search(block)
        parts = m.group(1).split("/") if m else []
        chapter = parts[3] if len(parts) >= 4 else NO_CHAPTER
        section = parts[4] if len(parts) >= 5 else "(no section)"
        tree[chapter][section].append(block)

    chapters = sorted(tree)
    if args.chapters:
        chapters = [c for c in chapters if c in args.chapters]

    print(f"{orphaned_path.name}: {len(blocks)} orphaned exercise(s) across {len(tree)} chapter(s)\n")
    if not chapters:
        print("Nothing left for the requested chapter(s).")
        return

    totals = {"pending": 0, "movable": 0, "blocked": 0, "duplicate": 0}

    for chapter in chapters:
        sections = tree[chapter]
        count = sum(len(b) for b in sections.values())
        chapter_exists = (source_dir / chapter).is_dir()
        flag = "" if chapter_exists else "  [chapter folder missing]"
        print(f"{chapter}: {count} exercise(s){flag}")

        for section in sorted(sections):
            sec_blocks = sections[section]
            path = section_file_for(source_dir, chapter, section)
            text = path.read_text(encoding="utf-8") if path.is_file() else None

            if chapter == NO_CHAPTER:
                status = "BLOCKED: stack source path too short to map"
            elif text is None:
                status = f"BLOCKED: {path.relative_to(REPO_ROOT)} not found"
            elif not EXERCISES_OPEN_RE.search(text):
                status = f"BLOCKED: no <exercises> in {path.name}"
            else:
                status = f"ready -> {path.name}"

            dupes = []
            if text is not None:
                for b in sec_blocks:
                    id_m = XML_ID_RE.search(b)
                    if id_m and f'xml:id="{id_m.group(1)}"' in text:
                        dupes.append(b)

            totals["pending"] += len(sec_blocks)
            totals["blocked" if status.startswith("BLOCKED") else "movable"] += len(sec_blocks)
            totals["duplicate"] += len(dupes)

            dupe_note = f", {len(dupes)} already in section" if dupes else ""
            width = max(len(s) for s in sections)
            print(f"    {section:<{width}}  {len(sec_blocks):>3}  {status}{dupe_note}")
            if args.verbose:
                for b in sec_blocks:
                    mark = " (already in section)" if b in dupes else ""
                    print(f"        - {describe(b)}{mark}")
        print()

    print(f"Chapters with pending exercises: {len(chapters)}")
    print(f"Exercises pending:   {totals['pending']}")
    print(f"  ready to move:     {totals['movable']}")
    print(f"  blocked:           {totals['blocked']}")
    if totals["duplicate"]:
        print(f"  already in section (safe to delete from {orphaned_path.name}): {totals['duplicate']}")


if __name__ == "__main__":
    main()
