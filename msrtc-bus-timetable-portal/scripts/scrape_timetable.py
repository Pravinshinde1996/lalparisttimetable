#!/usr/bin/env python3
"""
scrape_timetable.py

Fetches the hard-coded timetable page and writes JSON to
src/assets/data/sangli.json (no CLI arguments required).

Edit the URL or OUTPUT_FILE constants below if you want to target a different page/file.

Dependencies:
    pip install requests beautifulsoup4

Run:
    python scripts/scrape_timetable.py
"""

import json
import logging
import re
from datetime import datetime, timedelta
from typing import List

import requests
from bs4 import BeautifulSoup

# ------------------------ Configuration ------------------------
URL = "https://stbustimetable.in/malvan-bus-stand-time-table-contact-number-ticket-price/"
# write directly into the project's assets folder so the Angular app can load it
OUTPUT_FILE = "src/assets/data/malvan.json"
PRETTY = True  # pretty-print JSON
TIME_RE = re.compile(r"\b\d{1,2}:\d{2}\b")
# ----------------------------------------------------------------

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
LOG = logging.getLogger(__name__)


def normalize_text(s: str) -> str:
    return " ".join(s.split()).strip()


def parse_times(cell_text: str) -> List[str]:
    if not cell_text:
        return []
    txt = cell_text.strip()

    # Detect explicit range with interval, e.g. "6:15 to 16:30 on Every 30 Minutes"
    range_match = re.search(r"(\d{1,2}:\d{2})\s*(?:to|-)\s*(\d{1,2}:\d{2})", txt, flags=re.I)
    if range_match:
        start_s, end_s = range_match.group(1), range_match.group(2)
        # try to find an interval in minutes: 'every 30 minutes', '30 min', etc.
        interval_match = re.search(r"every\s*(?:on\s*)?(\d{1,3})\s*(?:minutes|minute|mins|min)\b", txt, flags=re.I)
        if not interval_match:
            # also accept patterns like 'on Every 30 Minutes' or just '30 Minutes'
            interval_match = re.search(r"(\d{1,3})\s*(?:minutes|minute|mins|min)\b", txt, flags=re.I)
        if interval_match:
            try:
                step = int(interval_match.group(1))
                fmt = "%H:%M"
                start_dt = datetime.strptime(start_s, fmt)
                end_dt = datetime.strptime(end_s, fmt)
                # If end < start assume same-day range; if it appears earlier, keep as-is.
                times_expanded = []
                cur = start_dt
                delta = timedelta(minutes=step)
                # safety guard: don't loop forever
                max_iters = 24 * 60 // max(1, step) + 2
                iters = 0
                while cur <= end_dt and iters < max_iters:
                    times_expanded.append(cur.strftime(fmt))
                    cur += delta
                    iters += 1
                # ensure end time presence if not exactly hit
                if times_expanded and times_expanded[-1] != end_dt.strftime(fmt):
                    # append end time explicitly (keeps original semantics seen in source)
                    times_expanded.append(end_dt.strftime(fmt))
                return times_expanded
            except Exception:
                # fallback to regex-only extraction below on parse errors
                pass

    # Fallback: extract explicit HH:MM tokens found in the text
    times = TIME_RE.findall(cell_text)
    normalized = []
    for t in times:
        parts = t.split(":")
        h = int(parts[0])
        m = parts[1]
        normalized.append(f"{h:02d}:{m}")
    return normalized


def parse_via(cell_text: str) -> List[str]:
    if not cell_text:
        return []
    txt = re.sub(r"[\(\)]", "", cell_text)
    parts = re.split(r",|\s+via\s+|\s+\/\s+|\s*\-\s*", txt)
    cleaned = []
    for p in parts:
        p = p.strip()
        if not p:
            continue
        # drop explicit time tokens
        if TIME_RE.search(p):
            continue
        # drop interval-like tokens (e.g. '30 Minutes', 'Every 30 Minutes')
        if re.search(r"\b(?:every\s*)?\d{1,3}\s*(?:minutes|minute|mins|min)\b", p, flags=re.I):
            continue
        # drop promotional/booking tokens
        if re.search(r"\b(?:abhibus|goibibo|book|booking|ticket|upto rs|upto|rs\.|fare|price)\b", p, flags=re.I):
            continue
        # drop tokens that are mostly numeric or punctuation
        if re.fullmatch(r"[\d\s:.,-]+", p):
            continue
        cleaned.append(p)
    return cleaned


