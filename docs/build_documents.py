"""Build docs/project_documents.pdf: cover with table of contents + every diagram in one PDF.

Usage:  python3 docs/build_documents.py
Needs:  pip install playwright pypdf  (uses the installed Google Chrome; set CHROME_PATH to override)

To add pages, export your PDF into docs/diagrams/ and add it to SECTIONS below, then run again.
"""
import html
import os
from io import BytesIO
from pathlib import Path

from playwright.sync_api import sync_playwright
from pypdf import PdfReader, PdfWriter

DOCS = Path(__file__).resolve().parent
DIAGRAMS = DOCS / 'diagrams'
OUT = DOCS / 'project_documents.pdf'

# (title, pdf file, pages of that file to keep or None for all). Missing files are skipped.
SECTIONS = [
    ('Use case diagram (overview)', 'base_documents.pdf', [0]),
    ('Use case – Plan a collection (Manager)', 'base_documents.pdf', [1]),
    ('Use case – Carry out a collection round (Driver)', 'base_documents.pdf', [2]),
    ('Database – Table diagram (physical model)', 'base_documents.pdf', [3]),
    ('Database – Conceptual view', 'base_documents.pdf', [4]),
    ('Planned Gantt chart', 'base_documents.pdf', [5]),
    ('Member diagrams – Amadeo Berthelot (wireframe, activity, sequence)', 'member_amadeo_berthelot.pdf', None),
    ('Member diagrams – Jules Venot (wireframe, activity, sequence)', 'member_jules_venot.pdf', None),
    ('Member diagrams – Hadi Daccache (wireframe, activity, sequence)', 'member_hadi_daccache.pdf', None),
]


def cover_html(rows):
    items = ''.join(
        f'<li><span>{i}. {html.escape(title)}</span><span>{pages}</span></li>'
        for i, (title, pages) in enumerate(rows, start=1)
    )
    return f'''<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      @page {{ size: A4 landscape; margin: 0; }}
      body {{ margin: 0; font-family: Helvetica, Arial, sans-serif; color: #111; }}
      .cover {{ width: 297mm; height: 210mm; display: flex; flex-direction: column; align-items: center; justify-content: center; }}
      h1 {{ margin: 0 0 6px; font-size: 26px; }}
      .sub {{ margin: 0 0 30px; font-size: 13px; color: #555; }}
      ul {{ width: 190mm; margin: 0; padding: 0; list-style: none; font-size: 11px; }}
      li {{ display: flex; justify-content: space-between; padding: 6px 2px; border-bottom: 1px dashed #aaa; }}
      .team {{ margin-top: 36px; font-size: 10px; color: #444; }}
    </style></head><body><div class="cover">
      <h1>Waste &amp; Recycling Management</h1>
      <p class="sub">Advanced Web project – Design documents</p>
      <ul>{items}</ul>
      <p class="team">Jules Venot · Amadeo Berthelot · Hadi Daccache</p>
    </div></body></html>'''


def render_cover(rows):
    chrome = os.environ.get('CHROME_PATH')
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=chrome, headless=True) if chrome \
            else p.chromium.launch(channel='chrome', headless=True)
        page = browser.new_page()
        page.set_content(cover_html(rows))
        pdf = page.pdf(print_background=True, prefer_css_page_size=True)
        browser.close()
    return PdfReader(BytesIO(pdf))


def main():
    parts, rows, next_page = [], [], 2  # page 1 is the cover
    for title, name, keep in SECTIONS:
        path = DIAGRAMS / name
        if not path.exists():
            print('skipped (not found):', name)
            continue
        reader = PdfReader(path)
        pages = [reader.pages[i] for i in (keep if keep is not None else range(len(reader.pages)))]
        first, last = next_page, next_page + len(pages) - 1
        rows.append((title, f'p. {first}' if first == last else f'p. {first}–{last}'))
        parts.extend(pages)
        next_page = last + 1

    writer = PdfWriter()
    writer.add_page(render_cover(rows).pages[0])
    for page in parts:
        writer.add_page(page)
    with open(OUT, 'wb') as f:
        writer.write(f)
    print(f'{OUT.relative_to(DOCS.parent)}: {len(writer.pages)} pages')


if __name__ == '__main__':
    main()
