from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
files = [
    ROOT / 'index.html',
    ROOT / 'styles.css',
    ROOT / 'engine.js',
    ROOT / 'app.js',
    ROOT / 'app_v2.js',
    ROOT / 'result_freshness.js',
]
for file in files:
    if not file.exists():
        raise AssertionError(f'Missing file: {file}')
    text = file.read_text(encoding='utf-8')
    lower = text.lower()
    forbidden = [
        'fetch(', 'xmlhttprequest', 'websocket', 'eventsource', 'localstorage',
        'sessionstorage', 'document.cookie', 'indexeddb', 'sendbeacon',
        'google-analytics', 'gtag(', 'stripe', 'paypal', 'mailchimp'
    ]
    for token in forbidden:
        if token in lower:
            raise AssertionError(f'Forbidden capability {token!r} in {file.name}')

html = (ROOT / 'index.html').read_text(encoding='utf-8')
for url in re.findall(r'(?:src|href)=["\']([^"\']+)', html, flags=re.I):
    if url.startswith(('http://', 'https://', '//')):
        raise AssertionError(f'External asset reference: {url}')

active_bytes = sum(file.stat().st_size for file in files)
if active_bytes > 180_000:
    raise AssertionError(f'Lab unexpectedly large: {active_bytes} bytes')

print(f'Capital Efficiency static integrity passed: {active_bytes} bytes, local-only assets')
