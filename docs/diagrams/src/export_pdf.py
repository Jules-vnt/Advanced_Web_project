"""Export a member diagrams page (HTML + Mermaid) to PDF.

Usage:  python3 docs/diagrams/src/export_pdf.py docs/diagrams/src/member_<name>.html docs/diagrams/member_<name>.pdf
Needs:  pip install playwright  (uses the installed Google Chrome; set CHROME_PATH to override)
"""
import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

src, out = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
chrome = os.environ.get('CHROME_PATH')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome, headless=True) if chrome \
        else p.chromium.launch(channel='chrome', headless=True)
    page = browser.new_page(viewport={'width': 1123, 'height': 794})
    page.goto(src.as_uri())
    # Pages with Mermaid diagrams set this flag once every diagram is drawn
    if page.query_selector('pre.mermaid'):
        page.wait_for_function('window.__mermaidDone === true', timeout=60000)
    page.emulate_media(media='print')
    page.pdf(path=str(out), print_background=True, prefer_css_page_size=True)
    browser.close()

print('PDF written to', out)
