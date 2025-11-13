import { useState } from 'react'
import './App.css'

function App() {
  const cvLink = '/Abhinav_Gupta_CV.pdf'

  const researchProjects = [
    {
      title: "Can Large Language Models Infer Human Actions and Motives in Strategic Decision Making?",
      authors: ["Kaleen Shrestha", "Harish Dukkipati", "Abhinav Gupta", "Zhonghao Shi", "Maja Mataric"],
      venue: "AAAI 2026 Conference (Under Review)",
      year: "2025",
      description: "Investigating whether large language models can understand and predict human strategic decision-making processes through controlled game-theoretic experiments.",
      tags: ["LLMs", "Game Theory", "Theory of Mind", "Strategic Reasoning"],
      link: "https://openreview.net/pdf?id=LvU3zy7SYM"
    },
    {
      title: "Capturing the Essence of a Phrase: Extracting Physical and Sensory Information from Text",
      authors: ["Abhinav Gupta"],
      venue: "SoCal NLP Symposium 2024",
      year: "2024",
      description: "Developing computational methods to extract embodied sensory and physical information from textual descriptions, bridging the gap between language and grounded perception.",
      tags: ["NLP", "Embodied AI", "Multimodal Learning", "Sensorimotor Grounding"],
      link: "https://openreview.net/pdf?id=OGOPC2rkDn"
    },
    {
      title: "Creating a Parallel Corpus for a Low-Resource, Indigenous Language: Muisca-to-Spanish",
      authors: ["Aryan Gulati", "Leslie Moreno", "Aditya Kumar", "Abhinav Gupta"],
      venue: "SoCal NLP Symposium 2023",
      year: "2023",
      description: "Building linguistic resources to preserve and revitalize the Muisca indigenous language through computational methods and machine translation.",
      tags: ["Low-Resource NLP", "Machine Translation", "Language Preservation"],
      link: "https://openreview.net/pdf?id=bP6LOCZKpx"
    }
  ]

  const workExperience = [
    {
      role: "Math Peer Mentor",
      org: "USC Viterbi C.E.N.T.R.I.C. Program",
      date: "Aug 2025 – Present",
      description: "Mentoring freshmen in introductory calculus courses, providing study techniques and homework support.",
      highlights: [
        "Supporting students through personalized tutoring and developing effective study strategies",
        "Coordinating outreach efforts through social media, email campaigns, and classroom visits"
      ]
    },
    {
      role: "Undergraduate Research Assistant",
      org: "Interaction Lab, USC",
      date: "Dec 2024 – Present",
      description: "Developing language-grounded evaluation tools for embodied agents to reason about human objectives and constraints in strategic settings.",
      highlights: [
        "Prototyping multimodal datasets aligning sensory cues, text, and strategy annotations",
        "Conducting cross-lab studies to benchmark LLM performance in anticipating human behavior in repeated games"
      ]
    },

    {
      role: "Undergraduate Researcher",
      org: "Language Development Lab, USC",
      date: "Aug 2023 – Present",
      description: "Performing sensorimotor analysis of embodied language to improve grounded language understanding in AI systems.",
      highlights: [
        "Built data collection pipelines to gather embodied and sensory annotations from human participants",
        "Designed experiments evaluating how embodied cues improve language model comprehension of physical concepts"
      ]
    },
    {
      role: "Software Engineering Intern",
      org: "Amazon",
      date: "May 2023 – Aug 2023",
      description: "Shipped research-informed platform features personalizing financial education for new users.",
      highlights: [
        "Designed observability dashboards reducing triage time by 35%",
        "Partnered with designers to translate qualitative research into production-ready full-stack flows"
      ]
    },
    {
      role: "Course Producer & Peer Mentor",
      org: "USC Viterbi School of Engineering",
      date: "Jan 2022 – Dec 2024",
      description: "Tutored computer science courses including Algorithm Design, Discrete Mathematics, and C++ Programming.",
      highlights: [
        "Supported over 300 students through tutoring sessions, grading, and hosting discussion sections",
        "Assisted with test curation and helped students master challenging technical concepts"
      ]
    },
    {
      role: "Research Assistant",
      org: "Signal Analysis and Interpretation Lab, USC",
      date: "Aug 2021 – Jan 2022",
      description: "Analyzed emotional perception in video data using deep learning models under Prof. Shrikanth Narayanan.",
      highlights: [
        "Analyzed emotional perception patterns across 20+ video clips using deep learning techniques",
        "Developed bias mitigation algorithms to address demographic-related distortions in emotion recognition systems"
      ]
    }
  ]

  const skills = {
    "Research Interests": [
      "Natural Language Processing",
      "Embodied AI & Grounded Language",
      "Human-AI Interaction",
      "Multimodal Learning",
      "Low-Resource NLP"
    ],
    "Technical Skills": [
      "Python, Java, JavaScript, C++",
      "PyTorch, TensorFlow, Hugging Face",
      "React, Node.js, Android SDK",
      "Git, Linux, Cloud Computing"
    ]
  }

  const sweProjects = [
    {
      title: "CampusMate",
      description: "Housing marketplace connecting college students with off-campus housing opportunities",
      tech: ["React", "AWS", "Full-Stack"],
      link: "https://main.d23lvw40p53qlv.amplifyapp.com/"
    },
    {
      title: "Brandshake",
      description: "Mobile application for brand engagement and marketing",
      tech: ["iOS/Android", "Mobile Development"],
      link: "https://apps.apple.com/us/app/brandshake/id1613614806"
    },
    {
      title: "Ethos",
      description: "Mobile application for mindful consumption tracking",
      tech: ["Mobile Development", "Backend"],
      link: "https://apps.apple.com/by/app/ethos-mindful-consumption/id1622702389"
    },
    {
      title: "Neigh",
      description: "Community-focused social mobile application",
      tech: ["Mobile Development", "Social Features"],
      link: "https://apps.apple.com/us/app/neigh/id1599915617"
    }
  ]

  const formatAuthors = (authors, myName = "Abhinav Gupta") => {
    return authors.map((author, idx) => (
      <span key={idx}>
        {author === myName ? (
          <span className="me">{author}</span>
        ) : (
          author
        )}
        {idx < authors.length - 1 && ", "}
      </span>
    ))
  }

  return (
    <div className="portfolio">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <a href="/" className="logo">
            <img className="logo" src="/logo.png" alt="AG" />
          </a>
          <div className="nav-links">
            <a href="#research">Research</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
            <a href={cvLink} target="_blank" rel="noreferrer">CV</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-header">
            <div className="hero-photo">
              <img src="/abhinav_headshot.png" alt="Abhinav Gupta" />
            </div>
            <div className="hero-info">
              <h1 className="hero-title">Abhinav Gupta</h1>
              <p className="hero-subtitle">Undergraduate Researcher in NLP & Embodied AI</p>
              <p className="hero-affiliation">
                B.S. Computer Science & B.S. Cognitive Science with AI Applications Specialization
                <br />
                University of Southern California
              </p>
              <div className="hero-links">
                <a href="mailto:abhinavg@usc.edu" className="hero-link">abhinavg@usc.edu</a>
                <a href="https://github.com/abhinav-usc" className="hero-link" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://linkedin.com/in/abghinav" className="hero-link" target="_blank" rel="noreferrer">LinkedIn</a>
                <a href={cvLink} className="hero-link" target="_blank" rel="noreferrer">CV</a>
              </div>
            </div>
          </div>
          <div className="hero-bio">
            <p>
              I'm an undergraduate researcher at USC working at the intersection of natural language processing,
              embodied AI, and cognitive science. My research focuses on grounding language in sensory and physical
              experience, investigating how large language models encode social reasoning, and building computational
              tools for low-resource languages.
            </p>
            <p>
              I work in the <a className='lab-link' href="https://glamor.rocks/">Glamor Lab</a> (advised by Prof. Jesse Thomason) where I evaluate
              language models' grounding in sensorimotor perception and the <a className='lab-link' href="https://uscinteractionlab.web.app/">Interaction Lab</a> (advised by Prof. Maja Matarić) studying theory of mind
              in LLMs and strategic human-AI interaction.
            </p>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="research">
        <div className="container">
          <h2 className="section-title">Research</h2>
          <div className="research-list">
            {researchProjects.map((paper, index) => (
              <article key={index} className="research-item">
                <div className="research-year">{paper.year}</div>
                <div className="research-content">
                  <h3 className="research-title">{paper.title}</h3>
                  <p className="research-authors">{formatAuthors(paper.authors)}</p>
                  <p className="research-venue">{paper.venue}</p>
                  <p className="research-description">{paper.description}</p>
                  <div className="research-tags">
                    {paper.tags.map((tag, i) => (
                      <span key={i} className="research-tag">{tag}</span>
                    ))}
                  </div>
                  <div className="research-links">
                    <a href={paper.link} className="research-link" target="_blank" rel="noreferrer">
                      [Paper]
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience" className="experience">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div className="experience-list">
            {workExperience.map((role, index) => (
              <article key={index} className="experience-item">
                <div className="experience-date">{role.date}</div>
                <div className="experience-content">
                  <h3 className="experience-title">{role.role}</h3>
                  <p className="experience-org">{role.org}</p>
                  <p className="experience-description">{role.description}</p>
                  <ul className="experience-highlights">
                    {role.highlights.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills">
        <div className="container">
          <h2 className="section-title">Research Interests & Skills</h2>
          <div className="skills-grid">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="skill-category">
                <h3>{category}</h3>
                <div className="skill-items">
                  {items.map((skill, i) => (
                    <div key={i}>{skill}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="section-title">Software Projects</h2>
          <div className="projects-grid">
            {sweProjects.map((project, index) => (
              <div key={index} className="project-card">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
                {project.link ? (
                  <a href={project.link} className="project-link" target="_blank" rel="noreferrer">
                    View Project →
                  </a>
                ) : (
                  <span className="project-link muted">Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Contact</h2>
          <p className="contact-description">
            I'm always interested in discussing research collaborations and new opportunities.
          </p>
          <div className="contact-links">
            <a href="mailto:abhinavg@usc.edu" className="contact-link">Email</a>
            <span className="contact-link" style={{ color: 'var(--light-gray)', cursor: 'default' }}>•</span>
            <a href="https://github.com/abhinav81003" className="contact-link" target="_blank" rel="noreferrer">GitHub</a>
            <span className="contact-link" style={{ color: 'var(--light-gray)', cursor: 'default' }}>•</span>
            <a href="https://linkedin.com/in/abghinav" className="contact-link" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Abhinav Gupta, Last updated: August 2025</p>
      </footer>
    </div>
  )
}

export default App