import { useState, useEffect } from 'react'
import {
  Mail, Github, Linkedin, FileText, GraduationCap, Sun, Moon,
  Newspaper, FlaskConical, BookOpen, Code, Sparkles, ExternalLink,
  Mic, Award, School, Phone, Quote, Check, ChevronDown, ChevronUp,
  ArrowUpRight, Wrench, Presentation
} from 'lucide-react'
import './App.css'

function usePageLoadAnimation() {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => { setIsLoaded(true) }, [])
  return isLoaded
}

// Theme is initialized before paint by an inline script in index.html (defaults
// to light; dark only when the user has explicitly toggled it before). This hook
// just mirrors that attribute into React state and persists the user's toggle.
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

function ProjectImages({ images }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="project-images">
      {images.map((img, idx) => (
        <div key={idx} className="project-image-container">
          <img src={img.src} alt={img.alt} />
          {img.caption && <div className="image-caption">{img.caption}</div>}
        </div>
      ))}
    </div>
  );
}

function CiteButton({ bibtex }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = (e) => {
    e.preventDefault()
    navigator.clipboard?.writeText(bibtex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button className="paper-badge cite-badge" onClick={handleCopy}>
      {copied ? <><Check size={12} /> copied</> : <><Quote size={12} /> cite</>}
    </button>
  )
}

function App() {
  const cvLink = '/Abhinav_Gupta_CV.pdf'
  const [expandedPapers, setExpandedPapers] = useState({})
  const [showAllNews, setShowAllNews] = useState(false)
  const isPageLoaded = usePageLoadAnimation()
  const [theme, toggleTheme] = useTheme()

  const togglePaper = (key) => {
    setExpandedPapers(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const news = [
    {
      year: "2026",
      items: [
        { date: "JUL 2", icon: Mic, text: <>At <strong>ACL 2026</strong> in San Diego — presenting the <a className="news-link" href="https://aclanthology.org/2026.findings-acl.2038/" target="_blank" rel="noreferrer">SENSE</a> paper on July 5. Read my <a className="news-link" href="https://amazon-podcasts.notion.site/ACL-2026-39109b5e127b80d88cc0f5124026e63d" target="_blank" rel="noreferrer">conference notes</a>.</> },
        { date: "MAY", icon: GraduationCap, text: <>Graduating from USC with dual degrees in Computer Science and Cognitive Science, along with a specialization in AI Applications.</> },
        { date: "APR", icon: FileText, text: <>Two papers accepted at <strong>ACL 2026 Findings</strong>: <a className="news-link" href="https://aclanthology.org/2026.findings-acl.2038/" target="_blank" rel="noreferrer">Words that make SENSE</a> and <a className="news-link" href="https://aclanthology.org/2026.findings-acl.1641/" target="_blank" rel="noreferrer">Can LLMs Infer Human Actions and Motives?</a></> },
        { date: "MAR", icon: Award, text: <>Awarded the <a className="news-link" href="https://libraries.usc.edu/wallofscholars?award=1551" target="_blank" rel="noreferrer">USC Renaissance Scholar Prize</a>, given to 10 undergraduates for academic excellence and multidisciplinary research in distinct fields.</> },
        { date: "FEB", icon: Award, text: <>Received the <a className="news-link" href="https://ahf.usc.edu/commencement-honors/scholar-distinctions/discovery-2/" target="_blank" rel="noreferrer">USC Discovery Scholar Distinction</a>.</> },
      ]
    },
    {
      year: "2025",
      items: [
        { date: "AUG", icon: BookOpen, text: <>Started as Math Peer Mentor at <a className="news-link" href="https://sites.usc.edu/mesa-u/math-support/" target="_blank" rel="noreferrer">USC Viterbi MESA</a>.</> },
        { date: "MAY", icon: Award, text: <>Awarded the <a className="news-link" href="https://undergrad.usc.edu/experience/research/" target="_blank" rel="noreferrer">Center for Undergraduate Research in Viterbi Engineering Fellowship</a>.</> },
      ]
    },
    {
      year: "2024",
      items: [
        { date: "DEC", icon: FlaskConical, text: <>Joined the <a className="news-link" href="https://uscinteractionlab.web.app/" target="_blank" rel="noreferrer">Interaction Lab</a>, working with Maja Matarić on LLM theory of mind.</> },
        { date: "NOV", icon: Mic, text: <>Presented <a className="news-link" href="/Extracting_Sensorimotor_Information_from_Words_and_Emojis.pdf" target="_blank" rel="noreferrer">Extracting Sensorimotor Associations</a> at <a className="news-link" href="https://socalnlp.github.io/symp24/index.html" target="_blank" rel="noreferrer">SoCal NLP 2024</a>.</> },
        { date: "MAY", icon: Award, text: <>Awarded the <a className="news-link" href="https://undergrad.usc.edu/experience/research/" target="_blank" rel="noreferrer">USC Provost Fellowship</a> for summer research.</> },
      ]
    },
    {
      year: "2023",
      items: [
        { date: "OCT", icon: Mic, text: <>Presented <a className="news-link" href="/156_Creating_a_Parallel_Corpus.pdf" target="_blank" rel="noreferrer">Creating a Parallel Corpus for Muisca</a> at <a className="news-link" href="https://socalnlp.github.io/symp23/index.html" target="_blank" rel="noreferrer">SoCal NLP 2023</a>.</> },
        { date: "AUG", icon: Award, text: <>Selected as an <a className="news-link" href="https://academicprograms.usc.edu/services/undergraduate-research-and-experiential-learning/usc-undergraduate-research-associates-program/" target="_blank" rel="noreferrer">Undergraduate Research Associates Program</a> Scholar.</> },
        { date: "AUG", icon: FlaskConical, text: <>Joined the <a className="news-link" href="https://glamor.rocks/" target="_blank" rel="noreferrer">GLAMOR Lab</a>, working with Jesse Thomason on grounded language.</> },
      ]
    },
    {
      year: "2021",
      items: [
        { date: "AUG", icon: School, text: <>Started at the <a className="news-link" href="https://www.usc.edu/" target="_blank" rel="noreferrer">University of Southern California</a> to pursue a B.S. in Computer Science and B.A. in Cognitive Science.</> },
      ]
    },
  ]

  const allNewsFlat = news.flatMap(group => group.items.map(item => ({ ...item, year: group.year })))
  const recentNews = allNewsFlat.slice(0, 3)

  const researchProjects = [
    {
      type: "publication",
      title: "Words that make SENSE: Sensorimotor Norms in Learned Lexical Token Representations",
      authors: ["Abhinav Gupta", "Toben H. Mintz", "Jesse Thomason"],
      venue: "Findings of Association for Computational Linguistics (ACL Findings), 2026",
      year: "2026",
      status: "accepted",
      description: "Investigating whether computational word embeddings capture human-like sensorimotor associations and developing models to project contextual embeddings to sensorimotor experiences.",
      fullDescription: "Phonesthemes are sound-meaning correspondences where certain sounds evoke specific meanings or feelings (like 'gl-' suggesting light/vision in words like glitter, gleam, glow). This research investigates whether these sub-lexical patterns trigger sensorimotor experiences similar to full words. Through computational modeling and human behavioral studies, we explore how these sound patterns are grounded in embodied perception.",
      myRole: "I developed the computational pipeline to analyze correlation patterns between phonestheme structure and sensorimotor ratings, and built models to predict sensorimotor associations from sub-lexical features. I also led the human study design where about 300 participants rated pseudo-words for 11 different sensory and motor associations.",
      impact: "Understanding phonestheme grounding could reveal fundamental principles about how language connects to embodied experience at the sub-lexical level, informing both cognitive theories of language and practical applications in natural language generation.",
      tags: ["NLP", "Grounded Language", "Psycholinguistics"],
      link: "https://aclanthology.org/2026.findings-acl.2038/",
      code: "https://github.com/abhinav-usc/SENSE-model",
      webpage: "/sense",
      poster: "",
      bibtex: `@inproceedings{gupta-etal-2026-words,
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
}`,
      hasImage: true,
      hasDemo: false,
      images: [
        { src: "/proj_imgs/survey_analysis.png", alt: "Phonestheme survey analysis workflow", caption: "Figure 1: Phonestheme survey analysis workflow - from pseudoword presentation to computing sensorimotor association probabilities by sub-lexical components" },
        { src: "/proj_imgs/aud_corr.png", alt: "Model vs Human select rate for Auditory", caption: "Figure 2: Model vs Human select rate correlation for Auditory modality" },
        { src: "/proj_imgs/correlation_matrix.png", alt: "Cross-modality correlation matrix", caption: "Figure 3: Cross-modality correlation matrix" },
        { src: "/proj_imgs/box_plots.png", alt: "Participant-level correlation distributions", caption: "Figure 4: Participant-level correlation of selections vs model ratings across all sensorimotor modalities" }
      ]
    },
    {
      type: "publication",
      title: "Can Large Language Models Infer Human Actions and Motives? Evaluation in Social Prediction and Inspection Games",
      authors: ["Kaleen Shrestha", "Abhinav Gupta", "Harish Dukkipati", "Zhonghao Shi", "Maja Mataric"],
      venue: "Findings of Association for Computational Linguistics (ACL Findings), 2026",
      year: "2026",
      status: "accepted",
      description: "Investigating whether large language models can understand and predict human strategic decision-making processes through controlled game-theoretic experiments.",
      fullDescription: "This work examines how well large language models encode human social reasoning and theory of mind in strategic contexts. Using economic games like the Prisoner's Dilemma and other multi-agent scenarios, we investigate whether LLMs can predict human mental models, anticipate cooperative vs. competitive behaviors, and understand the strategic reasoning underlying human decisions in social contexts.",
      myRole: "As part of a team of 4, I designed experimental protocols for game-theoretic scenarios, implemented LLM evaluation frameworks to test theory of mind capabilities, and analyzed behavioral patterns to compare LLM predictions against actual human decision-making data from strategic games.",
      impact: "Understanding how LLMs encode social reasoning is critical for developing AI systems that can effectively collaborate with humans, predict human needs and intentions, and align with human values in multi-agent settings.",
      tags: ["LLMs", "Game Theory", "Theory of Mind"],
      link: "https://aclanthology.org/2026.findings-acl.1641/",
      code: "",
      poster: "",
      bibtex: `@inproceedings{shrestha-etal-2026-large,
    title = "Can Large Language Models Infer Human Actions and Motives? Evaluation in Social Prediction and Inspection Games",
    author = "Shrestha, Kaleen  and
      Gupta, Abhinav  and
      Dukkipati, Harish  and
      Shi, Zhonghao  and
      Mataric, Maja",
    editor = "Liakata, Maria  and
      Moreira, Viviane P.  and
      Zhang, Jiajun  and
      Jurgens, David",
    booktitle = "Findings of the {A}ssociation for {C}omputational {L}inguistics: {ACL} 2026",
    month = jul,
    year = "2026",
    address = "San Diego, California, United States",
    publisher = "Association for Computational Linguistics",
    url = "https://aclanthology.org/2026.findings-acl.1641/",
    pages = "32791--32803",
    ISBN = "979-8-89176-395-1",
}`,
      hasImage: true,
      hasDemo: false,
      images: [
        { src: "/proj_imgs/social_pred_game.png", alt: "Social Prediction Game", caption: "Figure 1: Definition of SPG (left) and the game space (right)." },
        { src: "/proj_imgs/greedy_riskaverse.png", alt: "Greedy vs Risk-Averse Agent Behavior", caption: "Figure 2: Player motive definitions for the four economic games in SPG." },
        { src: "/proj_imgs/human_v_llm.png", alt: "Inspection game architecture", caption: "Figure 3: Definition of IG." },
        { src: "/proj_imgs/llm_performance.png", alt: "LLM performance comparison", caption: "Figure 4: LLM Models Comparison for predicting Social Prediction Game actions." },
      ]
    },
    {
      type: "workshop",
      title: "Extracting Sensorimotor Associations of Phrases",
      authors: ["Abhinav Gupta", "Jesse Thomason"],
      venue: "SoCal NLP Symposium 2024",
      year: "2024",
      status: "presented",
      presentedDate: "November 2024",
      description: "Developing computational methods to extract embodied sensory and physical information from textual descriptions, bridging the gap between language and grounded perception.",
      fullDescription: "This work develops computational models to project contextual word embeddings (like BERT) into sensorimotor association spaces derived from human norms. We validate the approach across multiple applications including emoji prediction and content recommendation systems, demonstrating how grounding language in sensorimotor experience improves model performance on tasks requiring embodied understanding.",
      myRole: "I developed the projection model architecture that maps from contextual embeddings to sensorimotor spaces, designed and ran experiments on emoji prediction and recommendation tasks, and performed quantitative analysis showing improved performance when incorporating sensorimotor grounding.",
      impact: "This work demonstrates practical applications of sensorimotor grounding in NLP, showing how incorporating embodied perception into language models can improve performance on tasks requiring understanding of physical and sensory concepts.",
      tags: ["NLP", "Grounded Language", "Computational Linguistics"],
      link: "/Extracting_Sensorimotor_Information_from_Words_and_Emojis.pdf",
      code: "https://github.com/abhinav-usc/SENSE-model",
      poster: "/socalnlp_2024.pdf",
      hasImage: true,
      hasDemo: true,
      images: [
        { src: "/proj_imgs/sample_sensorimotor.png", alt: "Sample sensorimotor associations for pizza", caption: "Figure 1: Sample sensorimotor associations for a word like pizza" },
        { src: "/proj_imgs/model_performance.png", alt: "Projection models performance comparison", caption: "Figure 2: Projection Models performance comparison" },
      ]
    },
    {
      type: "workshop",
      title: "Endangered Language Preservation with Machine Translation",
      authors: ["Aryan Gulati", "Leslie Moreno", "Aditya Kumar", "Abhinav Gupta"],
      venue: "SoCal NLP Symposium 2023",
      year: "2023",
      status: "presented",
      presentedDate: "November 2023",
      description: "Collaborated with Muysc Cubun Research Group to develop NLP-based system for Chibcha language translation. Collected over 30,000 parallel entries from internet sources, old scriptures, and books.",
      fullDescription: "Chibcha (Muisca) is an extinct indigenous Colombian language with extremely limited digital resources. Working with linguists from Universidad Nacional de Colombia, we developed web scraping tools and manual digitization workflows to create a parallel corpus of over 30,000 Chibcha-Spanish sentence pairs from historical texts, religious documents, and academic sources. We then built and evaluated neural machine translation models on this low-resource dataset.",
      myRole: "As part of a team of 4 students, I developed custom web scraping tools to extract parallel text from online sources, contributed to manual digitization of historical texts, and assisted in preprocessing and cleaning the parallel corpus for MT model training.",
      impact: "This work contributes to language preservation efforts by creating critical digital infrastructure for an endangered indigenous language, enabling future linguistic research and cultural heritage preservation.",
      tags: ["NLP", "Low-Resource Languages", "Machine Translation"],
      link: "/156_Creating_a_Parallel_Corpus.pdf",
      code: "",
      poster: "/socalNLP_2023.pdf",
      hasImage: true,
      hasDemo: false,
      images: [
        { src: "/proj_imgs/map.png", alt: "Archaeological regions of Colombia", caption: "Figure 1: Archaeological regions of Colombia © Trustees of the British Museum" },
        { src: "/proj_imgs/example.png", alt: "Muisca's influence on Colombian Spanish", caption: "Figure 2: Muisca's influence on Colombian Spanish [1]" },
        { src: "/proj_imgs/corpus.png", alt: "Example Muisca and Spanish phrases", caption: "Figure 3: Muisca and Spanish phrases from our corpus [1]" },
        { src: "/proj_imgs/modelling.png", alt: "Translation model architecture", caption: "Figure 4: Translation model architecture using mBERT and XLM-R" }
      ]
    }
  ]

  const publications = researchProjects.filter(p => p.type === "publication")
  const workshopPapers = researchProjects.filter(p => p.type === "workshop")

  const teaching = [
    { role: "Math Peer Mentor", org: "USC Viterbi MESA", date: "2025 – 2026", note: "Ran weekly calculus study sessions for engineering freshmen and led program outreach through classroom visits and campus science clubs." },
    { role: "Course Producer & Peer Mentor", org: "USC Viterbi School of Engineering", date: "2022 – 2024", note: "CSCI 270 (Algorithms), CSCI 170 (Discrete Methods), CSCI 102 (C++) — held discussion sections, curated and graded exams, and mentored 300+ students." }
  ]

  const sweProjects = [
    { title: "Grad School Applications Assistant", description: "AI-powered web app to streamline graduate school applications by generating tailored personal statements, editing their materials, getting faculty recommendations, and getting detailed review and feedback on their applications", tech: ["React", "Node.js", "AI Integration"], link: "https://github.com/abhinav-usc/grad-app-assistant" },
    { title: "CampusMate", description: "Off-campus housing marketplace connecting college students with rental opportunities and roommates", tech: ["React", "AWS", "Full-Stack"], link: "https://main.d23lvw40p53qlv.amplifyapp.com/" },
    { title: "Brandshake", description: "Platform connecting brands with influencers to discover, create, and manage marketing campaigns in one place", tech: ["iOS/Android", "Mobile Development"], link: "https://apps.apple.com/us/app/brandshake/id1613614806" },
    { title: "Podcast Content Automation · Amazon", description: "Internal tool built as an SDE intern at Amazon Music to automate podcast content management — reduced manual effort by 30% and improved data accuracy through AWS integrations.", tech: ["Java", "Python", "AWS"], link: "https://music.amazon.com/podcasts" },
    { title: "Ethos", description: "Wellness companion app for mindful alcohol consumption tracking with personalized insights and community support", tech: ["Mobile Development", "Backend"], link: "https://apps.apple.com/by/app/ethos-mindful-consumption/id1622702389" },
    { title: "Personal Portfolio Website", description: "Code for this personal portfolio website showcasing my research, projects, and experience", tech: ["React", "Frontend Development"], link: "https://github.com/abhinav-usc/personal-website" },
  ]

  const formatAuthors = (authors, myName = "Abhinav Gupta") => {
    return authors.map((author, idx) => (
      <span key={idx}>
        {author === myName ? <span className="me">{author}</span> : author}
        {idx < authors.length - 1 && ", "}
      </span>
    ))
  }

  const renderNewsItem = (item, key, extraClass = '') => {
    const Icon = item.icon
    return (
      <div key={key} className={`news-item ${extraClass}`}>
        <code className="news-date">{item.date}</code>
        <Icon size={13} strokeWidth={1.8} className="news-icon" aria-hidden="true" />
        <span className="news-text">{item.text}</span>
      </div>
    )
  }

  const renderPaper = (paper) => (
    <article key={paper.title} className="research-item">
      <div className="research-year">{paper.year}</div>
      <div className="research-content">
        <div className="research-header">
          <a href={paper.webpage || (paper.arxivId ? `https://arxiv.org/abs/${paper.arxivId}` : paper.link)} target="_blank" rel="noreferrer" className="research-title-link">
            <h3 className="research-title">{paper.title}</h3>
          </a>
        </div>
        <p className="research-authors">{formatAuthors(paper.authors)}</p>
        <p className="research-venue">{paper.venue}</p>
        <p className="research-description">{paper.description}</p>

        <div className="paper-links">
          {paper.arxivId && (
            <a href={`https://arxiv.org/abs/${paper.arxivId}`} className="paper-badge" target="_blank" rel="noreferrer">
              arXiv <span className="badge-id">{paper.arxivId}</span>
            </a>
          )}
          {paper.link && !paper.arxivId && (
            <a href={paper.link} className="paper-badge" target="_blank" rel="noreferrer">
              <FileText size={12} /> paper
            </a>
          )}
          {paper.code && (
            <a href={paper.code} className="paper-badge" target="_blank" rel="noreferrer">
              <Github size={12} /> code
            </a>
          )}
          {paper.poster && (
            <a href={paper.poster} className="paper-badge" target="_blank" rel="noreferrer">
              <Presentation size={12} /> poster
            </a>
          )}
          {paper.webpage && (
            <a href={paper.webpage} className="paper-badge">
              <ExternalLink size={12} /> website
            </a>
          )}
          {paper.bibtex && <CiteButton bibtex={paper.bibtex} />}
          <button className="paper-badge read-more-badge" onClick={() => togglePaper(paper.title)}>
            {expandedPapers[paper.title] ? '− read less' : '+ read more'}
          </button>
        </div>

        {expandedPapers[paper.title] && (
          <div className="research-expanded">
            <div className="expanded-section"><h4>Full Description</h4><p>{paper.fullDescription}</p></div>
            <div className="expanded-section"><h4>My Contribution</h4><p>{paper.myRole}</p></div>
            <div className="expanded-section"><h4>Impact</h4><p>{paper.impact}</p></div>
            {paper.images && paper.images.length > 0 && (
              <div className="expanded-section"><h4>Visualizations</h4><ProjectImages images={paper.images} /></div>
            )}
            {paper.hasDemo && <div className="demo-note"><Wrench size={12} /> Interactive demo in development</div>}
          </div>
        )}
      </div>
    </article>
  )

  return (
    <div className={`portfolio ${isPageLoaded ? 'loaded' : ''}`}>
      <nav className="nav">
        <div className="nav-container">
          <a href="/" className="logo"><img className="logo" src="/logo.png" alt="AG" /></a>
          <div className="nav-links">
            <a href="#news"><Newspaper size={14} /> News</a>
            <a href="#research"><FlaskConical size={14} /> Research</a>
            <a href="#teaching"><GraduationCap size={14} /> Teaching</a>
            <a href="#projects"><Code size={14} /> Projects</a>
            <a href={cvLink} target="_blank" rel="noreferrer"><FileText size={14} /> CV</a>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-container">
          <div className="hero-header">
            <div className="hero-photo"><img src="/abhinav_headshot.png" alt="Abhinav Gupta" /></div>
            <div className="hero-info">
              <h1 className="hero-title">Abhinav Gupta</h1>
              <p className="hero-subtitle">Researcher in NLP & Embodied AI</p>
              <p className="hero-affiliation">M.S. Computer Science, New York University<br />B.S. Computer Science & B.A. Cognitive Science, University of Southern California</p>
              <div className="hero-links">
                <a href="mailto:abghinav.cs@gmail.com" className="hero-link"><Mail size={15} /> abghinav.cs@gmail.com</a>
                <a href="tel:+12132800780" className="hero-link"><Phone size={15} /> (213) 280-0780</a>
                <a href="https://github.com/abhinav-usc" className="hero-link" target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
                <a href="https://linkedin.com/in/abghinav" className="hero-link" target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn</a>
                <a href="https://scholar.google.com/citations?user=O0pe3A4AAAAJ" className="hero-link" target="_blank" rel="noreferrer"><GraduationCap size={15} /> Google Scholar</a>
                <a href={cvLink} className="hero-link" target="_blank" rel="noreferrer"><FileText size={15} /> CV</a>
              </div>
            </div>
          </div>
          <div className="hero-bio">
            <p>I'm a master's student in Computer Science at New York University, concentrating in Artificial Intelligence. I received my B.S. in Computer Science and B.A. in Cognitive Science from the University of Southern California with a specialization in Applications of Artificial Intelligence. I work on the development, analysis and applications of language models rooted in human cognition and understanding — my research interests include Natural Language Processing, AI for Understanding Human Thought, Cognitive Science, and Human-Computer Interaction.</p>
            <p>At USC, I was advised by <a className='lab-link' href="https://jessethomason.com/">Jesse Thomason</a>, <a className='lab-link' href="https://dornsife.usc.edu/tobenmintz/">Toben H. Mintz</a>, and <a className='lab-link' href="https://maja-mataric.web.app/">Maja Matarić</a>. My work has been supported by the USC Center for Undergraduate Research Fellowship, USC Provost Fellowship, and Undergraduate Research Associates Program.</p>
            <p>I graduated as a recipient of the <a className='lab-link' href="https://libraries.usc.edu/wallofscholars?award=1551" target="_blank" rel="noreferrer">USC Renaissance Scholar Prize</a>, awarded to ten undergraduates from the graduating class for academic excellence and multidisciplinary research in distinct fields, and the <a className='lab-link' href="https://ahf.usc.edu/commencement-honors/scholar-distinctions/discovery-2/" target="_blank" rel="noreferrer">Discovery Scholar Distinction</a> for my capstone research project.</p>
            <p className="currently-exploring"><strong>Currently exploring:</strong> How phonesthemes evoke sensorimotor experiences through human behavioral studies and computational modeling</p>
          </div>
        </div>
      </section>

      <section id="news" className="news">
        <div className="container">
          <h2 className="section-title"><Newspaper size={17} className="title-icon" aria-hidden="true" /> News</h2>
          <div className={`news-scroll ${showAllNews ? 'expanded' : ''}`}>
            {showAllNews ? (
              news.map((group, gi) => (
                <div key={gi} className="news-year-group">
                  <div className="news-year-label">{group.year}</div>
                  {group.items.map((item, ii) => renderNewsItem(item, ii))}
                </div>
              ))
            ) : (
              <div className="news-year-group">
                <div className="news-year-label">{recentNews[0]?.year}</div>
                {recentNews.map((item, ii) => renderNewsItem(item, ii, ii >= 2 ? 'news-item-mobile-hide' : ''))}
              </div>
            )}
          </div>
          <button className="news-toggle" onClick={() => setShowAllNews(!showAllNews)}>
            {showAllNews ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Show more</>}
          </button>
        </div>
      </section>

      <section id="research" className="research">
        <div className="container">
          <h2 className="section-title"><BookOpen size={17} className="title-icon" aria-hidden="true" /> Research</h2>
          <h3 className="subsection-title">Publications</h3>
          <div className="research-list">
            {publications.map(renderPaper)}
          </div>
          <h3 className="subsection-title">Workshop Papers & Talks</h3>
          <div className="research-list">
            {workshopPapers.map(renderPaper)}
          </div>
        </div>
      </section>

      <section id="teaching" className="teaching">
        <div className="container">
          <h2 className="section-title"><GraduationCap size={18} className="title-icon" aria-hidden="true" /> Teaching</h2>
          <div className="teaching-list">
            {teaching.map((t, index) => (
              <div key={index} className="teaching-item">
                <div className="teaching-head">
                  <span className="teaching-role">{t.role}</span>
                  <span className="teaching-org">{t.org}</span>
                  <span className="teaching-date">{t.date}</span>
                </div>
                <p className="teaching-note">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title"><Code size={17} className="title-icon" aria-hidden="true" /> Software Projects</h2>
          <div className="projects-list">
            {sweProjects.map((project, index) => (
              <a key={index} href={project.link} className="project-entry" target="_blank" rel="noreferrer">
                <div className="project-head">
                  <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="project-title">{project.title}</h3>
                  <ArrowUpRight size={14} className="project-arrow" aria-hidden="true" />
                </div>
                <p className="project-description">{project.description}</p>
                <p className="project-tech">{project.tech.join(' · ')}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="misc">
        <div className="container">
          <h2 className="section-title"><Sparkles size={17} className="title-icon" aria-hidden="true" /> Miscellaneous</h2>
          <div className="misc-content">
            <p>Outstide of research, I love to read and play guitar. I'm also an avid movie enthusiast.</p>
            <p>I'm also currently trying to learn Spanish and French. Progress: slow but enthusiastic.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Abhinav Gupta · Last updated July 2026</p>
      </footer>
    </div>
  )
}

export default App
