#!/usr/bin/env python3
"""Regenerate src/acl_data.json for the hub's ACL agenda.

Pipeline: parse the (gitignored) conference handbook PDF text into sessions/papers
-> match against people lists and topic subcategories -> clean PDF-extraction
artifacts -> attach ACL Anthology URLs (author-verified title match).

Usage:
  python3 scripts/acl_agenda_data.py "ACL26 Digital Conference Handbook.pdf" \
      [--anthology-xml acl2026.xml findings2026.xml]

Anthology XMLs come from
https://raw.githubusercontent.com/acl-org/acl-anthology/master/data/xml/2026.acl.xml
(and 2026.findings.xml). Requires pypdf.
"""
import re, json, sys, unicodedata, difflib
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'src' / 'acl_data.json'

LIG = {'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', 'ﬃ': 'ffi', 'ﬄ': 'ffl', '’': "'", '‘': "'", '“': '"', '”': '"'}

def clean(s):
    for k, v in LIG.items(): s = s.replace(k, v)
    return re.sub(r'\s+', ' ', s).strip()

def deaccent(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')

def norm(s):
    return deaccent(s).lower()

def normkey(s):
    return re.sub(r'[^a-z0-9]', '', norm(s))

# ── people lists ─────────────────────────────────────────────
PROFS = ["Rachel Rudinger", "Marine Carpuat", "Jordan Boyd-Graber", "Mohit Iyyer", "Kristina Gligoric",
         "Daniel Khashabi", "Ziang Xiao", "David Yarowsky", "Kevin Duh", "Joyce Chai", "Rada Mihalcea",
         "David Jurgens", "Lianhui Qin", "Prithviraj Ammanabrolu", "Benjamin Bergen", "David Bamman",
         "Alane Suhr", "Yejin Choi", "Jiajun Wu", "Diyi Yang", "Dan Jurafsky", "Yonatan Bisk",
         "Louis-Philippe Morency", "Maarten Sap", "Daphne Ippolito", "Yoav Artzi", "Claire Cardie",
         "Ranjay Krishna", "Tim Althoff", "He He", "Greg Durrett"]
USC = ["Jesse Thomason", "Maja Mataric", "Toben Mintz", "Swabha Swayamdipta", "Robin Jia", "Xiang Ren",
       "Jonathan May", "Xuezhe Ma", "Emilio Ferrara", "Jonathan Gratch", "Jieyu Zhao", "Vatsal Sharan",
       "Willie Neiswanger", "Sai Praneeth Karimireddy", "Kallirroi Georgila", "Morteza Dehghani"]
LAB = ["Kaleen Shrestha", "Amin Banayeeanzade", "Brihi Joshi", "Jaspreet Ranjit", "Taiwei Shi",
       "Deqing Fu", "Haosheng Gan", "Keyu He", "Tejas Srinivasan", "Harish Dukkipati", "Zhonghao Shi",
       "Abhinav Gupta", "Ala Tak"]
NYU = ["Kyunghyun Cho", "Tal Linzen", "Eunsol Choi"]
RECS = ["Allen Chang"]  # people whose papers I want flagged as recommendations

def name_rx(name):
    parts = name.split()
    return re.compile(r'\b' + re.escape(norm(parts[0])) + r'[\w\.\s\-]{0,25}?\b' + re.escape(norm(parts[-1])) + r'\b')

NAME_RES = [(g, n, name_rx(n)) for g, names in (('lab', LAB), ('faculty', PROFS), ('usc', USC), ('nyu', NYU), ('rec', RECS)) for n in names]

# ── topic subcategories (strict, title-level) ────────────────
SUBTOPICS = [
    ('grounding', r'\bground(ing|ed)\b'),
    ('multimodal', r'\bmulti[- ]?modal|vision[- ](and[- ])?language|\bvlms?\b|\bmllms?\b'),
    ('embodied', r'\bembod\w+|sensorimotor|phonesthem|\brobot'),
    ('cogsci', r'theory of mind|psycholinguist|\bcognitive\b|\bcognition\b|mental model'),
    ('humaneval', r'human evaluat\w*|human judg\w*|human preference|llm[- ]as[- ]a?[- ]?judge'),
    ('social', r'\bsocial (reasoning|intelligence|prediction|cognition)|\bempath'),
]
SUBTOPIC_RES = [(tag, re.compile(rx)) for tag, rx in SUBTOPICS]
GROUNDING_EXCLUDE = re.compile(r'(theoretical|empirical|firm|well|strong)ly[- ]grounded|grounded theory')

MINE = ('make sense: sensorimotor', 'infer human actions and motives')

TYPE_RX = re.compile(r'^\[(Long|Short|Findings|Demo|SRW|TACL|CL|Industry)\]\s*(.*)')
POSTER_RX = re.compile(r'^Poster Session ([A-Z])\s*\(([^)]+)\)\s*$')
ORAL_RX = re.compile(r'^Orals? Session ([A-Z]):\s*(.+?)\s*$')
TIME_RX = re.compile(r'^(\d{1,2}:\d{2})-(\d{1,2}:\d{2})\s*\(([^)]+)\)\s*$')
DAY_RX = re.compile(r'^Main Conference, Day (\d), (\w+), July (\d+), 2026')
PAGE_RX = re.compile(r'^===== PAGE (\d+) =====$')


def extract_text(pdf_path):
    from pypdf import PdfReader
    r = PdfReader(pdf_path)
    chunks = []
    for i, p in enumerate(r.pages):
        chunks.append(f'\n===== PAGE {i+1} =====\n')
        try: chunks.append(p.extract_text() or '')
        except Exception: pass
    return ''.join(chunks)


def parse_papers(text):
    lines = text.split('\n')
    papers = []
    day = dayname = session = room = s_start = s_end = None
    pending_session = None
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        m = DAY_RX.match(line)
        if m:
            day = f'2026-07-{int(m.group(3)):02d}'; dayname = m.group(2); i += 1; continue
        if PAGE_RX.match(line):
            i += 1; continue
        m = POSTER_RX.match(line)
        if m:
            pending_session = f'Poster Session {m.group(1)}'; i += 1; continue
        m = ORAL_RX.match(line)
        if m and '. . ' not in line:
            pending_session = f'Oral Session {m.group(1)}: {clean(m.group(2))}'; i += 1; continue
        m = TIME_RX.match(line)
        if m and pending_session:
            session = pending_session; s_start, s_end = m.group(1), m.group(2); room = clean(m.group(3))
            pending_session = None; i += 1; continue
        m = TYPE_RX.match(line)
        if m and session and day:
            ptype = m.group(1)
            title_parts = [m.group(2)]
            j = i + 1
            while '▶' not in ' '.join(title_parts) and j < len(lines) and j < i + 5:
                nxt = lines[j].strip()
                if TYPE_RX.match(nxt) or POSTER_RX.match(nxt) or ORAL_RX.match(nxt) or DAY_RX.match(nxt) or PAGE_RX.match(nxt):
                    break
                if re.match(r"^[A-Z][\w\.\-'’]+(\s[A-Z][\w\.\-'’]*)*(,| and )", nxt) and '▶' not in nxt and not title_parts[-1].rstrip().endswith((':', '-', '—')):
                    break
                title_parts.append(nxt); j += 1
            title = re.sub(r'\s*▶.*$', '', clean(' '.join(title_parts)))
            auth_parts = []
            while j < len(lines):
                nxt = lines[j].strip()
                if not nxt or TYPE_RX.match(nxt) or POSTER_RX.match(nxt) or ORAL_RX.match(nxt) or DAY_RX.match(nxt) or PAGE_RX.match(nxt):
                    break
                auth_parts.append(nxt); j += 1
                if not nxt.endswith(',') and (' and ' in nxt or not nxt.endswith(('and',))):
                    break
            papers.append(dict(type=ptype, title=title, authors=clean(' '.join(auth_parts)),
                               day=day, dayName=dayname, start=s_start, end=s_end,
                               session=session, room=room))
            i = j; continue
        i += 1
    return papers


def match_papers(papers):
    out, seen = [], set()
    for p in papers:
        a, t = norm(p['authors']), norm(p['title'])
        reasons, tags = [], set()
        for g, n, rx in NAME_RES:
            if rx.search(a): reasons.append(n); tags.add(g)
        for tag, rx in SUBTOPIC_RES:
            if rx.search(t):
                if tag == 'grounding' and GROUNDING_EXCLUDE.search(t): continue
                reasons.append(tag); tags.add(tag)
        if not reasons: continue
        key = (p['title'][:60], p['session'])
        if key in seen: continue
        seen.add(key)
        p['tags'] = sorted(tags); p['reasons'] = list(dict.fromkeys(reasons))
        out.append(p)
    return out


def fix_artifacts(s):
    s = re.sub(r'\s*\w+_\w+\s*', ' ', s)
    s = re.sub(r'\b([VYW]) (?=[a-z])', r'\1', s)
    s = re.sub(r'\bL V(?=[A-Z])', 'LV', s)
    s = re.sub(r'([a-z])- ([a-z])', r'\1-\2', s)
    return re.sub(r'\s+', ' ', s).strip()


def finalize(matched):
    out, seen = [], set()
    for p in matched:
        p['title'] = fix_artifacts(p['title']); p['authors'] = fix_artifacts(p['authors'])
        if re.fullmatch(r'[\d\s]*', p['authors']): p['authors'] = ''
        if any(m in p['title'].lower() for m in MINE):
            p['tags'] = sorted(set(p['tags'] + ['mine']))
        base = re.sub(r'[^a-z0-9]+', '-', p['title'].lower())[:48].strip('-')
        pid, n = base, 2
        while pid in seen: pid = f'{base}-{n}'; n += 1
        seen.add(pid); p['id'] = pid
        out.append(p)
    out.sort(key=lambda p: (p['day'], p['start'], p['session'], p['title']))
    return out


def attach_anthology(papers, xml_paths):
    index = {}
    for fn in xml_paths:
        root = ET.parse(fn).getroot()
        for vol in root.findall('volume'):
            vid = vol.get('id')
            for paper in vol.findall('paper'):
                t = paper.find('title')
                if t is None: continue
                title = ''.join(t.itertext())
                lasts = {normkey(l.text) for a in paper.findall('author')
                         if (l := a.find('last')) is not None and l.text}
                u = paper.find('url')
                if u is not None and u.text:
                    url = u.text if u.text.startswith('http') else f'https://aclanthology.org/{u.text}/'
                else:
                    url = f'https://aclanthology.org/2026.{vid}.{paper.get("id")}/'
                index.setdefault(normkey(title), []).append((url, lasts))

    def author_ok(entry_authors, lasts):
        ea = normkey(entry_authors)
        if not lasts: return False
        hits = sum(1 for l in lasts if l and l in ea)
        return hits >= max(1, min(2, len(lasts) // 2))

    keys = list(index.keys())
    linked = 0
    for p in papers:
        k = normkey(p['title'])
        cands = index.get(k)
        if cands:
            ok = [u for u, lasts in cands if author_ok(p['authors'], lasts)] if p['authors'] else [cands[0][0]]
            if ok: p['url'] = ok[0]; linked += 1; continue
        for c in difflib.get_close_matches(k, keys, n=3, cutoff=0.93):
            hit = next((u for u, lasts in index[c] if author_ok(p['authors'], lasts)), None)
            if hit: p['url'] = hit; linked += 1; break
    return linked


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    pdf = args[0]
    xmls = args[args.index('--anthology-xml') + 1:] if '--anthology-xml' in args else []

    text = extract_text(pdf)
    papers = parse_papers(text)
    print('parsed papers:', len(papers))
    matched = finalize(match_papers(papers))
    print('matched:', len(matched))
    from collections import Counter
    print(Counter(t for p in matched for t in p['tags']))
    if xmls:
        print('anthology-linked:', attach_anthology(matched, xmls), 'of', len(matched))
    json.dump(matched, open(OUT, 'w'), separators=(',', ':'), ensure_ascii=False)
    print('wrote', OUT)


if __name__ == '__main__':
    main()