def extract_table_rows(soup: BeautifulSoup) -> List[dict]:
    rows_out: List[dict] = []
    # Prefer the specific timetable table which on the site uses classes
    # `row-striping row-hover`. If found, use only those tables; otherwise
    # fall back to all <table> elements.
    all_tables = soup.find_all("table")
    tables = [
        t for t in all_tables
        if {'row-striping', 'row-hover'}.issubset(set(t.get('class', [])))
    ]
    if not tables:
        tables = all_tables

    if not tables:
        LOG.debug("No <table> elements found in page")
        return rows_out

    for table in tables:
        for tr in table.find_all("tr"):
            tds = tr.find_all(["td", "th"])
            if len(tds) < 2:
                continue

            # normalize all td texts first
            td_texts = [normalize_text(td.get_text(separator=" ", strip=True)) for td in tds]
            col0 = td_texts[0] if td_texts else ""
            if not col0:
                continue

            # Try to find which column contains times (scan columns after the depot)
            times = []
            times_col_idx = None
            for idx in range(1, len(td_texts)):
                candidate = td_texts[idx]
                if not candidate:
                    continue
                found = parse_times(candidate)
                if found:
                    times = found
                    times_col_idx = idx
                    break

            # Fallback: search combined text for times and try to extract depot name
            if not times:
                combined = " ".join(td_texts)
                times = parse_times(combined)
                if times:
                    split_at_time = re.split(TIME_RE, combined, maxsplit=1)
                    if split_at_time:
                        candidate_depot = split_at_time[0].strip(" |,-")
                        if candidate_depot:
                            col0 = candidate_depot

            # Collect via candidates from columns other than the depot and the column that contained times
            via_candidates: List[str] = []
            for idx, txt in enumerate(td_texts):
                if idx == 0:
                    # depot cell may include via info in parentheses or 'via' word
                    if re.search(r"\bvia\b", txt, flags=re.I) or ("(" in txt and ")" in txt):
                        via_candidates.extend(parse_via(txt))
                    continue
                if idx == times_col_idx:
                    continue
                via_candidates.extend(parse_via(txt))

            # normalize and dedupe via list while preserving order
            via = []
            for v in via_candidates:
                if v and v not in via:
                    via.append(v)

            entry = {"depot": col0, "departureTimes": times, "via": via}
            if entry["departureTimes"] or entry["via"]:
                rows_out.append(entry)
    return rows_out


def scrape_page(url: str) -> List[dict]:
    LOG.info("Fetching %s", url)
    resp = requests.get(url, timeout=20)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    rows = extract_table_rows(soup)

    # Filter out unwanted/promotional rows (third-party booking links, headers, etc.)
    def is_unwanted(entry: dict) -> bool:
        depot = (entry.get('depot') or '').strip().lower()
        via_text = ' '.join(entry.get('via', [])).strip().lower()

        # Drop obvious promotional depots
        promo_names = ['abhibus', 'goibibo', 'abhi bus', 'abhibus.com', 'book', 'booking']
        if any(p in depot for p in promo_names):
            return True

        # If there are no times, inspect the via text for promotional/header content
        if not entry.get('departureTimes'):
            if not via_text:
                return True
            bad_tokens = ['departure time', 'upto rs', 'discount', 'ticket', 'booking', '–', '-', 'upto', 'rs.']
            if any(bt in via_text for bt in bad_tokens):
                return True

        return False

    rows = [r for r in rows if not is_unwanted(r)]

    if not rows:
        LOG.info("No rows from tables; scanning text lines for pattern 'name | times'")
        text = soup.get_text("\n")
        for line in text.splitlines():
            if '|' in line and TIME_RE.search(line):
                parts = [p.strip() for p in line.split('|') if p.strip()]
                if len(parts) >= 2:
                    depot = parts[0]
                    times = parse_times(parts[1])
                    via = parse_via(parts[1]) if not times else []
                    rows.append({"depot": depot, "departureTimes": times, "via": via})

    # dedupe by depot name
    seen = set()
    unique = []
    for r in rows:
        key = r['depot'].lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(r)
    return unique


def write_output(entries: List[dict], path: str):
    indent = 2 if PRETTY else None
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(entries, f, ensure_ascii=False, indent=indent)
    LOG.info("Wrote %d entries to %s", len(entries), path)


def main():
    entries = scrape_page(URL)
    if not entries:
        LOG.warning("No timetable entries found; output will be empty list")
    write_output(entries, OUTPUT_FILE)


if __name__ == '__main__':
    main()
