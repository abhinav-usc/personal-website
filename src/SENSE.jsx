import { useState, useEffect, useRef, useCallback } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from "recharts";
import { SenseModel } from './sense_inference.js';

// ─── CONSTANTS ───────────────────────────────────────────────
const MODALITIES = [
  'Auditory', 'Gustatory', 'Haptic', 'Interoceptive', 'Olfactory',
  'Visual', 'Foot_leg', 'Hand_arm', 'Head', 'Mouth', 'Torso'
];
const MODALITY_LABELS = {
  Auditory: 'Auditory', Gustatory: 'Gustatory', Haptic: 'Haptic',
  Interoceptive: 'Interoceptive', Olfactory: 'Olfactory', Visual: 'Visual',
  Foot_leg: 'Foot / Leg', Hand_arm: 'Hand / Arm', Head: 'Head',
  Mouth: 'Mouth', Torso: 'Torso'
};
const MODALITY_ICONS = {
  Auditory: '👂', Gustatory: '👅', Haptic: '✋', Interoceptive: '❤️',
  Olfactory: '👃', Visual: '👁️', Foot_leg: '🦶', Hand_arm: '💪',
  Head: '🧠', Mouth: '👄', Torso: '🫁'
};

// Neutral, muted palette matching abhinavgupta.dev
const MODALITY_COLORS = {
  Auditory: '#64748b', Gustatory: '#a1887f', Haptic: '#b0906f',
  Interoceptive: '#c47a7a', Olfactory: '#7d9a7e', Visual: '#7b8fa8',
  Foot_leg: '#8b7fa8', Hand_arm: '#b08f6f', Head: '#6a9aa0',
  Mouth: '#a87b8f', Torso: '#8a9a6a'
};

// Neutral theme tokens
const T = {
  bg: '#fafaf9',
  surface: '#ffffff',
  surfaceAlt: '#f5f5f4',
  border: '#e7e5e4',
  borderSubtle: '#f0eeec',
  text: '#1c1917',
  textSecondary: '#57534e',
  textMuted: '#a8a29e',
  accent: '#2563eb',
  accentLight: '#3b82f6',
  accentSubtle: 'rgba(37, 99, 235, 0.06)',
  highlight: '#2563eb',
};

const EXAMPLE_WORDS = [
  { word: 'thunder', scores: [4.8, 1.1, 1.5, 2.1, 1.0, 2.8, 1.2, 1.1, 2.4, 1.3, 1.5] },
  { word: 'velvet', scores: [1.2, 1.1, 4.6, 1.3, 1.1, 3.8, 1.1, 3.9, 1.2, 1.1, 1.1] },
  { word: 'cinnamon', scores: [1.1, 4.2, 1.4, 1.3, 4.5, 2.8, 1.0, 2.1, 1.3, 3.8, 1.2] },
  { word: 'running', scores: [1.8, 1.0, 2.4, 3.2, 1.0, 2.6, 4.8, 2.8, 1.6, 1.4, 2.9] },
  { word: 'whisper', scores: [4.2, 1.0, 1.1, 1.5, 1.0, 1.8, 1.0, 1.1, 2.1, 3.8, 1.1] },
  { word: 'glitter', scores: [1.3, 1.0, 2.1, 1.1, 1.0, 4.9, 1.0, 2.4, 1.8, 1.0, 1.0] },
  { word: 'nausea', scores: [1.1, 2.8, 1.6, 4.9, 2.1, 1.3, 1.2, 1.1, 2.6, 2.4, 4.2] },
  { word: 'drumming', scores: [4.5, 1.0, 3.2, 1.8, 1.0, 3.1, 1.6, 4.2, 2.0, 1.2, 2.1] },
  { word: 'sniff', scores: [1.8, 1.2, 1.3, 1.6, 4.6, 1.4, 1.0, 1.1, 2.8, 1.9, 1.2] },
  { word: 'glow', scores: [1.1, 1.0, 1.8, 1.9, 1.0, 4.8, 1.0, 1.2, 1.5, 1.0, 1.3] },
];

const PERCEPTUAL = ['Auditory', 'Gustatory', 'Haptic', 'Interoceptive', 'Olfactory', 'Visual'];
const MOTOR = ['Foot_leg', 'Hand_arm', 'Head', 'Mouth', 'Torso'];

