import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Star, LogOut, Sun, Moon, CalendarDays, Search, Plus, X, Link as LinkIcon,
  StickyNote, Download, AlertTriangle, Lock
} from 'lucide-react'
import ACL_DATA from './acl_data.json'

// v1 gate: only a salted SHA-256 of the credentials lives in the bundle.
// v2 will move auth + sync to Firebase (project is already initialized).
const AUTH_HASH = '799f7ddc4a071642b1ab3c4dfec8ec4ba1816ae74b9fed6f055b0524be4e5ab5'
const SALT = 'ag-hub-2026'
const LS_AUTH = 'ag_hub_auth'
const LS_STARS = 'ag_hub_stars'
const LS_LINKS = 'ag_hub_links'
const LS_NOTES = 'ag_hub_notes'

const TAG_LABELS = {
  mine: 'Mine', lab: 'Lab & friends', faculty: 'Target faculty',
  usc: 'USC', nyu: 'NYU', topic: 'Topic match',
}
const DAYS = [
  { key: '2026-07-05', label: 'Sun 5' },
  { key: '2026-07-06', label: 'Mon 6' },
  { key: '2026-07-07', label: 'Tue 7' },
]
const DEFAULT_LINKS = [
  { title: 'ACL 2026 notes (Notion)', url: 'https://amazon-podcasts.notion.site/ACL-2026-39109b5e127b80d88cc0f5124026e63d' },
  { title: 'Underline · ACL 2026', url: 'https://underline.io/events/524/sessions' },
  { title: 'ACL Anthology · ACL 2026', url: 'https://aclanthology.org/events/acl-2026/' },
  { title: 'iCloud Calendar', url: 'https://www.icloud.com/calendar/' },
]

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'light'
    return document.documentElement.getAttribute('data-theme') || 'light'
  })
  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      try { localStorage.setItem('theme', next) } catch { /* ignore */ }
      return next
    })
  }
  return [theme, toggleTheme]
}

function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initial
    } catch { return initial }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
  }, [key, value])
  return [value, setValue]
}

