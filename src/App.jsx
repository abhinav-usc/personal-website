import { useState, useEffect, useRef } from 'react'
import { Mail, Github, Linkedin, FileText, Book, Briefcase, Code, Award, ExternalLink, FlaskConical, Users, Lightbulb, Laptop, MessageCircle, GithubIcon, Star } from 'lucide-react'
import './App.css'

function usePageLoadAnimation() {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => { setIsLoaded(true) }, [])
  return isLoaded
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
      {copied ? '✓ copied!' : '📋 cite'}
    </button>
  )
}

function App() {
  const cvLink = '/Abhinav_Gupta_CV.pdf'
  const [selectedTag, setSelectedTag] = useState(null)
  const [expandedPapers, setExpandedPapers] = useState({})
  const [showAllNews, setShowAllNews] = useState(false)
  const isPageLoaded = usePageLoadAnimation()

  const togglePaper = (index) => {
    setExpandedPapers(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const news = [
    {
      year: "2026",
      items: [
        { date: "MAY", emoji: "🎓", text: <>Graduating from USC with dual degrees in Computer Science and Cognitive Science, along with a specialization in AI Applications.</> },
        { date: "APR", emoji: "📝", text: <>Two papers accepted at <strong>ACL 2026 Findings</strong>: <a className="news-link" href="https://arxiv.org/abs/2602.00469" target="_blank" rel="noreferrer">Words that make SENSE</a> and <a className="news-link" href="/Can_Large_Language_Models_Infer_Human_Actions_and_Motives_in_Strategic_Decision_Making_.pdf" target="_blank" rel="noreferrer">Can LLMs Infer Human Actions and Motives in SDM?</a></> },
        { date: "MAR", emoji: "🏅", text: <>Awarded the <a className="news-link" href="https://libraries.usc.edu/wallofscholars?award=1551" target="_blank" rel="noreferrer">USC Renaissance Scholar Prize</a>, given to 10 undergraduates for excellence across two distinct fields.</> },
        { date: "FEB", emoji: "🏅", text: <>Received the <a className="news-link" href="https://ahf.usc.edu/commencement-honors/scholar-distinctions/discovery-2/" target="_blank" rel="noreferrer">USC Discovery Scholar Distinction</a>.</> },
        { date: "JAN", emoji: "📄", text: <><a className="news-link" href="https://arxiv.org/abs/2602.00469" target="_blank" rel="noreferrer">Words that make SENSE</a> posted on arXiv.</> },
      ]
    },
    {
      year: "2025",
      items: [
        { date: "AUG", emoji: "📚", text: <>Started as Math Peer Mentor at <a className="news-link" href="https://sites.usc.edu/mesa-u/math-support/" target="_blank" rel="noreferrer">USC Viterbi MESA</a>.</> },
        { date: "MAY", emoji: "🏅", text: <>Awarded the <a className="news-link" href="https://undergrad.usc.edu/experience/research/" target="_blank" rel="noreferrer">Center for Undergraduate Research in Viterbi Engineering Fellowship</a>.</> },
      ]
    },
    {
      year: "2024",
      items: [
        { date: "DEC", emoji: "🔬", text: <>Joined the <a className="news-link" href="https://uscinteractionlab.web.app/" target="_blank" rel="noreferrer">Interaction Lab</a>, working with Maja Matarić on LLM theory of mind.</> },
        { date: "NOV", emoji: "🎤", text: <>Presented <a className="news-link" href="/Extracting_Sensorimotor_Information_from_Words_and_Emojis.pdf" target="_blank" rel="noreferrer">Extracting Sensorimotor Associations</a> at <a className="news-link" href="https://socalnlp.github.io/symp24/index.html" target="_blank" rel="noreferrer">SoCal NLP 2024</a>.</> },
        { date: "MAY", emoji: "🏅", text: <>Awarded the <a className="news-link" href="https://undergrad.usc.edu/experience/research/" target="_blank" rel="noreferrer">USC Provost Fellowship</a> for summer research.</> },
      ]
    },
    {
      year: "2023",
      items: [
        { date: "OCT", emoji: "🎤", text: <>Presented <a className="news-link" href="/156_Creating_a_Parallel_Corpus.pdf" target="_blank" rel="noreferrer">Creating a Parallel Corpus for Muisca</a> at <a className="news-link" href="https://socalnlp.github.io/symp23/index.html" target="_blank" rel="noreferrer">SoCal NLP 2023</a>.</> },
        { date: "AUG", emoji: "🏅", text: <>Selected as an <a className="news-link" href="https://academicprograms.usc.edu/services/undergraduate-research-and-experiential-learning/usc-undergraduate-research-associates-program/" target="_blank" rel="noreferrer">Undergraduate Research Associates Program</a> Scholar.</> },
        { date: "AUG", emoji: "🔬", text: <>Joined the <a className="news-link" href="https://glamor.rocks/" target="_blank" rel="noreferrer">GLAMOR Lab</a>, working with Jesse Thomason on grounded language.</> },
      ]
    },
    {
      year: "2021",
      items: [
        { date: "AUG", emoji: "🏫", text: <>Started at the <a className="news-link" href="https://www.usc.edu/" target="_blank" rel="noreferrer">University of Southern California</a> to pursue a B.S. in Computer Science and B.A. in Cognitive Science.</> },
      ]
    },
  ]

  const researchProjects = [
    {
      title: "Words that make SENSE: Sensorimotor Norms in Learned Lexical Token Representations",
      authors: ["Abhinav Gupta", "Toben H. Mintz", "Jesse Thomason"],
      venue: "Findings of Association for Computational Linguistics (ACL Findings), 2026",
      arxivId: "2602.00469",
      year: "2026",
      status: "accepted",
      featured: true,
      highlighted: true,
      description: "Investigating whether computational word embeddings capture human-like sensorimotor associations and developing models to project contextual embeddings to sensorimotor experiences.",
      fullDescription: "Phonesthemes are sound-meaning correspondences where certain sounds evoke specific meanings or feelings (like 'gl-' suggesting light/vision in words like glitter, gleam, glow). This research investigates whether these sub-lexical patterns trigger sensorimotor experiences similar to full words. Through computational modeling and human behavioral studies, we explore how these sound patterns are grounded in embodied perception.",
      myRole: "I developed the computational pipeline to analyze correlation patterns between phonestheme structure and sensorimotor ratings, and built models to predict sensorimotor associations from sub-lexical features. I also led the human study design where about 300 participants rated pseudo-words for 11 different sensory and motor associations.",
      impact: "Understanding phonestheme grounding could reveal fundamental principles about how language connects to embodied experience at the sub-lexical level, informing both cognitive theories of language and practical applications in natural language generation.",
      tags: ["NLP", "Grounded Language", "Psycholinguistics"],
      link: "https://arxiv.org/abs/2602.00469",
      code: "https://github.com/abhinav-usc/SENSE-model",
      webpage: "/sense",
      poster: "",
      bibtex: `@inproceedings{gupta:sense,
  title={Words that make {SENSE}: Sensorimotor Norms in Learned Lexical Token Representations},
  author={Abhinav Gupta and Toben H. Mintz and Jesse Thomason},
  booktitle={Findings of Association for Computational Linguistics (ACL Findings)},
  year={2026},
  url={https://arxiv.org/abs/2602.00469}
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
      title: "Can LLMs Infer Human Actions and Motives in Strategic Decision Making?",
      authors: ["Kaleen Shrestha", "Harish Dukkipati", "Abhinav Gupta", "Zhonghao Shi", "Maja Mataric"],
      venue: "Findings of Association for Computational Linguistics (ACL Findings), 2026",
      year: "2026",
      status: "accepted",
      featured: false,
      description: "Investigating whether large language models can understand and predict human strategic decision-making processes through controlled game-theoretic experiments.",
      fullDescription: "This work examines how well large language models encode human social reasoning and theory of mind in strategic contexts. Using economic games like the Prisoner's Dilemma and other multi-agent scenarios, we investigate whether LLMs can predict human mental models, anticipate cooperative vs. competitive behaviors, and understand the strategic reasoning underlying human decisions in social contexts.",
      myRole: "As part of a team of 4, I designed experimental protocols for game-theoretic scenarios, implemented LLM evaluation frameworks to test theory of mind capabilities, and analyzed behavioral patterns to compare LLM predictions against actual human decision-making data from strategic games.",
      impact: "Understanding how LLMs encode social reasoning is critical for developing AI systems that can effectively collaborate with humans, predict human needs and intentions, and align with human values in multi-agent settings.",
      tags: ["LLMs", "Game Theory", "Theory of Mind"],
      link: "/Can_Large_Language_Models_Infer_Human_Actions_and_Motives_in_Strategic_Decision_Making_.pdf",
      code: "",
      poster: "",
      bibtex: `@inproceedings{shrestha:sdm,
  title={Can LLMs Infer Human Actions and Motives in Strategic Decision Making?},
  author={Kaleen Shrestha and Harish Dukkipati and Abhinav Gupta and Zhonghao Shi and Maja Matari\\'c},
  booktitle={Findings of Association for Computational Linguistics (ACL Findings)},
  year={2026}
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
      title: "Extracting Sensorimotor Associations of Phrases",
      authors: ["Abhinav Gupta", "Jesse Thomason"],
      venue: "SoCal NLP Symposium 2024",
      year: "2024",
      status: "presented",
      featured: false,
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
      title: "Endangered Language Preservation with Machine Translation",
      authors: ["Aryan Gulati", "Leslie Moreno", "Aditya Kumar", "Abhinav Gupta"],
      venue: "SoCal NLP Symposium 2023",
      year: "2023",
      status: "presented",
      featured: false,
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

  const featuredResearch = researchProjects.filter(p => p.featured)

  const workExperience = [
    { role: "Math Peer Mentor", org: "USC Viterbi MESA University", date: "Aug 2025 - Present", icon: "📚", description: "Mentoring freshmen in introductory calculus courses, providing study techniques and helping with homework problems. Spreading awareness about the program through social media and email outreach, classroom visits, and coordinating with science clubs." },
    { role: "Course Producer & Peer Mentor", org: "USC Viterbi School of Engineering", date: "Jan 2022 - Dec 2024", icon: "👨‍🏫", description: "Tutored classes including CSCI 270 (Algorithm Design), CSCI 170 (Discrete Mathematics), and CSCI 102 (Intro to C++). Entrusted with grading tests and assignments, helping over 300 students with difficult topics, hosting discussion sections, and contributing to test curation." }
  ]

  const sweProjects = [
    { title: "Grad School Applications Assistant", description: "AI-powered web app to streamline graduate school applications by generating tailored personal statements, editing their materials, getting faculty recommendations, and getting detailed review and feedback on their applications", tech: ["React", "Node.js", "AI Integration"], link: "https://github.com/abhinav-usc/grad-app-assistant" },
    { title: "CampusMate", description: "Off-campus housing marketplace connecting college students with rental opportunities and roommates", tech: ["React", "AWS", "Full-Stack"], link: "https://main.d23lvw40p53qlv.amplifyapp.com/" },
    { title: "Brandshake", description: "Platform connecting brands with influencers to discover, create, and manage marketing campaigns in one place", tech: ["iOS/Android", "Mobile Development"], link: "https://apps.apple.com/us/app/brandshake/id1613614806" },
    { title: "Software Dev Engineering Intern, Amazon Inc.", description: "Designed and implemented an internal tool to automate podcast content management. Reduced manual effort by 30% and improved data accuracy through integration with AWS services.", tech: ["Java", "Python", "AWS"], link: "https://music.amazon.com/podcasts" },
    { title: "Ethos", description: "Wellness companion app for mindful alcohol consumption tracking with personalized insights and community support", tech: ["Mobile Development", "Backend"], link: "https://apps.apple.com/by/app/ethos-mindful-consumption/id1622702389" },
    { title: "Personal Portfolio Website", description: "Code for this personal portfolio website showcasing my research, projects, and experience", tech: ["React", "Frontend Development"], link: "https://github.com/abhinav-usc/personal-website" },
  ]

  const allTags = [...new Set(researchProjects.flatMap(p => p.tags))]
  const filteredProjects = selectedTag ? researchProjects.filter(p => p.tags.includes(selectedTag)) : researchProjects

  const formatAuthors = (authors, myName = "Abhinav Gupta") => {
    return authors.map((author, idx) => (
      <span key={idx}>
        {author === myName ? <span className="me">{author}</span> : author}
        {idx < authors.length - 1 && ", "}
      </span>
    ))
  }

  return (
    <div className={`portfolio ${isPageLoaded ? 'loaded' : ''}`}>
      <nav className="nav">
        <div className="nav-container">
          <a href="/" className="logo"><img className="logo" src="/logo.png" alt="AG" /></a>
          <div className="nav-links">
            <a href="#news">📰 News</a>
            <a href="#research">🔬 Research</a>
            <a href="#experience"><Briefcase size={16} /> Experience</a>
            <a href="#projects"><Code size={16} /> Projects</a>
            <a href={cvLink} target="_blank" rel="noreferrer"><FileText size={16} /> CV</a>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-container">
          <div className="hero-header">
            <div className="hero-photo"><img src="/abhinav_headshot.png" alt="Abhinav Gupta" /></div>
            <div className="hero-info">
              <h1 className="hero-title">Abhinav Gupta</h1>
              <p className="hero-subtitle">Undergraduate Researcher in NLP & Embodied AI</p>
              <p className="hero-affiliation">B.S. Computer Science & B.S. Cognitive Science with AI Applications Specialization<br />University of Southern California</p>
              <div className="hero-links">
                <a href="mailto:abhinavg@usc.edu" className="hero-link"><Mail size={16} /> abhinavg@usc.edu</a>
                <a href="tel:+12132800780" className="hero-link">📞 (213) 280-0780</a>
                <a href="https://github.com/abhinav-usc" className="hero-link" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>
                <a href="https://linkedin.com/in/abghinav" className="hero-link" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>
                <a href={cvLink} className="hero-link" target="_blank" rel="noreferrer"><FileText size={16} /> CV</a>
              </div>
            </div>
          </div>
          <div className="hero-bio">
            <p>I'm an undergraduate researcher at University of Southern California. I work on the development, analysis and applications of language models rooted in human cognition and understanding. My research interests include Natural Language Processing, AI for Understanding Human Thought, Cognitive Science, and Human-Computer Interaction.</p>
            <p>I'm advised by <a className='lab-link' href="https://jessethomason.com/">Jesse Thomason</a>, <a className='lab-link' href="https://dornsife.usc.edu/tobenmintz/">Toben H. Mintz</a>, and <a className='lab-link' href="https://maja-mataric.web.app/">Maja Matarić</a>.</p>
            <p>My work has been supported by the USC Center for Undergraduate Research Fellowship, USC Provost Fellowship, and Undergraduate Research Associates Program.</p>
            <p className="currently-exploring"><strong>Currently exploring:</strong> How phonesthemes evoke sensorimotor experiences through human behavioral studies and computational modeling</p>
          </div>
        </div>
      </section>

      <section id="news" className="news">
        <div className="container">
          <h2 className="section-title">📰 News</h2>
          <div className={`news-scroll ${showAllNews ? 'expanded' : ''}`}>
            {(showAllNews ? news : news.filter(g => g.year === "2026")).map((group, gi) => (
              <div key={gi} className="news-year-group">
                <div className="news-year-label">{group.year}</div>
                {group.items.map((item, ii) => (
                  <div key={ii} className="news-item">
                    <code className="news-date">{item.date}</code>
                    <span className="news-emoji">{item.emoji}</span>
                    <span className="news-text">{item.text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button className="news-toggle" onClick={() => setShowAllNews(!showAllNews)}>
            {showAllNews ? '▲ Show less' : '▼ Show more'}
          </button>
        </div>
      </section>

      <section id="research" className="research">
        <div className="container">
          <h2 className="section-title"><Book size={22} /> Research Work</h2>
          <div className="research-list">
            {filteredProjects.map((paper, index) => (
              <article key={index} className={`research-item ${paper.highlighted ? 'highlighted-paper' : ''}`}>
                <div className="research-year">{paper.year}</div>
                <div className="research-content">
                  <div className="research-header">
                    <a href={paper.arxivId ? `https://arxiv.org/abs/${paper.arxivId}` : paper.link} target="_blank" rel="noreferrer" className="research-title-link">
                      <h3 className="research-title">{paper.title}</h3>
                    </a>
                    <span className={`status-badge ${paper.status}`}>
                      {paper.status === 'accepted' ? '✅ Accepted' :
                       paper.status === 'presented' ? `✓ Presented ${paper.presentedDate}` : ''}
                    </span>
                  </div>
                  <p className="research-authors">{formatAuthors(paper.authors)}</p>
                  <p className="research-venue">{paper.venue}</p>
                  <p className="research-description">{paper.description}</p>
                  
                  <div className="paper-links">
                    {paper.arxivId && (
                      <a href={`https://arxiv.org/abs/${paper.arxivId}`} className="paper-badge arxiv-badge" target="_blank" rel="noreferrer">
                        arXiv <span className="badge-id">{paper.arxivId}</span>
                      </a>
                    )}
                    {paper.link && !paper.arxivId && (
                      <a href={paper.link} className="paper-badge paper-link-badge" target="_blank" rel="noreferrer">
                        <FileText size={14} /> paper
                      </a>
                    )}
                    {paper.code && (
                      <a href={paper.code} className="paper-badge code-badge" target="_blank" rel="noreferrer">
                        <Github size={14} /> code
                      </a>
                    )}
                    {paper.poster && (
                      <a href={paper.poster} className="paper-badge poster-badge" target="_blank" rel="noreferrer">
                        📊 poster
                      </a>
                    )}
                    {paper.webpage && (
                      <a href={paper.webpage} className="paper-badge webpage-badge">
                        <ExternalLink size={14} /> website
                      </a>
                    )}
                    {paper.bibtex && <CiteButton bibtex={paper.bibtex} />}
                    <button className="paper-badge read-more-badge" onClick={() => togglePaper(index)}>
                      {expandedPapers[index] ? '− Read less' : '+ Read more'}
                    </button>
                  </div>

                  {expandedPapers[index] && (
                    <div className="research-expanded">
                      <div className="expanded-section"><h4>Full Description</h4><p>{paper.fullDescription}</p></div>
                      <div className="expanded-section"><h4>My Contribution</h4><p>{paper.myRole}</p></div>
                      <div className="expanded-section"><h4>Impact</h4><p>{paper.impact}</p></div>
                      {paper.images && paper.images.length > 0 && (
                        <div className="expanded-section"><h4>Visualizations</h4><ProjectImages images={paper.images} /></div>
                      )}
                      {paper.hasDemo && <div className="demo-note">🔧 Interactive demo in development</div>}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="experience">
        <div className="container">
          <h2 className="section-title"><Briefcase size={22} /> Teaching</h2>
          <div className="experience-list">
            {workExperience.map((role, index) => (
              <article key={index} className="experience-item">
                <div className="experience-date">{role.date}</div>
                <div className="experience-content">
                  <h3 className="experience-title"><span className="experience-icon">{role.icon}</span>{role.role}</h3>
                  <p className="experience-org">{role.org}</p>
                  <p className="experience-description">{role.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title"><Laptop size={22} /> Software Projects</h2>
          <div className="projects-grid">
            {sweProjects.map((project, index) => (
              <a key={index} href={project.link} className="project-card-link" target="_blank" rel="noreferrer">
                <div className="project-card">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, i) => <span key={i} className="tech-tag">{tech}</span>)}
                  </div>
                  <span className="project-link">View Project <ExternalLink size={14} /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="misc">
        <div className="container">
          <h2 className="section-title"> ❇ Miscellaneous</h2>
          <div className="misc-content">
            <p>When I'm not in the lab, I'm usually playing guitar (currently working through Blackbird by The Beatles), cooking my way through Italian and Mediterranean recipes with varying degrees of success, or reading. Currently on <em>The Iliad</em> by Homer.</p>
            <p>I'm also trying to learn Spanish. Progress: slow but enthusiastic.</p>
          </div>
        </div>
      </section>

      {/* <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title"><MessageCircle size={22} /> Contact</h2>
          <p className="contact-description">I'm always interested in discussing research collaborations and new opportunities.</p>
          <div className="contact-links">
            <a href="mailto:abhinavg@usc.edu" className="contact-link"><Mail size={18} /><span>Email</span></a>
            <a href="tel:+12132800780" className="contact-link">📞<span>Phone</span></a>
            <a href="https://github.com/abhinav81003" className="contact-link" target="_blank" rel="noreferrer"><Github size={18} /><span>GitHub</span></a>
            <a href="https://linkedin.com/in/abghinav" className="contact-link" target="_blank" rel="noreferrer"><Linkedin size={18} /><span>LinkedIn</span></a>
          </div>
        </div>
      </section> */}

      <footer className="footer">
        <p>© 2025 Abhinav Gupta, Last updated: April 2026</p>
      </footer>
    </div>
  )
}

export default App