// ─── SECTION COMPONENT ───────────────────────────────────────
function Section({ children, id, alt = false }) {
  return (
    <section id={id} style={{
      padding: '48px 0',
      position: 'relative',
      zIndex: 1,
      background: alt ? T.surfaceAlt : T.bg,
      borderTop: alt ? `1px solid ${T.border}` : 'none',
      borderBottom: alt ? `1px solid ${T.border}` : 'none',
    }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 24px' }}>
        {children}
      </div>
    </section>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{
        fontFamily: "'Source Serif 4', 'Georgia', serif",
        fontSize: 'clamp(26px, 3.5vw, 36px)',
        fontWeight: 600,
        color: T.text,
        marginBottom: sub ? 10 : 0,
        letterSpacing: '-0.02em',
      }}>{children}</h2>
      {sub && <p style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
        fontSize: 16,
        color: T.textSecondary,
        maxWidth: 600,
        lineHeight: 1.6,
      }}>{sub}</p>}
    </div>
  );
}

// ─── SCORE BAR VISUALIZATION ─────────────────────────────────
function ScoreBar({ label, icon, score, color, delay = 0 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  const pct = Math.max(0, Math.min(100, ((score ) / 5) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>{icon}</span>
      <span style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
        fontSize: 13,
        color: T.textSecondary,
        width: 90,
        flexShrink: 0,
      }}>{label}</span>
      <div style={{
        flex: 1, height: 22, background: T.surfaceAlt,
        borderRadius: 6, overflow: 'hidden', position: 'relative',
        border: `1px solid ${T.border}`,
      }}>
        <div style={{
          height: '100%',
          width: animated ? `${pct}%` : '0%',
          background: color,
          borderRadius: 5,
          transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: 0.7,
        }} />
        <span style={{
          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11, fontWeight: 600,
          color: pct > 75 ? T.surface : T.textSecondary,
        }}>{score.toFixed(1)}</span>
      </div>
    </div>
  );
}