async function hashCreds(user, pass) {
  const data = new TextEncoder().encode(`${user}:${pass}:${SALT}`)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── ICS export (Apple Calendar friendly) ─────────────────────
function icsEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}
function buildICS(items) {
  const dt = (day, time) => `${day.replace(/-/g, '')}T${time.replace(':', '')}00`
  const events = items.map(p => [
    'BEGIN:VEVENT',
    `UID:${p.id}@abhinavgupta.dev`,
    `DTSTART;TZID=America/Los_Angeles:${dt(p.day, p.start)}`,
    `DTEND;TZID=America/Los_Angeles:${dt(p.day, p.end)}`,
    `SUMMARY:${icsEscape(`[${p.session.startsWith('Poster') ? 'Poster' : 'Oral'}] ${p.title}`)}`,
    `LOCATION:${icsEscape(`${p.room} — ${p.session}`)}`,
    `DESCRIPTION:${icsEscape(`${p.authors}\nWhy: ${p.reasons.join(', ')}`)}`,
    'BEGIN:VALARM', 'TRIGGER:-PT30M', 'ACTION:DISPLAY', `DESCRIPTION:${icsEscape(p.title)}`, 'END:VALARM',
    'END:VEVENT',
  ].join('\r\n')).join('\r\n')
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//abhinavgupta.dev//hub//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VTIMEZONE', 'TZID:America/Los_Angeles',
    'BEGIN:DAYLIGHT', 'TZOFFSETFROM:-0800', 'TZOFFSETTO:-0700', 'TZNAME:PDT', 'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'END:DAYLIGHT',
    'BEGIN:STANDARD', 'TZOFFSETFROM:-0700', 'TZOFFSETTO:-0800', 'TZNAME:PST', 'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'END:STANDARD',
    'END:VTIMEZONE',
    events,
    'END:VCALENDAR',
  ].join('\r\n')
}
function downloadICS(items) {
  const blob = new Blob([buildICS(items)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'acl-2026-agenda.ics'
  a.click()
  URL.revokeObjectURL(url)
}

// Minutes since midnight, for overlap detection
const mins = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
function overlaps(a, b) {
  return a.day === b.day && mins(a.start) < mins(b.end) && mins(b.start) < mins(a.end) && a.id !== b.id
}

// ── LOGIN ────────────────────────────────────────────────────
function Login({ onAuthed }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e?.preventDefault?.()
    setBusy(true)
    const h = await hashCreds(user.trim(), pass)
    if (h === AUTH_HASH) {
      if (remember) { try { localStorage.setItem(LS_AUTH, h) } catch { /* ignore */ } }
      onAuthed()
    } else {
      setError(true)
      setTimeout(() => setError(false), 1600)
    }
    setBusy(false)
  }

  return (
    <div className="hub-login">
      <Lock size={18} className="hub-login-icon" aria-hidden="true" />
      <h1 className="hub-login-title">The Hub</h1>
      <form className={`hub-login-form ${error ? 'error' : ''}`} onSubmit={submit}>
        <input className="hub-input" placeholder="login" value={user} autoCapitalize="none"
          onChange={e => setUser(e.target.value)} autoFocus />
        <input className="hub-input" placeholder="password" type="password" value={pass}
          onChange={e => setPass(e.target.value)} />
        <label className="hub-remember">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
          remember this device
        </label>
        <button className="hub-primary" type="submit" disabled={busy || !user || !pass}>
          {error ? 'nope' : 'enter'}
        </button>
      </form>
    </div>
  )
}

// ── PAPER ROW ────────────────────────────────────────────────
function PaperRow({ p, starred, onStar, conflict }) {
  const dayShort = p.dayName.slice(0, 3)
  return (
    <div className={`hub-paper ${starred ? 'starred' : ''}`}>
      <button
        className={`hub-star ${starred ? 'on' : ''}`}
        onClick={() => onStar(p.id)}
        aria-label={starred ? 'Unstar' : 'Star'}
      >
        <Star size={15} fill={starred ? 'currentColor' : 'none'} />
      </button>
      <div className="hub-paper-body">
        <div className="hub-paper-meta">
          <code className="hub-when">{dayShort} {p.start}–{p.end}</code>
          <span className="hub-room">{p.room}</span>
          <span className="hub-type">{p.type}</span>
          {conflict && <span className="hub-conflict"><AlertTriangle size={11} /> overlap</span>}
        </div>
        <p className="hub-paper-title">{p.title}</p>
        <p className="hub-paper-authors">{p.authors}</p>
        <div className="hub-paper-foot">
          <span className="hub-session">{p.session}</span>
          {p.reasons.slice(0, 4).map(r => <span key={r} className="hub-reason">{r}</span>)}
        </div>
      </div>
    </div>
  )
}

// ── MAIN ─────────────────────────────────────────────────────
export default function Hub() {
  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem(LS_AUTH) === AUTH_HASH } catch { return false }
  })
  const [theme, toggleTheme] = useTheme()
  const [stars, setStars] = useLocalState(LS_STARS, [])
  const [links, setLinks] = useLocalState(LS_LINKS, DEFAULT_LINKS)
  const [notes, setNotes] = useLocalState(LS_NOTES, '')
  const [view, setView] = useState(() => {
    try { return new URLSearchParams(window.location.search).get('view') === 'agenda' ? 'agenda' : 'all' } catch { return 'all' }
  })
  const [query, setQuery] = useState('')
  const [dayFilter, setDayFilter] = useState(null)
  const [tagFilter, setTagFilter] = useState([])
  const [newLink, setNewLink] = useState({ title: '', url: '' })

  useEffect(() => {
    document.title = 'Hub'
    return () => { document.title = 'Abhinav Gupta' }
  }, [])

  const toggleStar = useCallback((id) => {
    setStars(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }, [setStars])

  const starSet = useMemo(() => new Set(stars), [stars])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ACL_DATA.filter(p => {
      if (dayFilter && p.day !== dayFilter) return false
      if (tagFilter.length && !tagFilter.some(t => p.tags.includes(t))) return false
      if (q && !(p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q))) return false
      return true
    })
  }, [query, dayFilter, tagFilter])

  const agenda = useMemo(() => {
    const starredItems = ACL_DATA.filter(p => starSet.has(p.id))
    const byDay = new Map()
    for (const p of starredItems) {
      if (!byDay.has(p.day)) byDay.set(p.day, [])
      byDay.get(p.day).push(p)
    }
    for (const list of byDay.values()) list.sort((a, b) => a.start.localeCompare(b.start))
    return [...byDay.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [starSet])

  const starredItems = useMemo(() => ACL_DATA.filter(p => starSet.has(p.id)), [starSet])
  const conflictIds = useMemo(() => {
    const ids = new Set()
    for (const a of starredItems) for (const b of starredItems) {
      if (overlaps(a, b)) { ids.add(a.id); ids.add(b.id) }
    }
    return ids
  }, [starredItems])

  const logout = () => {
    try { localStorage.removeItem(LS_AUTH) } catch { /* ignore */ }
    setAuthed(false)
  }

  const addLink = (e) => {
    e.preventDefault()
    if (!newLink.title.trim() || !newLink.url.trim()) return
    const url = /^https?:\/\//.test(newLink.url) ? newLink.url : `https://${newLink.url}`
    setLinks(prev => [...prev, { title: newLink.title.trim(), url }])
    setNewLink({ title: '', url: '' })
  }

  if (!authed) {
    return <div className="hub"><style>{HUB_CSS}</style><Login onAuthed={() => setAuthed(true)} /></div>
  }

  const todayISO = new Date().toISOString().slice(0, 10)

  return (
    <div className="hub">
      <style>{HUB_CSS}</style>

      <header className="hub-header">
        <div className="hub-header-inner">
          <div>
            <h1 className="hub-title">The Hub</h1>
            <p className="hub-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <div className="hub-header-actions">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button className="theme-toggle" onClick={logout} aria-label="Lock hub" title="Lock">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <section>
        <div className="container">
          <h2 className="section-title"><LinkIcon size={16} className="title-icon" aria-hidden="true" /> Quick Links</h2>
          <div className="hub-links">
            {links.map((l, i) => (
              <div key={i} className="hub-link-row">
                <a href={l.url} target="_blank" rel="noreferrer" className="hub-link">{l.title}</a>
                <span className="hub-link-url">{l.url.replace(/^https?:\/\//, '').slice(0, 48)}</span>
                <button className="hub-link-x" onClick={() => setLinks(prev => prev.filter((_, j) => j !== i))} aria-label="Remove link"><X size={13} /></button>
              </div>
            ))}
          </div>
          <form className="hub-addlink" onSubmit={addLink}>
            <input className="hub-input" placeholder="title" value={newLink.title} onChange={e => setNewLink({ ...newLink, title: e.target.value })} />
            <input className="hub-input grow" placeholder="url" value={newLink.url} onChange={e => setNewLink({ ...newLink, url: e.target.value })} />
            <button className="hub-primary" type="submit"><Plus size={13} /> add</button>
          </form>
        </div>
      </section>

      <section>
        <div className="container">
          <h2 className="section-title"><CalendarDays size={17} className="title-icon" aria-hidden="true" /> ACL 2026 · San Diego</h2>

          <div className="hub-toolbar">
            <div className="hub-views">
              <button className={`hub-view-btn ${view === 'all' ? 'active' : ''}`} onClick={() => setView('all')}>All papers</button>
              <button className={`hub-view-btn ${view === 'agenda' ? 'active' : ''}`} onClick={() => setView('agenda')}>My agenda ({stars.length})</button>
            </div>
            {view === 'agenda' && stars.length > 0 && (
              <button className="hub-primary hub-export" onClick={() => downloadICS(starredItems)}>
                <Download size={13} /> Apple Calendar (.ics)
              </button>
            )}
          </div>

          {view === 'all' && (
            <>
              <div className="hub-filters">
                <div className="hub-search">
                  <Search size={13} aria-hidden="true" />
                  <input placeholder="Search titles & authors…" value={query} onChange={e => setQuery(e.target.value)} />
                </div>
                <div className="hub-chiprow">
                  {DAYS.map(d => (
                    <button key={d.key}
                      className={`paper-badge hub-chip ${dayFilter === d.key ? 'active' : ''} ${d.key === todayISO ? 'today' : ''}`}
                      onClick={() => setDayFilter(dayFilter === d.key ? null : d.key)}>
                      {d.label}{d.key === todayISO ? ' · today' : ''}
                    </button>
                  ))}
                  <span className="hub-chip-sep" />
                  {Object.entries(TAG_LABELS).map(([tag, label]) => (
                    <button key={tag}
                      className={`paper-badge hub-chip ${tagFilter.includes(tag) ? 'active' : ''}`}
                      onClick={() => setTagFilter(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="hub-count">{filtered.length} of {ACL_DATA.length} candidates · {stars.length} starred</p>
              <div className="hub-list">
                {filtered.map(p => (
                  <PaperRow key={p.id} p={p} starred={starSet.has(p.id)} onStar={toggleStar} conflict={false} />
                ))}
                {filtered.length === 0 && <p className="hub-empty">Nothing matches — loosen the filters.</p>}
              </div>
            </>
          )}

          {view === 'agenda' && (
            <div className="hub-agenda">
              {agenda.length === 0 && <p className="hub-empty">No stars yet — flip to “All papers” and star what you want to attend.</p>}
              {agenda.map(([day, items]) => (
                <div key={day} className="hub-agenda-day">
                  <h3 className="subsection-title">{new Date(day + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}{day === todayISO ? ' — today' : ''}</h3>
                  {items.map(p => (
                    <PaperRow key={p.id} p={p} starred onStar={toggleStar} conflict={conflictIds.has(p.id)} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="container">
          <h2 className="section-title"><StickyNote size={16} className="title-icon" aria-hidden="true" /> Scratch</h2>
          <textarea
            className="hub-notes"
            placeholder="Current stuff — todos, ideas, people to email…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={8}
          />
          <p className="hub-hint">Saved on this device. Syncs across devices in v2 (Firebase).</p>
        </div>
      </section>

      <footer className="footer">
        <p>The Hub · v1 · local-only</p>
      </footer>
    </div>
  )
}

const HUB_CSS = `
  .hub { min-height: 100vh; background: var(--bg); color: var(--text); }
  .hub .container { max-width: 940px; padding-top: 1.6rem; padding-bottom: 1.6rem; }

  /* Login */
  .hub-login {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 0.5rem; padding: 1.5rem;
  }
  .hub-login-icon { color: var(--light-gray); }
  .hub-login-title { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; color: var(--dark); margin-bottom: 0.75rem; }
  .hub-login-form { display: flex; flex-direction: column; gap: 0.6rem; width: min(280px, 86vw); }
  .hub-login-form.error { animation: hub-shake 0.3s; }
  @keyframes hub-shake { 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
  .hub-remember { display: flex; align-items: center; gap: 0.45rem; font-size: 0.8rem; color: var(--light-gray); }
  .hub-input {
    padding: 0.55rem 0.8rem; border: 1px solid var(--border); border-radius: 6px;
    background: var(--bg); color: var(--dark); font-size: 0.9rem; font-family: inherit; outline: none;
    transition: border-color 0.2s;
  }
  .hub-input:focus { border-color: var(--primary); }
  .hub-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
    padding: 0.55rem 1.1rem; border: none; border-radius: 6px;
    background: var(--primary); color: var(--bg); font-size: 0.85rem; font-weight: 600;
    font-family: inherit; cursor: pointer; transition: opacity 0.2s;
  }
  .hub-primary:hover { opacity: 0.9; }
  .hub-primary:disabled { opacity: 0.5; cursor: default; }

  /* Header */
  .hub-header { border-bottom: 1px solid var(--border); }
  .hub-header-inner {
    max-width: 940px; margin: 0 auto; padding: 1.6rem 1.2rem 1.2rem;
    display: flex; align-items: flex-start; gap: 1rem;
  }
  .hub-title { font-family: var(--font-serif); font-size: 1.7rem; font-weight: 700; color: var(--dark); }
  .hub-date { font-size: 0.85rem; color: var(--light-gray); }
  .hub-header-actions { margin-left: auto; display: flex; gap: 0.5rem; }

  /* Toolbar & filters */
  .hub-toolbar { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.9rem; }
  .hub-views { display: flex; gap: 0.75rem; }
  .hub-view-btn {
    background: none; border: none; padding: 0.25rem 0.1rem; font-family: inherit;
    font-size: 0.9rem; font-weight: 600; color: var(--light-gray); cursor: pointer;
    border-bottom: 2px solid transparent; transition: color 0.2s, border-color 0.2s;
  }
  .hub-view-btn:hover { color: var(--primary); }
  .hub-view-btn.active { color: var(--dark); border-bottom-color: var(--primary); }
  .hub-export { margin-left: auto; padding: 0.45rem 0.9rem; font-size: 0.78rem; }
  .hub-filters { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 0.5rem; }
  .hub-search {
    display: flex; align-items: center; gap: 0.5rem; max-width: 380px;
    border: 1px solid var(--border); border-radius: 6px; padding: 0.45rem 0.7rem;
    color: var(--light-gray);
  }
  .hub-search input {
    border: none; outline: none; background: none; flex: 1;
    font-size: 0.85rem; font-family: inherit; color: var(--dark);
  }
  .hub-chiprow { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
  .hub-chip { cursor: pointer; }
  .hub-chip.active { color: var(--primary); border-color: var(--primary); background: var(--bg-subtle); }
  .hub-chip.today { font-weight: 700; }
  .hub-chip-sep { width: 1px; height: 14px; background: var(--border); margin: 0 0.25rem; }
  .hub-count { font-family: var(--font-mono); font-size: 0.72rem; color: var(--light-gray); margin: 0.5rem 0 0.9rem; }

  /* Paper rows */
  .hub-list, .hub-agenda { display: flex; flex-direction: column; }
  .hub-paper {
    display: flex; gap: 0.7rem; padding: 0.8rem 0;
    border-bottom: 1px solid var(--border);
  }
  .hub-paper:last-child { border-bottom: none; }
  .hub-star {
    background: none; border: none; cursor: pointer; color: var(--light-gray);
    padding: 0.15rem; height: fit-content; transition: color 0.15s, transform 0.15s;
  }
  .hub-star:hover { color: var(--primary); transform: scale(1.15); }
  .hub-star.on { color: var(--primary); }
  .hub-paper-body { flex: 1; min-width: 0; }
  .hub-paper-meta { display: flex; align-items: center; gap: 0.55rem; flex-wrap: wrap; margin-bottom: 0.2rem; }
  .hub-when {
    font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600;
    color: var(--light-gray); background: var(--bg-subtle);
    padding: 0.1rem 0.4rem; border-radius: 3px;
  }
  .hub-room { font-size: 0.75rem; font-weight: 600; color: var(--primary); }
  .hub-type { font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--light-gray); }
  .hub-conflict {
    display: inline-flex; align-items: center; gap: 0.25rem;
    font-size: 0.68rem; font-weight: 600; color: #b3564f;
  }
  .hub-paper-title { font-family: var(--font-serif); font-size: 0.925rem; font-weight: 600; color: var(--dark); line-height: 1.4; margin-bottom: 0.15rem; }
  .hub-paper-authors { font-size: 0.78rem; color: var(--text); margin-bottom: 0.25rem; }
  .hub-paper-foot { display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; }
  .hub-session { font-size: 0.72rem; font-style: italic; color: var(--light-gray); margin-right: 0.2rem; }
  .hub-reason {
    font-family: var(--font-mono); font-size: 0.62rem; color: var(--light-gray);
    border: 1px solid var(--border); border-radius: 3px; padding: 0.05rem 0.35rem;
  }
  .hub-paper.starred .hub-paper-title { color: var(--primary); }
  .hub-empty { font-size: 0.85rem; color: var(--light-gray); font-style: italic; padding: 1rem 0; }
  .hub-agenda-day { margin-bottom: 1.4rem; }

  /* Links */
  .hub-links { display: flex; flex-direction: column; }
  .hub-link-row {
    display: flex; align-items: baseline; gap: 0.7rem;
    padding: 0.5rem 0; border-bottom: 1px solid var(--border);
  }
  .hub-link-row:last-child { border-bottom: none; }
  .hub-link { font-size: 0.9rem; font-weight: 500; color: var(--primary); text-decoration: none; }
  .hub-link:hover { color: var(--primary-dark); }
  .hub-link-url { font-family: var(--font-mono); font-size: 0.68rem; color: var(--light-gray); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .hub-link-x { background: none; border: none; color: var(--light-gray); cursor: pointer; padding: 0.1rem; }
  .hub-link-x:hover { color: #b3564f; }
  .hub-addlink { display: flex; gap: 0.5rem; margin-top: 0.9rem; flex-wrap: wrap; }
  .hub-addlink .hub-input { flex: 0 1 180px; font-size: 0.82rem; }
  .hub-addlink .hub-input.grow { flex: 1 1 240px; }

  /* Notes */
  .hub-notes {
    width: 100%; padding: 0.8rem 0.9rem; border: 1px solid var(--border); border-radius: 6px;
    background: var(--bg-subtle); color: var(--dark);
    font-size: 0.875rem; font-family: inherit; line-height: 1.6;
    outline: none; resize: vertical; transition: border-color 0.2s;
  }
  .hub-notes:focus { border-color: var(--primary); }
  .hub-hint { font-size: 0.72rem; color: var(--light-gray); margin-top: 0.4rem; font-style: italic; }

  @media (max-width: 560px) {
    .hub .container { padding-left: 1rem; padding-right: 1rem; }
    .hub-header-inner { padding: 1.2rem 1rem 0.9rem; }
    .hub-title { font-size: 1.4rem; }
    .hub-export { margin-left: 0; }
    .hub-paper-title { font-size: 0.875rem; }
    .hub-paper-authors { font-size: 0.75rem; }
  }
`
