import { useState, useEffect, useCallback } from "react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from "recharts";
import {
  Ear, Utensils, Hand, HeartPulse, Flower2, Eye, Footprints, Dumbbell,
  Brain, Speech, Shirt, BookOpen, BarChart3, Type, Calculator, Target,
  Sparkles, Dices, ClipboardList, TrendingUp, Users, Github, FileSpreadsheet,
  ArrowLeft, ArrowUpRight, FileText, FlaskConical, Quote, Check, Sun, Moon,
  Compass, ListOrdered, FolderOpen
} from "lucide-react";
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
  Auditory: Ear, Gustatory: Utensils, Haptic: Hand, Interoceptive: HeartPulse,
  Olfactory: Flower2, Visual: Eye, Foot_leg: Footprints, Hand_arm: Dumbbell,
  Head: Brain, Mouth: Speech, Torso: Shirt
};
// Muted mid-tones that read in both light and dark themes
const MODALITY_COLORS = {
  Auditory: '#64748b', Gustatory: '#a1887f', Haptic: '#b0906f',
  Interoceptive: '#c47a7a', Olfactory: '#7d9a7e', Visual: '#7b8fa8',
  Foot_leg: '#8b7fa8', Hand_arm: '#b08f6f', Head: '#6a9aa0',
  Mouth: '#a87b8f', Torso: '#8a9a6a'
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

const ACL_URL = 'https://aclanthology.org/2026.findings-acl.2038/';

// Chart colors can't use CSS vars (SVG presentation attributes), so pick per theme.
const CHART_COLORS = {
  light: { accent: '#34558b', tick: '#6b7280', tickFaint: '#9ca3af', grid: 'rgba(107, 114, 128, 0.25)' },
  dark: { accent: '#94b8e0', tick: '#a3a3a3', tickFaint: '#8a8a8a', grid: 'rgba(163, 163, 163, 0.25)' },
};

// Mirrors the main site's theme handling (index.html sets data-theme pre-paint).
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

// ─── SCORE BAR ───────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars -- Icon is used as a JSX element
function ScoreBar({ label, icon: Icon, score, color, delay = 0 }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  const pct = Math.max(0, Math.min(100, (score / 5) * 100));
  return (
    <div className="s-bar-row">
      <span className="s-bar-icon"><Icon size={14} strokeWidth={1.8} /></span>
      <span className="s-bar-label">{label}</span>
      <div className="s-bar-track">
        <div className="s-bar-fill" style={{ width: animated ? `${pct}%` : '0%', background: color }} />
        <span className={`s-bar-value ${pct > 75 ? 'on-fill' : ''}`}>{score.toFixed(1)}</span>
      </div>
    </div>
  );
}

// ─── INTERACTIVE DEMO ────────────────────────────────────────
function SenseDemo({ handlePredict, modelReady, modelLoading, chart }) {
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
        score: Math.max(0, Math.min(5, scores[m] * 5 || 0)),
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
      {modelLoading && (
        <p className="s-status"><span className="s-spinner" /> Loading BERT model (~60 MB, cached after first load)…</p>
      )}
      {modelReady && (
        <p className="s-status"><Check size={13} /> Model loaded — SENSE inference runs entirely in your browser</p>
      )}

      <div className="s-input-row">
        <input
          className="s-word-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter any word, phrase, or nonce word…"
        />
        <button className="s-run" onClick={handleSubmit} disabled={loading || !input.trim()}>
          {loading ? <><span className="s-spinner light" /> Running…</> : 'Run SENSE'}
        </button>
      </div>

      <div className="s-chips">
        <span className="s-chips-label">Try:</span>
        {EXAMPLE_WORDS.map(e => (
          <button
            key={e.word}
            className={`paper-badge s-chip ${activeWord === e.word ? 'active' : ''}`}
            onClick={() => { setInput(e.word); runSENSE(e.word); }}
          >
            {e.word}
          </button>
        ))}
      </div>

      {error && <p className="s-error">{error}</p>}

      {results && (
        <div className="s-results-panel">
          <div className="s-word-header">
            <span className="s-word">“{activeWord}”</span>
            <span className="s-word-sub">Sensorimotor profile</span>
          </div>

          <div className="s-viz-toggle">
            {[{ key: 'bars', label: 'Bars' }, { key: 'radar', label: 'Radar' }].map(v => (
              <button
                key={v.key}
                className={`s-viz-btn ${vizMode === v.key ? 'active' : ''}`}
                onClick={() => setVizMode(v.key)}
              >{v.label}</button>
            ))}
          </div>

          {vizMode === 'bars' && (
            <div className="s-bars-grid">
              <div>
                <h4 className="subsection-title">Perceptual</h4>
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
                <h4 className="subsection-title">Motor</h4>
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
            <div className="s-radar">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke={chart.grid} />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fill: chart.tick, fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    angle={90} domain={[0, 5]}
                    tick={{ fill: chart.tickFaint, fontSize: 10 }}
                    axisLine={false}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke={chart.accent}
                    fill={chart.accent}
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)',
                    }}
                    labelStyle={{ color: 'var(--dark)' }}
                    itemStyle={{ color: 'var(--text)' }}
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

// ─── WORKFLOW STEP ───────────────────────────────────────────
// eslint-disable-next-line no-unused-vars -- Icon is used as a JSX element
function WorkflowStep({ number, title, desc, icon: Icon, isLast = false }) {
  return (
    <div className={`s-step ${isLast ? 'last' : ''}`}>
      <span className="s-step-icon"><Icon size={16} strokeWidth={1.8} /></span>
      <div className="s-step-body">
        <span className="s-step-num">{String(number).padStart(2, '0')}</span>
        <h4 className="s-step-title">{title}</h4>
        <p className="s-step-desc">{desc}</p>
      </div>
    </div>
  );
}

// ─── CITATION ────────────────────────────────────────────────
function CitationBlock({ citation }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="s-bibtex-wrap">
      <button className="paper-badge s-copy" onClick={copy}>
        {copied ? <><Check size={12} /> copied</> : <><Quote size={12} /> copy BibTeX</>}
      </button>
      <pre className="s-bibtex">{citation}</pre>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────
export default function Sense() {
  const [model, setModel] = useState(null);
  const [modelReady, setModelReady] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [theme, toggleTheme] = useTheme();
  const chart = CHART_COLORS[theme] || CHART_COLORS.light;

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        setModelLoading(true);
        const m = new SenseModel();
        await m.load('/sense_weights.json', '/bert-base-encoder/model_quantized.onnx');
        if (!cancelled) {
          setModel(m);
          setModelReady(true);
          setModelLoading(false);
        }
      } catch (err) {
        console.error('[SENSE] Model load failed:', err);
        if (!cancelled) {
          setModelLoading(false);
        }
      }
    };
    init();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    document.title = 'SENSE';
    return () => { document.title = 'Abhinav Gupta'; };
  }, []);

  const handlePredict = useCallback(async (word) => {
    if (!model?.ready) return null;
    const scores = await model.predict(word);
    return scores;
  }, [model]);

  const citation = `@inproceedings{gupta-etal-2026-words,
    title = "Words that make {SENSE}: Sensorimotor Norms in Learned Lexical Token Representations",
    author = "Gupta, Abhinav  and
      Mintz, Toben  and
      Thomason, Jesse",
    editor = "Liakata, Maria  and
      Moreira, Viviane P.  and
      Zhang, Jiajun  and
      Jurgens, David",
    booktitle = "Findings of the {A}ssociation for {C}omputational {L}inguistics: {ACL} 2026",
    month = jul,
    year = "2026",
    address = "San Diego, California, United States",
    publisher = "Association for Computational Linguistics",
    url = "https://aclanthology.org/2026.findings-acl.2038/",
    pages = "41021--41029",
    ISBN = "979-8-89176-395-1",
}`;

  return (
    <div className="sense">
      <style>{SENSE_CSS}</style>

      <nav className="s-nav">
        <div className="s-nav-inner">
          <a href="/" className="s-nav-back"><ArrowLeft size={13} /> Abhinav Gupta</a>
          <span className="s-nav-brand">SENSE</span>
          <div className="s-nav-links">
            <a href="#about">About</a>
            <a href="#demo">Demo</a>
            <a href="#method">Method</a>
            <a href="#results">Results</a>
            <a href="#resources">Resources</a>
            <a href="#citation">Citation</a>
          </div>
          <a href={ACL_URL} target="_blank" rel="noreferrer" className="paper-badge s-nav-paper">
            <FileText size={12} /> published paper
          </a>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </nav>

      <header className="s-hero">
        <h1 className="s-title">Words that make <em>SENSE</em></h1>
        <p className="s-subtitle">Sensorimotor Norms in Learned Lexical Token Representations</p>
        <p className="s-authors">
          <a href="https://abhinavgupta.dev">Abhinav Gupta</a> · <a href="https://dornsife.usc.edu/tobenmintz/" target="_blank" rel="noreferrer">Toben H. Mintz</a> · <a href="https://jessethomason.com/" target="_blank" rel="noreferrer">Jesse Thomason</a>
        </p>
        <p className="s-affiliation">University of Southern California</p>
        <p className="s-venue">Findings of ACL 2026 · San Diego</p>
        <div className="s-hero-links">
          <a href={ACL_URL} target="_blank" rel="noreferrer" className="paper-badge"><FileText size={12} /> published paper</a>
          <a href="https://github.com/abhinav-usc/SENSE-model" target="_blank" rel="noreferrer" className="paper-badge"><Github size={12} /> code</a>
          <a href="#demo" className="paper-badge"><FlaskConical size={12} /> live demo</a>
          <a href="#citation" className="paper-badge"><Quote size={12} /> cite</a>
        </div>
      </header>

      <section id="about">
        <div className="container">
          <h2 className="section-title"><BookOpen size={17} className="title-icon" aria-hidden="true" /> What is SENSE?</h2>
          <div className="s-prose">
            <p>
              While word embeddings derive meaning from co-occurrence patterns, human language understanding is grounded in sensory and motor experience. <strong className="s-accent">SENSE</strong> (Sensorimotor Embedding Norm Scoring Engine) is a learned projection model that predicts Lancaster sensorimotor norms from word lexical embeddings.
            </p>
            <p>
              We conducted a behavioral study where <strong>281 participants</strong> selected which candidate nonce words evoked specific sensorimotor associations, finding statistically significant correlations between human selection rates and SENSE ratings across <strong>6 of the 11 modalities</strong>.
            </p>
            <p>
              Sublexical analysis of nonce word selection rates revealed systematic <strong className="s-accent">phonesthemic patterns</strong> for the interoceptive norm, suggesting a path towards computationally proposing candidate phonesthemes from text data.
            </p>
          </div>

          <div className="s-stats">
            <div className="s-stat"><span className="s-stat-value">34,110</span><span className="s-stat-label">Words aligned</span></div>
            <div className="s-stat"><span className="s-stat-value">281</span><span className="s-stat-label">Participants</span></div>
            <div className="s-stat"><span className="s-stat-value">11</span><span className="s-stat-label">Sensorimotor dimensions</span></div>
            <div className="s-stat"><span className="s-stat-value">6/11</span><span className="s-stat-label">Significant correlations</span></div>
          </div>

          <p className="currently-exploring s-insight">
            <em>“gl-” in glitter, gleam, glow all evoke vision. “sn-” in sniff, sneeze, snore all evoke the nose. These are <strong>phonesthemes</strong> — sublexical units carrying consistent sensorimotor associations across words. SENSE captures these patterns computationally and extends them to novel character sequences.</em>
          </p>
        </div>
      </section>

      <section id="demo">
        <div className="container">
          <h2 className="section-title"><FlaskConical size={17} className="title-icon" aria-hidden="true" /> Interactive Demo</h2>
          <p className="s-section-sub">Enter any word, phrase, or made-up character sequence to see its predicted sensorimotor profile across 11 dimensions.</p>
          <SenseDemo
            handlePredict={handlePredict}
            modelReady={modelReady}
            modelLoading={modelLoading}
            chart={chart}
          />
        </div>
      </section>

      <section id="method">
        <div className="container">
          <h2 className="section-title"><ListOrdered size={17} className="title-icon" aria-hidden="true" /> Methodology</h2>
          <p className="s-section-sub">How we built SENSE and validated it with human judgments.</p>
          <div className="s-method-grid">
            <div>
              <h3 className="subsection-title">SENSE Model Pipeline</h3>
              <WorkflowStep number={1} icon={Type} title="Lexical Embedding Extraction"
                desc="Extract CLS token embeddings from BERT for all 34,110 words aligned across Word2Vec, GloVe, and Lancaster Norms vocabularies." />
              <WorkflowStep number={2} icon={Calculator} title="Architecture Comparison"
                desc="Compare baseline (mean prediction), linear regression, and feed-forward neural network (64/128 neurons, ReLU, Adam optimizer) architectures." />
              <WorkflowStep number={3} icon={Target} title="SENSE Projection"
                desc="The neural network with BERT CLS embeddings achieves lowest MSE, becoming the SENSE model that projects embeddings onto 11 sensorimotor dimensions." />
              <WorkflowStep number={4} icon={Sparkles} title="Generalization to Nonce Words"
                desc="SENSE extends predictions to any character sequence, including pseudowords and nonce forms, via BERT's subword tokenization." isLast />
            </div>
            <div>
              <h3 className="subsection-title">Behavioral Validation Study</h3>
              <WorkflowStep number={1} icon={Dices} title="Nonce Word Generation"
                desc="Generate pronounceable pseudowords using Wuggy, preserving sub-syllabic structure and transition frequencies of real English words." />
              <WorkflowStep number={2} icon={ClipboardList} title="Survey Design"
                desc="For each sensorimotor dimension, present participants with 20 nonce word pairs and ask which word more strongly evokes the given sensory or motor experience." />
              <WorkflowStep number={3} icon={Users} title="Data Collection"
                desc="281 undergraduate participants completed the IRB-approved survey, providing forced-choice judgments on phonesthemic associations." />
              <WorkflowStep number={4} icon={TrendingUp} title="Correlation Analysis"
                desc="Correlate human selection rates with SENSE predicted scores, finding statistically significant agreement in 6 of 11 modalities." isLast />
            </div>
          </div>
        </div>
      </section>

      <section id="results">
        <div className="container">
          <h2 className="section-title"><BarChart3 size={17} className="title-icon" aria-hidden="true" /> Key Results</h2>
          <div className="s-findings">
            <div className="s-finding"><span className="s-finding-label">Best model</span><span className="s-finding-value">NN + BERT</span><span className="s-finding-detail">Neural network with BERT CLS embeddings</span></div>
            <div className="s-finding"><span className="s-finding-label">Significant modalities</span><span className="s-finding-value">6 / 11</span><span className="s-finding-detail">Human–model correlation</span></div>
            <div className="s-finding"><span className="s-finding-label">Novel finding</span><span className="s-finding-value">Interoceptive</span><span className="s-finding-detail">Phonesthemic patterns discovered</span></div>
            <div className="s-finding"><span className="s-finding-label">Participants</span><span className="s-finding-value">281</span><span className="s-finding-detail">IRB-approved behavioral study</span></div>
          </div>
          <div className="s-prose">
            <h3 className="s-prose-heading">Embedding Comparison</h3>
            <p>
              We evaluated three embedding types (Word2Vec, GloVe, BERT CLS) across three architectures. The neural network consistently outperformed linear regression and mean baselines. BERT CLS embeddings were selected for the final SENSE model because they allow embedding of arbitrary character sequences through subword tokenization, enabling predictions for nonce words and novel forms.
            </p>
            <h3 className="s-prose-heading">Phonestheme Discovery</h3>
            <p>
              Sublexical analysis of nonce word selection rates revealed novel phonesthemic patterns. Most notably, systematic form-meaning associations emerged for the <strong className="s-accent">interoceptive dimension</strong>, a finding not previously reported in phonestheme literature. This demonstrates SENSE's potential as a tool for computationally proposing candidate phonesthemes from distributional text data.
            </p>
          </div>
        </div>
      </section>

      <section id="dimensions">
        <div className="container">
          <h2 className="section-title"><Compass size={17} className="title-icon" aria-hidden="true" /> The 11 Dimensions</h2>
          <p className="s-section-sub">Lancaster Sensorimotor Norms cover 6 perceptual and 5 motor dimensions.</p>
          <div className="s-dims">
            {MODALITIES.map(m => {
              const ModalityIcon = MODALITY_ICONS[m];
              return (
                <div key={m} className="s-dim">
                  <span className="s-dim-icon" style={{ color: MODALITY_COLORS[m] }}>
                    <ModalityIcon size={20} strokeWidth={1.7} />
                  </span>
                  <span className="s-dim-label">{MODALITY_LABELS[m]}</span>
                  <span className="s-dim-tag">{PERCEPTUAL.includes(m) ? 'Perceptual' : 'Motor'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="resources">
        <div className="container">
          <h2 className="section-title"><FolderOpen size={17} className="title-icon" aria-hidden="true" /> Resources & Data</h2>
          <div className="s-res-list">
            <a href="https://github.com/abhinav-usc/SENSE-model" target="_blank" rel="noreferrer" className="s-res">
              <span className="s-res-icon"><Github size={16} strokeWidth={1.8} /></span>
              <span className="s-res-body">
                <span className="s-res-title">Code</span>
                <span className="s-res-desc">Model training, evaluation scripts, and SENSE projection pipeline.</span>
                <span className="s-res-meta">github.com/abhinav-usc/SENSE-model</span>
              </span>
              <ArrowUpRight size={14} className="s-res-arrow" aria-hidden="true" />
            </a>
            <a href="/Sensorimotor_Associations_Survey_vals.csv" download className="s-res">
              <span className="s-res-icon"><ClipboardList size={16} strokeWidth={1.8} /></span>
              <span className="s-res-body">
                <span className="s-res-title">Survey Responses</span>
                <span className="s-res-desc">Raw participant responses from the sensorimotor associations behavioral study (281 participants).</span>
                <span className="s-res-meta">CSV · 353 rows</span>
              </span>
              <ArrowUpRight size={14} className="s-res-arrow" aria-hidden="true" />
            </a>
            <a href="/final_with_sm.csv" download className="s-res">
              <span className="s-res-icon"><FileSpreadsheet size={16} strokeWidth={1.8} /></span>
              <span className="s-res-body">
                <span className="s-res-title">Processed Results</span>
                <span className="s-res-desc">Nonce word selection rates with SENSE model ratings and per-modality correlations.</span>
                <span className="s-res-meta">CSV · 309 rows · includes r and p values</span>
              </span>
              <ArrowUpRight size={14} className="s-res-arrow" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section id="citation">
        <div className="container">
          <h2 className="section-title"><Quote size={17} className="title-icon" aria-hidden="true" /> Citation</h2>
          <CitationBlock citation={citation} />
        </div>
      </section>

      <footer className="footer">
        <div className="s-footer-links">
          <a href="https://glamor.rocks" target="_blank" rel="noreferrer">GLAMOR Lab</a>
          <a href="https://dornsife.usc.edu/tobenmintz/" target="_blank" rel="noreferrer">Language Development Lab</a>
          <a href="https://www.usc.edu" target="_blank" rel="noreferrer">USC</a>
        </div>
        <p>Gupta, Mintz & Thomason · Findings of ACL 2026</p>
      </footer>
    </div>
  );
}

// Scoped styles; reuses the main site's CSS variables and utility classes
// (.container, .section-title, .subsection-title, .paper-badge, .theme-toggle,
// .currently-exploring, .footer), so light/dark theming comes along for free.
const SENSE_CSS = `
  .sense { min-height: 100vh; background: var(--bg); color: var(--text); }
  .sense .container { max-width: 940px; }
  html { scroll-behavior: smooth; }
  @keyframes s-spin { to { transform: rotate(360deg); } }
  @keyframes s-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  /* Nav */
  .s-nav {
    position: sticky; top: 0; z-index: 100;
    background: var(--nav-bg);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }
  .s-nav-inner {
    max-width: 940px; margin: 0 auto; padding: 0.7rem 1.2rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .s-nav-back {
    display: inline-flex; align-items: center; gap: 0.3rem;
    font-size: 0.82rem; color: var(--light-gray); text-decoration: none;
    transition: color 0.2s; white-space: nowrap;
  }
  .s-nav-back:hover { color: var(--primary); }
  .s-nav-brand {
    font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700;
    color: var(--primary); letter-spacing: 0.05em;
  }
  .s-nav-links { display: flex; gap: 0.9rem; margin-left: auto; }
  .s-nav-links a {
    font-size: 0.82rem; font-weight: 500; color: var(--text);
    text-decoration: none; transition: color 0.2s;
  }
  .s-nav-links a:hover { color: var(--primary); }
  .s-nav-paper { white-space: nowrap; }

  /* Hero */
  .s-hero {
    max-width: 780px; margin: 0 auto; padding: 3.5rem 1.2rem 2.5rem;
    text-align: center; animation: s-fade 0.6s ease-out;
  }
  .s-title {
    font-family: var(--font-serif); font-size: clamp(1.9rem, 5vw, 3rem);
    font-weight: 700; letter-spacing: -0.02em; line-height: 1.15;
    color: var(--dark); margin-bottom: 0.6rem;
  }
  .s-title em { font-style: italic; color: var(--primary); }
  .s-subtitle {
    font-family: var(--font-serif); font-style: italic;
    font-size: clamp(0.95rem, 2.2vw, 1.15rem); color: var(--light-gray);
    margin-bottom: 1.1rem;
  }
  .s-authors { font-size: 0.9rem; margin-bottom: 0.25rem; }
  .s-authors a { color: var(--primary); font-weight: 500; text-decoration: none; }
  .s-authors a:hover { color: var(--primary-dark); }
  .s-affiliation { font-size: 0.85rem; color: var(--text); margin-bottom: 0.15rem; }
  .s-venue { font-family: var(--font-serif); font-style: italic; font-size: 0.85rem; color: var(--light-gray); margin-bottom: 1.25rem; }
  .s-hero-links { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }

  /* Sections */
  .s-section-sub { font-size: 0.9rem; color: var(--light-gray); margin: -0.75rem 0 1.4rem; }
  .s-prose p { font-size: 0.925rem; line-height: 1.75; margin-bottom: 0.9rem; }
  .s-prose p:last-child { margin-bottom: 0; }
  .s-prose strong { color: var(--dark); }
  .s-prose strong.s-accent, .s-accent { color: var(--primary); }
  .s-prose-heading { font-size: 0.95rem; font-weight: 600; color: var(--dark); margin: 1.4rem 0 0.5rem; }
  .s-prose-heading:first-child { margin-top: 0; }

  /* Stats */
  .s-stats { display: flex; flex-wrap: wrap; gap: 2.75rem; margin: 1.75rem 0; }
  .s-stat { display: flex; flex-direction: column; gap: 0.15rem; }
  .s-stat-value { font-family: var(--font-serif); font-size: 1.65rem; font-weight: 700; color: var(--dark); line-height: 1.1; }
  .s-stat-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--light-gray); }
  .s-insight { font-family: var(--font-serif); font-size: 0.95rem; line-height: 1.7; }
  .s-insight strong { color: var(--primary); }

  /* Demo */
  .s-status {
    display: flex; align-items: center; justify-content: center; gap: 0.45rem;
    font-size: 0.8rem; color: var(--light-gray); margin-bottom: 1.1rem;
  }
  .s-spinner {
    display: inline-block; width: 12px; height: 12px; flex-shrink: 0;
    border: 2px solid var(--border); border-top-color: var(--primary);
    border-radius: 50%; animation: s-spin 0.8s linear infinite;
  }
  .s-spinner.light { border-color: rgba(255,255,255,0.35); border-top-color: #fff; }
  .s-input-row { display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; margin-bottom: 0.9rem; }
  .s-word-input {
    flex: 1 1 240px; max-width: 420px; padding: 0.6rem 0.9rem;
    border: 1px solid var(--border); border-radius: 6px;
    background: var(--bg); color: var(--dark);
    font-size: 0.9rem; font-family: inherit; outline: none;
    transition: border-color 0.2s;
  }
  .s-word-input:focus { border-color: var(--primary); }
  .s-word-input::placeholder { color: var(--light-gray); }
  .s-run {
    display: inline-flex; align-items: center; gap: 0.45rem;
    padding: 0.6rem 1.3rem; border: none; border-radius: 6px;
    background: var(--primary); color: var(--bg);
    font-size: 0.85rem; font-weight: 600; font-family: inherit;
    cursor: pointer; transition: opacity 0.2s;
  }
  .s-run:hover { opacity: 0.9; }
  .s-run:disabled { opacity: 0.5; cursor: default; }
  .s-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; align-items: center; margin-bottom: 1.4rem; }
  .s-chips-label { font-size: 0.8rem; color: var(--light-gray); margin-right: 0.2rem; }
  .s-chip { font-family: var(--font-mono); font-size: 0.72rem; }
  .s-chip.active { color: var(--primary); border-color: var(--primary); background: var(--bg-subtle); }
  .s-error { text-align: center; font-size: 0.85rem; color: #b3564f; margin-bottom: 1.25rem; }

  .s-results-panel { animation: s-fade 0.4s ease-out; }
  .s-word-header { text-align: center; margin-bottom: 0.9rem; }
  .s-word { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 600; color: var(--dark); display: block; }
  .s-word-sub { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--light-gray); }
  .s-viz-toggle { display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 1.4rem; }
  .s-viz-btn {
    background: none; border: none; padding: 0.25rem 0.2rem;
    font-size: 0.82rem; font-weight: 500; font-family: inherit;
    color: var(--light-gray); cursor: pointer;
    border-bottom: 1px solid transparent; transition: color 0.2s, border-color 0.2s;
  }
  .s-viz-btn:hover { color: var(--primary); }
  .s-viz-btn.active { color: var(--primary); border-bottom-color: var(--primary); }
  .s-bars-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr)); gap: 1rem 2.5rem; }
  .s-bar-row { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }
  .s-bar-icon { width: 22px; display: flex; justify-content: center; color: var(--light-gray); flex-shrink: 0; }
  .s-bar-label { font-size: 0.8rem; color: var(--text); width: 88px; flex-shrink: 0; }
  .s-bar-track {
    flex: 1; height: 20px; position: relative; overflow: hidden;
    background: var(--bg-subtle); border: 1px solid var(--border); border-radius: 4px;
  }
  .s-bar-fill { height: 100%; border-radius: 3px; opacity: 0.7; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
  .s-bar-value {
    position: absolute; right: 7px; top: 50%; transform: translateY(-50%);
    font-family: var(--font-mono); font-size: 0.68rem; font-weight: 600; color: var(--text);
  }
  .s-bar-value.on-fill { color: var(--bg); }
  .s-radar { display: flex; justify-content: center; }

  /* Method */
  .s-method-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 1fr)); gap: 1.5rem 3rem; }
  .s-step { display: flex; gap: 0.85rem; position: relative; padding-bottom: 1.35rem; }
  .s-step.last { padding-bottom: 0; }
  .s-step-icon { width: 28px; display: flex; justify-content: center; color: var(--light-gray); flex-shrink: 0; padding-top: 0.1rem; }
  .s-step:not(.last)::before {
    content: ''; position: absolute; left: 14px; top: 26px; bottom: 4px;
    width: 1px; background: var(--border);
  }
  .s-step-num { font-family: var(--font-mono); font-size: 0.68rem; color: var(--light-gray); letter-spacing: 0.08em; display: block; margin-bottom: 0.1rem; }
  .s-step-title { font-size: 0.9rem; font-weight: 600; color: var(--dark); margin-bottom: 0.2rem; }
  .s-step-desc { font-size: 0.85rem; line-height: 1.6; color: var(--text); }

  /* Results */
  .s-findings {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
    gap: 1.4rem 2rem; margin-bottom: 1.9rem;
  }
  .s-finding { display: flex; flex-direction: column; gap: 0.15rem; }
  .s-finding-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--light-gray); }
  .s-finding-value { font-family: var(--font-serif); font-size: 1.3rem; font-weight: 700; color: var(--dark); }
  .s-finding-detail { font-size: 0.8rem; color: var(--light-gray); }

  /* Dimensions */
  .s-dims { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(118px, 100%), 1fr)); gap: 1.25rem 1rem; }
  .s-dim { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; text-align: center; }
  .s-dim-label { font-size: 0.82rem; font-weight: 600; color: var(--dark); }
  .s-dim-tag { font-family: var(--font-mono); font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--light-gray); }

  /* Resources */
  .s-res-list { display: flex; flex-direction: column; }
  .s-res {
    display: flex; align-items: flex-start; gap: 0.9rem;
    padding: 1rem 0; text-decoration: none;
    border-bottom: 1px solid var(--border);
  }
  .s-res:last-child { border-bottom: none; }
  .s-res-icon { color: var(--light-gray); padding-top: 0.15rem; flex-shrink: 0; }
  .s-res-body { display: flex; flex-direction: column; gap: 0.15rem; flex: 1; }
  .s-res-title { font-size: 0.9rem; font-weight: 600; color: var(--dark); }
  .s-res-desc { font-size: 0.85rem; color: var(--text); line-height: 1.55; }
  .s-res-meta { font-family: var(--font-mono); font-size: 0.7rem; color: var(--light-gray); margin-top: 0.15rem; }
  .s-res-arrow { color: var(--primary); opacity: 0; transform: translate(-3px, 3px); transition: opacity 0.2s, transform 0.2s; align-self: center; flex-shrink: 0; }
  .s-res:hover .s-res-arrow { opacity: 1; transform: translate(0, 0); }

  /* Citation */
  .s-bibtex-wrap { position: relative; }
  .s-copy { position: absolute; top: 0.8rem; right: 0.8rem; }
  .s-bibtex {
    background: var(--bg-subtle); border-radius: 6px;
    padding: 1.25rem; padding-right: 7.5rem;
    font-family: var(--font-mono); font-size: 0.78rem; line-height: 1.6;
    color: var(--text); white-space: pre-wrap; word-break: break-word;
  }
  .s-footer-links { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 0.6rem; }
  .s-footer-links a { font-size: 0.8rem; color: var(--light-gray); text-decoration: none; transition: color 0.2s; }
  .s-footer-links a:hover { color: var(--primary); }

  /* Phone */
  @media (max-width: 820px) {
    .s-nav-links { display: none; }
  }
  @media (max-width: 560px) {
    .s-nav-inner { padding: 0.6rem 1rem; gap: 0.7rem; }
    .s-nav-paper { margin-left: auto; }
    .s-hero { padding: 2.25rem 1rem 1.75rem; }
    .sense .container { padding: 1.5rem 1rem; }
    .s-stats { gap: 1.5rem 2rem; margin: 1.4rem 0; }
    .s-stat-value { font-size: 1.35rem; }
    .s-prose p, .s-step-desc, .s-res-desc { font-size: 0.85rem; }
    .s-dims { grid-template-columns: repeat(3, 1fr); }
    .s-bibtex { padding: 1rem; padding-top: 3rem; font-size: 0.7rem; }
    .s-copy { top: 0.7rem; right: 0.7rem; }
    .s-bar-label { width: 76px; font-size: 0.75rem; }
  }
`;