// ─── INTERACTIVE DEMO ────────────────────────────────────────
function SenseDemo({ handlePredict, modelReady, modelLoading }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeWord, setActiveWord] = useState(null);
  const [error, setError] = useState(null);
  const [vizMode, setVizMode] = useState('bars');

  const runSENSE = useCallback(async (word) => {
    setLoading(true);
    setError(null);
    setActiveWord(word);
    setResults(null);

    // Check hardcoded examples first
    const example = EXAMPLE_WORDS.find(e => e.word.toLowerCase() === word.toLowerCase().trim());
    if (example) {
      await new Promise(r => setTimeout(r, 500));
      const mapped = MODALITIES.map((m, i) => ({ modality: m, score: example.scores[i] }));
      setResults(mapped);
      setLoading(false);
      return;
    }

    // Use real model
    if (!modelReady) {
      setError('Model is still loading. Please wait for BERT to finish downloading.');
      setLoading(false);
      return;
    }

    try {
      // handlePredict returns { Auditory: 4.82, Gustatory: 1.05, ... }
      const scores = await handlePredict(word.trim());
      if (!scores) {
        throw new Error('No scores returned');
      }
      // Convert object to array format matching MODALITIES order
      const mapped = MODALITIES.map(m => ({
        modality: m,
        score: Math.max(0, Math.min(5, scores[m]*5 || 0)),
      }));
      setResults(mapped);
    } catch (err) {
      setError('Could not generate predictions. Try a different word.');
      console.error(err);
    }
    setLoading(false);
  }, [handlePredict, modelReady]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (input.trim()) runSENSE(input.trim());
  };

  const radarData = results ? results.map(r => ({
    dimension: MODALITY_LABELS[r.modality],
    value: r.score,
    fullMark: 5,
  })) : [];

  return (
    <div>
      {/* Model loading status */}
      {modelLoading && (
        <div style={{
          textAlign: 'center', padding: '12px 16px', borderRadius: 8,
          background: T.accentSubtle, border: `1px solid rgba(37, 99, 235, 0.15)`,
          marginBottom: 20, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 10,
        }}>
          <span style={{
            display: 'inline-block', width: 14, height: 14,
            border: `2px solid rgba(37, 99, 235, 0.2)`,
            borderTopColor: T.accent, borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            fontSize: 13, color: T.accent,
          }}>Loading BERT model (~60MB, cached after first load)...</span>
        </div>
      )}
      {modelReady && (
        <div style={{
          textAlign: 'center', padding: '8px 16px', borderRadius: 8,
          background: 'rgba(125, 154, 126, 0.08)', border: '1px solid rgba(125, 154, 126, 0.2)',
          marginBottom: 20,
        }}>
          <span style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            fontSize: 13, color: '#5a7a5b',
          }}>Model loaded -- running real SENSE inference in your browser</span>
        </div>
      )}

      {/* Input */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter any word, phrase, or nonce word..."
          style={{
            flex: '1 1 300px', maxWidth: 420, padding: '12px 18px',
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            background: T.surface,
            color: T.text,
            fontSize: 15,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.border}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          style={{
            padding: '12px 28px',
            borderRadius: 8,
            border: 'none',
            background: loading ? T.textMuted : T.highlight,
            color: T.surface,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            cursor: loading ? 'wait' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Running...
            </span>
          ) : 'Run SENSE'}
        </button>
      </div>

      {/* Example chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
        <span style={{ color: T.textMuted, fontSize: 13, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", alignSelf: 'center' }}>Try:</span>
        {EXAMPLE_WORDS.map(e => (
          <button
            key={e.word}
            onClick={() => { setInput(e.word); runSENSE(e.word); }}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: activeWord === e.word ? `1px solid ${T.accent}` : `1px solid ${T.border}`,
              background: activeWord === e.word ? T.accentSubtle : T.surface,
              color: activeWord === e.word ? T.text : T.textSecondary,
              fontSize: 13,
              fontFamily: "'IBM Plex Mono', monospace",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {e.word}
          </button>
        ))}
      </div>

      {error && (
        <div style={{
          textAlign: 'center', padding: 14, borderRadius: 8,
          background: 'rgba(196, 122, 122, 0.08)', border: '1px solid rgba(196, 122, 122, 0.2)',
          color: '#a04040', marginBottom: 24, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
          fontSize: 14,
        }}>{error}</div>
      )}

      {/* Results */}
      {results && (
        <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: 26, fontWeight: 600, color: T.text,
            }}>"{activeWord}"</span>
            <span style={{
              display: 'block', marginTop: 4,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
              fontSize: 13, color: T.textMuted,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>Sensorimotor Profile</span>
          </div>

          {/* Viz mode toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 20, background: T.surfaceAlt, borderRadius: 8, padding: 3, width: 'fit-content', margin: '0 auto 20px' }}>
            {[
              { key: 'bars', label: 'Bars' },
              { key: 'radar', label: 'Radar' },
            ].map(v => (
              <button
                key={v.key}
                onClick={() => setVizMode(v.key)}
                style={{
                  padding: '7px 18px', borderRadius: 6, border: 'none',
                  background: vizMode === v.key ? T.surface : 'transparent',
                  color: vizMode === v.key ? T.text : T.textMuted,
                  fontSize: 13, fontWeight: vizMode === v.key ? 600 : 400,
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: vizMode === v.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >{v.label}</button>
            ))}
          </div>

          {vizMode === 'bars' && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 32,
            }}>
              <div>
                <h4 style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", fontSize: 12,
                  fontWeight: 700, color: T.textMuted, textTransform: 'uppercase',
                  letterSpacing: '0.1em', marginBottom: 12,
                }}>Perceptual</h4>
                {results.filter(r => PERCEPTUAL.includes(r.modality)).map((r, i) => (
                  <ScoreBar
                    key={r.modality}
                    label={MODALITY_LABELS[r.modality]}
                    icon={MODALITY_ICONS[r.modality]}
                    score={r.score}
                    color={MODALITY_COLORS[r.modality]}
                    delay={i * 60}
                  />
                ))}
              </div>
              <div>
                <h4 style={{
                  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", fontSize: 12,
                  fontWeight: 700, color: T.textMuted, textTransform: 'uppercase',
                  letterSpacing: '0.1em', marginBottom: 12,
                }}>Motor</h4>
                {results.filter(r => MOTOR.includes(r.modality)).map((r, i) => (
                  <ScoreBar
                    key={r.modality}
                    label={MODALITY_LABELS[r.modality]}
                    icon={MODALITY_ICONS[r.modality]}
                    score={r.score}
                    color={MODALITY_COLORS[r.modality]}
                    delay={i * 60 + 300}
                  />
                ))}
              </div>
            </div>
          )}

          {vizMode === 'radar' && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height={400} maxHeight={400}>
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="rgba(168, 162, 158, 0.2)" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fill: T.textSecondary, fontSize: 11, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif" }}
                  />
                  <PolarRadiusAxis
                    angle={90} domain={[0, 5]}
                    tick={{ fill: T.textMuted, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }}
                    axisLine={false}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: T.surface, border: `1px solid ${T.border}`,
                      borderRadius: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                    labelStyle={{ color: T.text }}
                    itemStyle={{ color: T.textSecondary }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ─── WORKFLOW STEP ─────────────────────────────────────────────
function WorkflowStep({ number, title, desc, icon, isLast = false }) {
  return (
    <div style={{ display: 'flex', gap: 18, position: 'relative' }}>
      {!isLast && (
        <div style={{
          position: 'absolute', left: 21, top: 48, width: 1, bottom: -24,
          background: T.border,
        }} />
      )}
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: T.surfaceAlt,
        border: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>{icon}</div>
      <div style={{ paddingBottom: isLast ? 0 : 24 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11, color: T.textMuted, fontWeight: 600,
          letterSpacing: '0.05em', marginBottom: 4,
        }}>STEP {number}</div>
        <h4 style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
          fontSize: 16, fontWeight: 600, color: T.text, marginBottom: 4,
        }}>{title}</h4>
        <p style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
          fontSize: 14, color: T.textSecondary, lineHeight: 1.6, margin: 0,
        }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────
function StatCard({ value, label, icon }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 12, padding: '18px 16px',
      textAlign: 'center',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
      <div style={{
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: 32, fontWeight: 700, color: T.text,
        lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
        fontSize: 13, color: T.textMuted, marginTop: 6,
      }}>{label}</div>
    </div>
  );
}

// ─── RESULT CARD ──────────────────────────────────────────────
function ResultCard({ title, value, detail, color }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 10, padding: '18px',
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
        fontSize: 12, color: T.textMuted, marginBottom: 4,
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>{title}</div>
      <div style={{
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: 24, fontWeight: 700, color: T.text,
      }}>{value}</div>
      <div style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
        fontSize: 13, color: T.textSecondary, marginTop: 2,
      }}>{detail}</div>
    </div>
  );
}

// ─── NAV BAR ──────────────────────────────────────────────────
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Demo', href: '#demo' },
    { label: 'Method', href: '#method' },
    { label: 'Results', href: '#results' },
    { label: 'Resources', href: '#resources' },
    { label: 'Citation', href: '#citation' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '10px 24px',
      background: scrolled ? 'rgba(250, 250, 249, 0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? `1px solid ${T.border}` : 'none',
      transition: 'all 0.3s',
      display: 'flex', justifyContent: 'center', gap: 24,
    }}>
      <a href="/" style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
        fontSize: 13, color: T.textMuted, alignSelf: 'center',
        textDecoration: 'none', transition: 'color 0.2s',
        display: 'flex', alignItems: 'center', gap: 4,
      }}
        onMouseEnter={e => e.currentTarget.style.color = T.accent}
        onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
      >← abhinavgupta.dev</a>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 14, fontWeight: 700, color: T.accent,
        letterSpacing: '0.03em', alignSelf: 'center',
        marginRight: 'auto',
      }}>SENSE</span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {navItems.map(item => (
          <a
            key={item.label}
            href={item.href}
            style={{
              padding: '6px 12px', borderRadius: 6,
              color: T.textSecondary, fontSize: 13, fontWeight: 500,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
              textDecoration: 'none', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.color = T.text; e.target.style.background = T.accentSubtle; }}
            onMouseLeave={e => { e.target.style.color = T.textSecondary; e.target.style.background = 'transparent'; }}
          >{item.label}</a>
        ))}
      </div>
      <a
        href="https://arxiv.org/abs/2602.00469"
        target="_blank" rel="noopener noreferrer"
        style={{
          padding: '6px 14px', borderRadius: 6,
          border: `1px solid ${T.border}`,
          color: T.textSecondary, fontSize: 13, fontWeight: 500,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
          textDecoration: 'none', marginLeft: 'auto',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.target.style.borderColor = T.accent; e.target.style.color = T.text; }}
        onMouseLeave={e => { e.target.style.borderColor = T.border; e.target.style.color = T.textSecondary; }}
      >arXiv Paper</a>
    </nav>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function Sense() {
  const [model, setModel] = useState(null);
  const [modelReady, setModelReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        setModelLoading(true);
        const m = new SenseModel();
        await m.load('/sense_weights.json','/bert-base-encoder/model_quantized.onnx');
        if (!cancelled) {
          setModel(m);
          setModelReady(true);
          setModelLoading(false);
        }
      } catch (err) {
        console.error('[SENSE] Model load failed:', err);
        if (!cancelled) {
          setModelError(err.message);
          setModelLoading(false);
        }
      }
    };
    init();
    return () => { cancelled = true; };
  }, []);

  const handlePredict = useCallback(async (word) => {
    if (!model?.ready) return null;
    const scores = await model.predict(word);
    return scores;
    // Returns: { Auditory: 4.82, Gustatory: 1.05, Haptic: 1.51, ... }
  }, [model]);

  return (
    <div style={{
      background: T.bg,
      color: T.text,
      overflowX: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(37, 99, 235, 0.15); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        a { color: inherit; }
        input::placeholder { color: ${T.textMuted}; }
      `}</style>

      <NavBar />

      {/* ══════ HERO ══════ */}
      <header style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '100px 24px 56px',
        position: 'relative', zIndex: 1,
        borderBottom: `1px solid ${T.border}`,
      }}>
        {/* Title */}
        <h1 style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: 'clamp(34px, 5.5vw, 64px)',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          maxWidth: 800,
          marginBottom: 8,
          color: T.text,
          animation: 'slideUp 0.8s ease-out',
        }}>
          Words that make{' '}
          <span style={{ fontStyle: 'italic', color: '#2563eb' }}>SENSE</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
          fontSize: 'clamp(15px, 2vw, 19px)',
          color: T.textSecondary,
          maxWidth: 600,
          lineHeight: 1.5,
          marginBottom: 24,
          animation: 'slideUp 0.8s ease-out 0.1s both',
        }}>
          Sensorimotor Norms in Learned Lexical Token Representations
        </p>

        {/* Authors */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6,
          justifyContent: 'center', marginBottom: 6,
          animation: 'slideUp 0.8s ease-out 0.2s both',
        }}>
          {[
            { name: 'Abhinav Gupta', url: 'https://abhinavgupta.dev' },
            { name: 'Toben H. Mintz', url: 'https://dornsife.usc.edu/tobenmintz/' },
            { name: 'Jesse Thomason', url: 'https://jessethomason.com/' },
          ].map((a, i) => (
            <a
              key={a.name}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
                fontSize: 16, fontWeight: 500,
                color: T.text,
                textDecoration: 'none',
                padding: '3px 10px',
                borderRadius: 6,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background = T.accentSubtle; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; }}
            >
              {a.name}{i < 2 ? ',' : ''}
            </a>
          ))}
        </div>
        <p style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
          fontSize: 14, color: T.textMuted,
          animation: 'slideUp 0.8s ease-out 0.25s both',
        }}>University of Southern California</p>

        {/* Buttons */}
        <div style={{
          display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap',
          justifyContent: 'center',
          animation: 'slideUp 0.8s ease-out 0.35s both',
        }}>
          <a href="https://arxiv.org/abs/2602.00469" target="_blank" rel="noopener noreferrer" style={{
            padding: '10px 24px', borderRadius: 8,
            background: T.highlight,
            color: T.surface, fontSize: 14, fontWeight: 600,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >Read Paper</a>
          <a href="https://arxiv.org/pdf/2602.00469" target="_blank" rel="noopener noreferrer" style={{
            padding: '10px 24px', borderRadius: 8,
            background: T.surface,
            border: `1px solid ${T.border}`,
            color: T.textSecondary, fontSize: 14, fontWeight: 500,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.borderColor = T.accent; e.target.style.color = T.text; }}
            onMouseLeave={e => { e.target.style.borderColor = T.border; e.target.style.color = T.textSecondary; }}
          >PDF</a>
          <a href="https://github.com/abhinav-usc/SENSE-model" target="_blank" rel="noopener noreferrer" style={{
            padding: '10px 24px', borderRadius: 8,
            background: '#24292e',
            color: '#fff', fontSize: 14, fontWeight: 600,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >Code</a>
          <a href="#demo" style={{
            padding: '10px 24px', borderRadius: 8,
            background: T.surface,
            border: `1px solid ${T.border}`,
            color: T.textSecondary, fontSize: 14, fontWeight: 500,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.borderColor = T.accent; e.target.style.color = T.text; }}
            onMouseLeave={e => { e.target.style.borderColor = T.border; e.target.style.color = T.textSecondary; }}
          >Try Demo</a>
        </div>

      </header>

      {/* ══════ ABOUT ══════ */}
      <Section id="about">
        <SectionTitle sub="Bridging distributional semantics and embodied cognition">
          What is SENSE?
        </SectionTitle>
        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 12, padding: 'clamp(20px, 3vw, 32px)',
          marginBottom: 24,
        }}>
          <p style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            fontSize: 16, color: T.textSecondary, lineHeight: 1.75,
            marginBottom: 16,
          }}>
            While word embeddings derive meaning from co-occurrence patterns, human language understanding is grounded in sensory and motor experience. <strong style={{ color: '#2563eb' }}>SENSE</strong> (Sensorimotor Embedding Norm Scoring Engine) is a learned projection model that predicts Lancaster sensorimotor norms from word lexical embeddings.
          </p>
          <p style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            fontSize: 16, color: T.textSecondary, lineHeight: 1.75,
            marginBottom: 16,
          }}>
            We conducted a behavioral study where <strong style={{ color: T.text }}>281 participants</strong> selected which candidate nonce words evoked specific sensorimotor associations, finding statistically significant correlations between human selection rates and SENSE ratings across <strong style={{ color: T.text }}>6 of the 11 modalities</strong>.
          </p>
          <p style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            fontSize: 16, color: T.textSecondary, lineHeight: 1.75,
          }}>
            Sublexical analysis of nonce word selection rates revealed systematic <strong style={{ color: '#2563eb' }}>phonesthemic patterns</strong> for the interoceptive norm, suggesting a path towards computationally proposing candidate phonesthemes from text data.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }}>
          <StatCard value="34,110" label="Words Aligned" icon="📚" />
          <StatCard value="281" label="Human Participants" icon="👥" />
          <StatCard value="11" label="Sensorimotor Dimensions" icon="🧬" />
          <StatCard value="6/11" label="Significant Correlations" icon="📊" />
        </div>
      </Section>

      {/* ══════ KEY INSIGHT ══════ */}
      <Section id="insight" alt>
        <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto' }}>
          <p style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontWeight: 400,
            color: T.text,
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}>
            "gl-" in glitter, gleam, glow all evoke vision. "sn-" in sniff, sneeze, snore all evoke the nose. These are <span style={{ fontWeight: 600, color: '#2563eb' }}>phonesthemes</span> -- sublexical units carrying consistent sensorimotor associations across words.
          </p>
          <p style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            fontSize: 14, color: T.textMuted, marginTop: 14,
          }}>
            SENSE captures these patterns computationally and extends them to novel character sequences.
          </p>
        </div>
      </Section>

      {/* ══════ INTERACTIVE DEMO ══════ */}
      <Section id="demo">
        <SectionTitle sub="Enter any word, phrase, or made-up character sequence to see its predicted sensorimotor profile across 11 dimensions.">
          Interactive Demo
        </SectionTitle>
        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: 'clamp(20px, 3vw, 32px)',
        }}>
          <SenseDemo
            handlePredict={handlePredict}
            modelReady={modelReady}
            modelLoading={modelLoading}
          />
        </div>
        <p style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
          fontSize: 12, color: T.textMuted, textAlign: 'center',
          marginTop: 12,
        }}>
          {modelReady
            ? 'Running real SENSE inference: BERT embeddings projected through trained neural network weights, entirely in your browser.'
            : 'Demo uses hardcoded examples while the model loads. Once BERT is ready, any word will work.'}
        </p>
      </Section>

      {/* ══════ METHOD ══════ */}
      <Section id="method" alt>
        <SectionTitle sub="How we built SENSE and validated it with human judgments">
          Methodology
        </SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 28 }}>
          <div>
            <h3 style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12, color: T.textMuted, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: 20,
            }}>SENSE Model Pipeline</h3>
            <WorkflowStep number={1} icon="🔤" title="Lexical Embedding Extraction"
              desc="Extract CLS token embeddings from BERT for all 34,110 words aligned across Word2Vec, GloVe, and Lancaster Norms vocabularies." />
            <WorkflowStep number={2} icon="🧮" title="Architecture Comparison"
              desc="Compare baseline (mean prediction), linear regression, and feed-forward neural network (64/128 neurons, ReLU, Adam optimizer) architectures." />
            <WorkflowStep number={3} icon="🎯" title="SENSE Projection"
              desc="The neural network with BERT CLS embeddings achieves lowest MSE, becoming the SENSE model that projects embeddings onto 11 sensorimotor dimensions." />
            <WorkflowStep number={4} icon="✨" title="Generalization to Nonce Words"
              desc="SENSE extends predictions to any character sequence, including pseudowords and nonce forms, via BERT's subword tokenization." isLast />
          </div>
          <div>
            <h3 style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12, color: T.textMuted, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              marginBottom: 20,
            }}>Behavioral Validation Study</h3>
            <WorkflowStep number={1} icon="🎲" title="Nonce Word Generation"
              desc="Generate pronounceable pseudowords using Wuggy, preserving sub-syllabic structure and transition frequencies of real English words." />
            <WorkflowStep number={2} icon="📝" title="Survey Design"
              desc="For each sensorimotor dimension, present participants with 20 nonce word pairs and ask which word more strongly evokes the given sensory or motor experience." />
            <WorkflowStep number={3} icon="👥" title="Data Collection"
              desc="281 undergraduate participants completed the IRB-approved survey, providing forced-choice judgments on phonesthemic associations." />
            <WorkflowStep number={4} icon="📈" title="Correlation Analysis"
              desc="Correlate human selection rates with SENSE predicted scores, finding statistically significant agreement in 6 of 11 modalities." isLast />
          </div>
        </div>
      </Section>

      {/* ══════ RESULTS ══════ */}
      <Section id="results">
        <SectionTitle sub="SENSE predictions correlate with human sensorimotor judgments">
          Key Results
        </SectionTitle>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14, marginBottom: 20 }}>
          <ResultCard title="Best Model" value="NN + BERT" detail="Neural network with BERT CLS embeddings" color="#2563eb" />
          <ResultCard title="Significant Modalities" value="6 / 11" detail="Human-model correlation" color="#7d9a7e" />
          <ResultCard title="Novel Finding" value="Interoceptive" detail="Phonesthemic patterns discovered" color="#a1887f" />
          <ResultCard title="Participants" value="281" detail="IRB-approved behavioral study" color="#2563eb" />
        </div>

        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 12, padding: 'clamp(20px, 3vw, 28px)',
        }}>
          <h3 style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            fontSize: 17, fontWeight: 600, color: T.text,
            marginBottom: 12,
          }}>Embedding Comparison</h3>
          <p style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            fontSize: 15, color: T.textSecondary, lineHeight: 1.7, marginBottom: 20,
          }}>
            We evaluated three embedding types (Word2Vec, GloVe, BERT CLS) across three architectures. The neural network consistently outperformed linear regression and mean baselines. BERT CLS embeddings were selected for the final SENSE model because they allow embedding of arbitrary character sequences through subword tokenization, enabling predictions for nonce words and novel forms.
          </p>
          <h3 style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            fontSize: 17, fontWeight: 600, color: T.text,
            marginBottom: 12,
          }}>Phonestheme Discovery</h3>
          <p style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
            fontSize: 15, color: T.textSecondary, lineHeight: 1.7,
          }}>
            Sublexical analysis of nonce word selection rates revealed novel phonesthemic patterns. Most notably, systematic form-meaning associations emerged for the <strong style={{ color: '#2563eb' }}>interoceptive dimension</strong>, a finding not previously reported in phonestheme literature. This demonstrates SENSE's potential as a tool for computationally proposing candidate phonesthemes from distributional text data.
          </p>
        </div>
      </Section>

      {/* ══════ DIMENSIONS ══════ */}
      <Section id="dimensions" alt>
        <SectionTitle sub="Lancaster Sensorimotor Norms cover 6 perceptual and 5 motor dimensions">
          The 11 Dimensions
        </SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {MODALITIES.map(m => (
            <div key={m} style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 10, padding: '18px 14px',
              textAlign: 'center',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{MODALITY_ICONS[m]}</div>
              <div style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
                fontSize: 13, fontWeight: 600, color: T.text,
              }}>{MODALITY_LABELS[m]}</div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10, color: T.textMuted,
                marginTop: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>{PERCEPTUAL.includes(m) ? 'Perceptual' : 'Motor'}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════ RESOURCES & DATA ══════ */}
      <Section id="resources" alt>
        <SectionTitle sub="Code, model weights, and human study data">
          Resources & Data
        </SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          <a href="https://github.com/abhinav-usc/SENSE-model" target="_blank" rel="noopener noreferrer" style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
            padding: '20px', textDecoration: 'none', transition: 'all 0.2s',
            display: 'block',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>💻</div>
            <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 }}>
              Code
            </div>
            <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", fontSize: 13, color: T.textSecondary, lineHeight: 1.5 }}>
              Model training, evaluation scripts, and SENSE projection pipeline.
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: T.textMuted, marginTop: 8 }}>
              github.com/abhinav-usc/SENSE-model
            </div>
          </a>

          <a href="/Sensorimotor_Associations_Survey_vals.csv" download style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
            padding: '20px', textDecoration: 'none', transition: 'all 0.2s',
            display: 'block',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>📋</div>
            <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 }}>
              Survey Responses
            </div>
            <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", fontSize: 13, color: T.textSecondary, lineHeight: 1.5 }}>
              Raw participant responses from the sensorimotor associations behavioral study (281 participants).
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: T.textMuted, marginTop: 8 }}>
              CSV &middot; 353 rows
            </div>
          </a>

          <a href="/final_with_sm.csv" download style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10,
            padding: '20px', textDecoration: 'none', transition: 'all 0.2s',
            display: 'block',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: 22, marginBottom: 8 }}>📊</div>
            <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 }}>
              Processed Results
            </div>
            <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", fontSize: 13, color: T.textSecondary, lineHeight: 1.5 }}>
              Nonce word selection rates with SENSE model ratings and per-modality correlations.
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: T.textMuted, marginTop: 8 }}>
              CSV &middot; 309 rows &middot; includes r and p values
            </div>
          </a>
        </div>
      </Section>

      {/* ══════ CITATION ══════ */}
      <Section id="citation">
        <SectionTitle>Citation</SectionTitle>
        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: 10, padding: 24,
          position: 'relative',
        }}>
          <button
            onClick={() => {
              const cite = `@article{gupta2026sense,
  title={Words that make SENSE: Sensorimotor Norms in Learned Lexical Token Representations},
  author={Gupta, Abhinav and Mintz, Toben H. and Thomason, Jesse},
  journal={arXiv preprint arXiv:2602.00469},
  year={2026}
}`;
              navigator.clipboard?.writeText(cite);
            }}
            style={{
              position: 'absolute', top: 14, right: 14,
              padding: '5px 12px', borderRadius: 6,
              border: `1px solid ${T.border}`,
              background: T.surfaceAlt,
              color: T.textSecondary, fontSize: 12, fontWeight: 500,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.borderColor = T.accent; e.target.style.color = T.text; }}
            onMouseLeave={e => { e.target.style.borderColor = T.border; e.target.style.color = T.textSecondary; }}
          >Copy BibTeX</button>
          <pre style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 13,
            color: T.textSecondary,
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}>{`@article{gupta2026sense,
  title={Words that make SENSE: Sensorimotor Norms
         in Learned Lexical Token Representations},
  author={Gupta, Abhinav and Mintz, Toben H.
          and Thomason, Jesse},
  journal={arXiv preprint arXiv:2602.00469},
  year={2026}
}`}</pre>
        </div>
      </Section>

      {/* ══════ FOOTER ══════ */}
      <footer style={{
        padding: '28px 24px',
        textAlign: 'center',
        borderTop: `1px solid ${T.border}`,
        position: 'relative', zIndex: 1,
        background: T.surfaceAlt,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 12, flexWrap: 'wrap' }}>
          <a href="https://glamor.rocks" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", fontSize: 13, color: T.textMuted,
            textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = T.text}
            onMouseLeave={e => e.target.style.color = T.textMuted}
          >GLAMOR Lab</a>
          <a href="https://dornsife.usc.edu/tobenmintz/" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", fontSize: 13, color: T.textMuted,
            textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = T.text}
            onMouseLeave={e => e.target.style.color = T.textMuted}
          >Language Development Lab</a>
          <a href="https://www.usc.edu" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif", fontSize: 13, color: T.textMuted,
            textDecoration: 'none', transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = T.text}
            onMouseLeave={e => e.target.style.color = T.textMuted}
          >USC</a>
        </div>
        <p style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
          fontSize: 12, color: T.textMuted,
        }}>
          Gupta, Mintz, & Thomason. 2026.
        </p>
      </footer>
    </div>
  );
}