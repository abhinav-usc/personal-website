import { useState } from 'react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [expandedProject, setExpandedProject] = useState(null)

  const cvLink = '/Abhinav_Gupta_CV.pdf'

  const researchProjects = [
    {
      title: "Can Large Language Models Infer Human Actions and Motives in Strategic Decision Making?",
      authors: "Kaleen Shrestha, Harish Dukkipati, Abhinav Gupta, Zhonghao Shi, Maja Mataric",
      venue: "AAAI 2026 Conference Submission",
      date: "July 2025",
      description: "Investigating whether large language models can understand and predict human strategic decision-making processes",
      tags: ["LLMs", "Game Theory", "Human-AI Interaction", "Strategic Reasoning"],
      link: "https://openreview.net/pdf?id=LvU3zy7SYM"
    },
    {
      title: "Capturing the Essence of a Phrase: Extracting Physical and Sensory Information from Text",
      authors: "Abhinav Gupta",
      venue: "SoCal NLP Symposium 2024",
      date: "November 2024",
      description: "Developing methods to extract embodied sensory and physical information from textual descriptions",
      tags: ["NLP", "Embodied AI", "Multimodal Learning", "Grounded Language"],
      link: "https://openreview.net/pdf?id=OGOPC2rkDn"
    },
    {
      title: "Creating a Parallel Corpus for a Low-Resource, Indigenous Language: Muisca-to-Spanish",
      authors: "Aryan Gulati, Leslie Moreno, Aditya Kumar, Abhinav Gupta",
      venue: "SocalNLP 2023",
      date: "November 2023",
      description: "Building linguistic resources to preserve and revitalize the Muisca indigenous language through computational methods",
      tags: ["Low-Resource NLP", "Machine Translation", "Language Preservation"],
      link: "https://openreview.net/pdf?id=bP6LOCZKpx"
    }
  ]

  const workExperience = [
    {
      role: "Graduate Research Assistant",
      org: "Interaction Lab, USC",
      date: "Aug 2023 – Present",
      focus: "Developing language-grounded evaluation tools so embodied agents can reason about human objectives and constraints.",
      highlights: [
        "Prototype multimodal datasets that align sensory cues, text, and strategy annotations",
        "Lead cross-lab studies to benchmark how LLMs anticipate human moves in repeated games"
      ]
    },
    {
      role: "Software Engineering Intern",
      org: "Intuit",
      date: "May 2024 – Aug 2024",
      focus: "Shipped research-informed platform features that personalize financial education for new users.",
      highlights: [
        "Designed observability dashboards that trimmed triage time by 35%",
        "Partnered with designers to translate qualitative research into production-ready full-stack flows"
      ]
    }
  ]

  const sweProjects = [
    {
      title: "CampusMate",
      description: "Housing marketplace connecting college students with off-campus housing opportunities",
      tech: ["Web Development", "Database Design", "Full-Stack"],
      link: ""
    },
    {
      title: "Brandshake",
      description: "Mobile application for brand engagement and marketing",
      tech: ["Mobile Development", "iOS/Android"],
      link: "https://apps.apple.com/us/app/brandshake/id1613614806"
    },
    {
      title: "Ethos",
      description: "Mobile application for point-based systems",
      tech: ["Mobile Development", "Backend Integration"],
      link: "https://apps.apple.com/by/app/ethos-mindful-consumption/id1622702389"
    },
    {
      title: "Neigh",
      description: "Community-focused mobile application",
      tech: ["Mobile Development", "Social Features"],
      link: "https://apps.apple.com/us/app/neigh/id1599915617"
    }
  ]

  const skills = {
    "Research Areas": ["Natural Language Processing", "Embodied AI", "Human-AI Interaction", "Low-Resource NLP"],
    "Languages": ["Python", "Java", "JavaScript", "C++"],
    "ML/AI Tools": ["PyTorch", "TensorFlow", "Hugging Face", "scikit-learn"],
    "Development": ["React", "Node.js", "Android SDK", "Git"]
  }

  const handleProjectToggle = (index) => {
    setExpandedProject(prev => (prev === index ? null : index))
  }

  return (
    <div className="portfolio">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <h2 className="logo">Abhinav Gupta</h2>
          <div className="nav-links">
            <a href="#home" onClick={() => setActiveSection('home')}>Home</a>
            <a href="#about" onClick={() => setActiveSection('about')}>About</a>
            <a href="#projects" onClick={() => setActiveSection('research')}>Research</a>
            <a href="#experience" onClick={() => setActiveSection('experience')}>Experience</a>
            <a href="#contact" onClick={() => setActiveSection('contact')}>Contact</a>
            <a href={cvLink} target="_blank" rel="noreferrer">CV</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container hero-grid">
          <div className="hero-photo">
            <div className="photo-frame">
              <img src="/abhinav_headshot.png" alt="Portrait Placeholder" />
            </div>
          </div>
          <div className="hero-content">
            <p className="eyebrow">NLP & Embodied AI Researcher</p>
            <h1 className="hero-title">
              Abhinav <span className="highlight">Gupta</span>
            </h1>
            <p className="hero-lede">
              I design research studies and software that connect grounded language understanding with human-centered decision making. My work spans embodied agents, strategic reasoning, and multilingual tools for endangered languages.
            </p>
            <ul className="summary-list">
              <li>Blend qualitative user studies with computational benchmarks to evaluate capable, trustworthy AI systems.</li>
              <li>Collaborate with roboticists, linguists, and product teams to turn prototypes into deployed experiences.</li>
              <li>Share findings via posters, workshops, and mentoring student researchers across USC.</li>
            </ul>
            <div className="hero-buttons">
              <a href="#projects" className="btn btn-primary">View Research</a>
              <a href="#contact" className="btn btn-secondary">Get In Touch</a>
              <a href={cvLink} className="btn btn-ghost" target="_blank" rel="noreferrer">Download CV</a>
            </div>
            <div className="quick-stats">
              <div className="stat-card">
                <span className="stat-value">3+</span>
                <span className="stat-label">Peer-reviewed Works</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">5</span>
                <span className="stat-label">Industry Apps Launched</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">2</span>
                <span className="stat-label">Active Lab Collaborations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <p>
              I'm a Computer Science student at USC with a focus on Natural Language Processing, 
              embodied AI, and understanding how humans and AI systems can work together effectively.
            </p>
            <p>
              My research spans from building computational resources for low-resource languages to 
              investigating how large language models understand strategic human behavior. I'm 
              particularly interested in grounding language in physical and sensory experience.
            </p>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="projects" className="research">
        <div className="container">
          <h2 className="section-title">Research Projects</h2>
          <div className="research-grid">
            {researchProjects.map((paper, index) => {
              const isOpen = expandedProject === index
              return (
                <article key={paper.title} className={`research-card ${isOpen ? 'is-open' : ''}`}>
                  <div className="research-card-header">
                    <div className="poster-placeholder">
                      <span>Poster Preview</span>
                    </div>
                    <div className="research-card-summary">
                      <h3>{paper.title}</h3>
                      <p className="authors">{paper.authors}</p>
                      <p className="venue">{paper.venue} • {paper.date}</p>
                    </div>
                    <button
                      type="button"
                      className="toggle-details"
                      onClick={() => handleProjectToggle(index)}
                      aria-expanded={isOpen}
                      aria-controls={`research-details-${index}`}
                    >
                      {isOpen ? 'Hide Details' : 'More Details'}
                      <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                    </button>
                  </div>
                  {isOpen && (
                    <div className="research-details" id={`research-details-${index}`}>
                      <p className="description">{paper.description}</p>
                      <div className="tags">
                        {paper.tags.map((tag) => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                      <a href={paper.link} className="paper-link" target="_blank" rel="noreferrer">
                        Read Paper →
                      </a>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience" className="experience">
        <div className="container">
          <div className="experience-intro">
            <h2 className="section-title">Work Experience</h2>
            <p>Pairing rigorous research with product thinking to ship human-centered AI systems.</p>
          </div>
          <div className="experience-grid">
            {workExperience.map((role) => (
              <article key={`${role.role}-${role.org}`} className="experience-card">
                <div className="experience-header">
                  <div>
                    <h3>{role.role}</h3>
                    <p className="experience-org">{role.org}</p>
                  </div>
                  <span className="experience-date">{role.date}</span>
                </div>
                <p className="experience-focus">{role.focus}</p>
                <ul className="experience-highlights">
                  {role.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Software Projects Section */}
      <section className="projects">
        <div className="container">
          <h2 className="section-title">Software Projects</h2>
          <div className="projects-grid">
            {sweProjects.map((project, index) => (
              <div key={index} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-stack">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
                {project.link ? (
                  <a href={project.link} className="project-link" target="_blank" rel="noreferrer">Learn More →</a>
                ) : (
                  <span className="project-link muted">Demo Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills">
        <div className="container">
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="skills-grid">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="skill-category">
                <h3>{category}</h3>
                <div className="skill-items">
                  {items.map((skill, i) => (
                    <span key={i} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <p className="contact-description">
            I'm always open to new opportunities and collaborations!
          </p>
          <div className="contact-links">
            <a href="mailto:abhinavg@usc.edu" className="contact-btn">
              📧 Email
            </a>
            <a href="https://github.com/abhinav81003" className="contact-btn">
              💻 GitHub
            </a>
            <a href="https://linkedin.com/in/abghinav" className="contact-btn">
              💼 LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Abhinav Gupta. Built with React + Vite.</p>
      </footer>
    </div>
  )
}

export default App
