#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

"""
PLH i18n Auto-Tagger
Adds data-i18n / data-i18n-html attributes to service detail page body content.
Outputs translations.js AZ entries ready for copy-paste.

Usage:  python i18n_tagger.py
Requires: pip install beautifulsoup4
"""

from pathlib import Path
from bs4 import BeautifulSoup, NavigableString
import re, sys

SERVICES_DIR = Path(__file__).parent / "services"

# (filename, slug, process_body, process_faq)
# emek body/lists already done manually — only FAQ answers remain
PAGES = [
    ("emek-huququ.html",    "emek",     False, True),
    ("vekil-xidmeti.html",  "vekil",    True,  True),
    ("aile-huququ.html",    "aile",     True,  True),
    ("cinayat-huququ.html", "cinayat",  True,  True),
    ("inzibati-huquq.html", "inzibati", True,  True),
    ("dasinmaz-emlak.html", "dasinmaz", True,  True),
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def clean_text(node):
    """Collapse all whitespace in a text string."""
    return " ".join(node.get_text().split())


def clean_inner_html(li_tag):
    """
    Return the innerHTML of a <li> with whitespace collapsed.
    Needed for data-i18n-html values that contain <strong>.
    """
    parts = []
    for child in li_tag.children:
        if isinstance(child, NavigableString):
            t = str(child).strip()
            if t:
                parts.append(t)
        else:
            parts.append(str(child).strip())
    raw = " ".join(parts)
    # Collapse internal whitespace sequences
    return re.sub(r"\s{2,}", " ", raw).strip()


def add_attr_to_opening_tag(html_text, tag_name, attr_name, attr_value, unique_text_snippet):
    """
    Find a <tag_name> opening tag that is followed (within 300 chars) by
    unique_text_snippet, then insert attr_name="attr_value" into that tag.
    Preserves the rest of the file exactly.
    Returns (modified_html, success_bool).
    """
    # Normalise snippet for searching
    snippet = unique_text_snippet[:40].strip()
    snippet_regex_pattern = r'\s+'.join(re.escape(word) for word in snippet.split())
    match = re.search(snippet_regex_pattern, html_text)
    if not match:
        return html_text, False
    pos = match.start()

    # Search backwards from pos for the nearest opening tag
    search_area = html_text[max(0, pos - 300) : pos]
    # Tag must not already have our attribute
    tag_open_re = re.compile(
        rf"<{tag_name}(?!\s[^>]*{attr_name})[^>]*>",
        re.DOTALL,
    )
    matches = list(tag_open_re.finditer(search_area))
    if not matches:
        return html_text, False

    last_match = matches[-1]
    abs_start = max(0, pos - 300) + last_match.start()
    abs_end   = max(0, pos - 300) + last_match.end()

    old_tag = html_text[abs_start:abs_end]

    # Insert attribute before the closing >
    if old_tag.endswith("/>"):
        new_tag = old_tag[:-2] + f' {attr_name}="{attr_value}"/>'
    else:
        new_tag = old_tag[:-1] + f' {attr_name}="{attr_value}">'

    modified = html_text[:abs_start] + new_tag + html_text[abs_end:]
    return modified, True


# ---------------------------------------------------------------------------
# Core processor
# ---------------------------------------------------------------------------

def process_file(filename, slug, do_body, do_faq):
    filepath = SERVICES_DIR / filename
    if not filepath.exists():
        print(f"  SKIP — file not found: {filepath}")
        return {}

    raw = filepath.read_text(encoding="utf-8")
    soup = BeautifulSoup(raw, "html.parser")

    article = soup.find("article", class_="service-content")
    if not article:
        print(f"  SKIP — no <article class='service-content'> in {filename}")
        return {}

    faq_section = article.find("section", class_=lambda c: c and "plh-faq" in c.split())
    translations = {}
    modified_html = raw
    changed = False

    # -----------------------------------------------------------------------
    # 1. Body paragraphs + list items  (skip if do_body=False)
    # -----------------------------------------------------------------------
    if do_body:
        body_p_idx = 0
        ul_idx = 0

        for div in article.find_all("div", class_="class-to-animate"):
            # Skip divs that live inside the FAQ section
            if faq_section and faq_section in div.parents:
                continue

            # --- paragraphs ---
            for p in div.find_all("p", recursive=False):
                if p.get("data-i18n") or p.get("data-i18n-html"):
                    continue
                body_p_idx += 1
                key = f"{slug}.body_p{body_p_idx}"
                snippet = clean_text(p)[:60]
                modified_html, ok = add_attr_to_opening_tag(
                    modified_html, "p", "data-i18n", key, snippet
                )
                if ok:
                    translations[key] = clean_text(p)
                    changed = True
                else:
                    print(f"  WARN: could not tag {key} — snippet: {snippet[:30]}")

            # --- list items ---
            for ul in div.find_all("ul", recursive=False):
                ul_idx += 1
                for li_i, li in enumerate(ul.find_all("li", recursive=False), 1):
                    if li.get("data-i18n-html"):
                        continue
                    if not li.find("strong"):
                        continue
                    key = f"{slug}.li{ul_idx}_{li_i}"
                    # Use the text of the <strong> as unique snippet
                    strong = li.find("strong")
                    snippet = (strong.get_text() if strong else clean_text(li))[:50]
                    modified_html, ok = add_attr_to_opening_tag(
                        modified_html, "li", "data-i18n-html", key, snippet
                    )
                    if ok:
                        translations[key] = clean_inner_html(li)
                        changed = True
                    else:
                        print(f"  WARN: could not tag {key} — snippet: {snippet[:30]}")

    # -----------------------------------------------------------------------
    # 2. FAQ answers  (skip if do_faq=False)
    # -----------------------------------------------------------------------
    if do_faq and faq_section:
        faq_a_idx = 0
        for answer_div in faq_section.find_all("div", class_="plh-faq-answer-inner"):
            p = answer_div.find("p", recursive=False)
            if not p:
                continue
            if p.get("data-i18n"):
                continue
            faq_a_idx += 1
            key = f"{slug}.faq{faq_a_idx}_a"
            snippet = clean_text(p)[:60]
            modified_html, ok = add_attr_to_opening_tag(
                modified_html, "p", "data-i18n", key, snippet
            )
            if ok:
                translations[key] = clean_text(p)
                changed = True
            else:
                print(f"  WARN: could not tag {key} — snippet: {snippet[:30]}")

    # -----------------------------------------------------------------------
    # Write back only if something changed
    # -----------------------------------------------------------------------
    if changed:
        filepath.write_text(modified_html, encoding="utf-8")
        print(f"  OK   — tagged {len(translations)} elements, file updated.")
    else:
        print(f"  OK   — nothing to change.")

    return translations


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    if not SERVICES_DIR.exists():
        print(f"ERROR: services directory not found: {SERVICES_DIR}")
        sys.exit(1)

    try:
        import bs4  # noqa
    except ImportError:
        print("ERROR: beautifulsoup4 not installed. Run: pip install beautifulsoup4")
        sys.exit(1)

    all_translations = {}

    for filename, slug, do_body, do_faq in PAGES:
        print(f"\nProcessing {filename} (slug={slug}) ...")
        t = process_file(filename, slug, do_body, do_faq)
        all_translations.update(t)

    # -----------------------------------------------------------------------
    # Print translations.js entries
    # -----------------------------------------------------------------------
    if all_translations:
        print("\n" + "=" * 70)
        print("translations.js AZ entries — paste into the az: {} block:")
        print("=" * 70)
        for key, value in all_translations.items():
            # Escape double quotes inside value
            val = value.replace("\\", "\\\\").replace('"', '\\"')
            # Determine field width for alignment
            key_str = f'"{key}"'
            print(f"      {key_str:<45} \"{val}\",")
        print("=" * 70)
        print(f"\nTotal: {len(all_translations)} new AZ keys generated.")
        print("Remember: add the same keys (translated) to the en: and ru: blocks.")
    else:
        print("\nNo new translations generated.")


if __name__ == "__main__":
    main()
