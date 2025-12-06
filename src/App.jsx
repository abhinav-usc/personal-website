import { useState, useEffect, useRef } from 'react'
import { Mail, Github, Linkedin, FileText, Book, Briefcase, Code, Award, ExternalLink, FlaskConical, Users, Lightbulb, Laptop, MessageCircle, GithubIcon } from 'lucide-react'
import './App.css'

// Custom hook for scroll animations
function usePageLoadAnimation() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return isLoaded
}

// Component for displaying project images
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

function App() {
  const cvLink = '/Abhinav_Gupta_CV.pdf'
  const [selectedTag, setSelectedTag] = useState(null)
  const [expandedPapers, setExpandedPapers] = useState({})
  const isPageLoaded = usePageLoadAnimation()

  const togglePaper = (index) => {
    setExpandedPapers(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const interests = [
    { name: "Guitar", icon: "🎸", description: "Playing and learning new songs" },
    { name: "Cooking", icon: "🍳", description: "Experimenting with new recipes" },
    { name: "Reading", icon: "📚", description: "Fiction and non-fiction" },
  ]

  const researchProjects = [
    {
      title: "How do phonesthemes evoke sensorimotor experience?",
      authors: ["Abhinav Gupta", "Jesse Thomason", "Toben H. Mintz"],
      venue: "ACL 2026 (Pending Submission)",
      year: "2026",
      status: "pending-submission",
      featured: true,
      description: "Investigating whether computational word embeddings capture human-like sensorimotor associations and developing models to project contextual embeddings to sensorimotor experiences.",
      fullDescription: "Phonesthemes are sound-meaning correspondences where certain sounds evoke specific meanings or feelings (like 'gl-' suggesting light/vision in words like glitter, gleam, glow). This research investigates whether these sub-lexical patterns trigger sensorimotor experiences similar to full words. Through computational modeling and human behavioral studies, we explore how these sound patterns are grounded in embodied perception.",
      myRole: "I led the human study design where participants rated pseudo-words for 11 different sensory and motor associations. I developed the computational pipeline to analyze correlation patterns between phonestheme structure and sensorimotor ratings, and built models to predict sensorimotor associations from sub-lexical features.",
      impact: "Understanding phonestheme grounding could reveal fundamental principles about how language connects to embodied experience at the sub-lexical level, informing both cognitive theories of language and practical applications in natural language generation.",
      tags: ["NLP", "Grounded Language", "Psycholinguistics"],
      link: "#",
      code: "https://github.com/abhinav-usc/SENSE-model",
      hasImage: true,
      hasDemo: false,
      images: [
        {
          src: "/proj_imgs/survey_analysis.png",
          alt: "Phonestheme survey analysis workflow showing stimulus presentation, human judgment, sub-lexical component splitting, and probability computation",
          caption: "Figure 1: Phonestheme survey analysis workflow - from pseudoword presentation to computing sensorimotor association probabilities by sub-lexical components"
        },
        {
          src: "/proj_imgs/aud_corr.png",
          alt: "Scatter plot comparing model ratings versus human select rates for the Auditory modality",
          caption: "Figure 2: Model vs Human select rate correlation for Auditory modality - comparing predicted sensorimotor associations with human judgments"
        },
        {
          src: "/proj_imgs/correlation_matrix.png",
          alt: "Correlation matrix heatmap showing relationships between different sensorimotor modalities",
          caption: "Figure 3: Cross-modality correlation matrix showing relationships between Gustatory, Olfactory, Auditory, Haptic, Interoceptive, Visual, Mouth, Foot_leg, Hand_arm, Head, and Torso dimensions"
        },
        {
          src: "/proj_imgs/box_plots.png",
          alt: "Box plots showing participant-level correlation distributions across all sensorimotor modalities",
          caption: "Figure 4: Participant-level correlation of selections vs model ratings across all sensorimotor modalities"
        }
      ]
    },
    {
      title: "Can LLMs Infer Human Actions and Motives in Strategic Decision Making?",
      authors: ["Kaleen Shrestha", "Harish Dukkipati", "Abhinav Gupta", "Zhonghao Shi", "Maja Mataric"],
      venue: "In Progress",
      year: "2025",
      status: "in-progress",
      featured: false,
      description: "Investigating whether large language models can understand and predict human strategic decision-making processes through controlled game-theoretic experiments.",
      fullDescription: "This work examines how well large language models encode human social reasoning and theory of mind in strategic contexts. Using economic games like the Prisoner's Dilemma and other multi-agent scenarios, we investigate whether LLMs can predict human mental models, anticipate cooperative vs. competitive behaviors, and understand the strategic reasoning underlying human decisions in social contexts.",
      myRole: "As part of a team of 4, I'm designing experimental protocols for game-theoretic scenarios, implementing LLM evaluation frameworks to test theory of mind capabilities, and analyzing behavioral patterns to compare LLM predictions against actual human decision-making data from strategic games.",
      impact: "Understanding how LLMs encode social reasoning is critical for developing AI systems that can effectively collaborate with humans, predict human needs and intentions, and align with human values in multi-agent settings.",
      tags: ["LLMs", "Game Theory", "Theory of Mind"],
      link: "/Can_Large_Language_Models_Infer_Human_Actions_and_Motives_in_Strategic_Decision_Making_.pdf",
      code: "",
      hasImage: true,
      hasDemo: false,
      images: [
        {
          src: "/proj_imgs/social_pred_game.png",
          alt: "Social Prediction Game",
          caption: "Figure 1: Definition of SPG (left) and the game space (right). The payoff matrices resulting from the different values of Sand T lead to four distinct games."
        },
        {
          src: "/proj_imgs/greedy_riskaverse.png",
          alt: "Greedy vs Risk-Averse Agent Behavior",
          caption: "Figure 2: Definitions of player motives based on actions for the four economic games in SPG. Blue cells denote COOPERATE, and red cells denote DEFECT. These are the human (above) and artificial motive definitions (below)."
        },
        {
          src: "/proj_imgs/human_v_llm.png",
          alt: "Inspection game  architecture",
          caption: "Figure 3: Definition of IG. The LLM is participating in the game as the Employer, choosing to INSPECT or NOT INSPECT the Employee (the player from the SPG played before the IG)."
        },
        {
          src: "/proj_imgs/llm_performance.png",
          alt: "LLM performance comparison",
          caption: "Figure 4: LLM Models Comparison for predicting Social Prediction Game actions."
        },
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
      hasImage: true,
      hasDemo: true,
      images: [
        {
          src: "/proj_imgs/sample_sensorimotor.png",
          alt: "Sample sensorimotor associations for a word like pizza",
          caption: "Figure 1: Sample sensorimotor associations for a word like pizza"
        },
        {
          src: "/proj_imgs/model_performance.png",
          alt: "Projection models performance comparison",
          caption: "Figure 2: Projection Models performance comparison"
        },
      ]
    },
    {
      title: "Indigenous Language Translation with Sparse Data",
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
      hasImage: true,
      hasDemo: false,
      images: [
        {
          src: "/proj_imgs/map.png",
          alt: "Archaeological regions of Colombia showing the Muisca civilization",
          caption: "Figure 1: Archaeological regions of Colombia © Trustees of the British Museum"
        },
        {
          src: "/proj_imgs/example.png",
          alt: "Muisca's influence on Colombian Spanish",
          caption: "Figure 2: Muisca's influence on Colombian Spanish [1]"
        },
        {
          src: "/proj_imgs/corpus.png",
          alt: "Example Muisca and Spanish phrases from the parallel corpus",
          caption: "Figure 3: Muisca and Spanish phrases from our corpus [1]"
        },
        {
          src: "/proj_imgs/modelling.png",
          alt: "Model architecture for translation system",
          caption: "Figure 4: Translation model architecture using mBERT and XLM-R"
        }
      ]
    }
  ]

  const featuredResearch = researchProjects.filter(p => p.featured)

  const researchExperience = [
    {
      role: "Undergraduate Researcher",
      org: "Interaction Lab, USC",
      date: "Dec 2024 – Present",
      icon: "🤖",
      advisor: "Professor Maja Matarić",
      description: "Working in a team of 4 to investigate how large language models encode human social reasoning. Currently investigating LLMs' ability to predict human mental models in social decision-making using economic games like the Prisoner's Dilemma, and conducting experiments on LLM behavior in strategic social contexts to analyze alignment and generalization."
    },
    {
      role: "Researcher",
      org: "Language Development Lab, USC",
      date: "Dec 2023 – Present",
      icon: "🧠",
      advisor: "Professor Toben H. Mintz",
      description: "Leading a human study examining how individuals associate pseudo words with 11 different sensory and motor experiences. Processed and visualized experimental data and performed correlation analysis using R and Python to understand sensorimotor grounding at the sub-lexical level."
    },
    {
      role: "Researcher",
      org: "GLAMOR Lab, USC",
      date: "Aug 2023 – Present",
      icon: "🔬",
      advisor: "Professor Jesse Thomason",
      description: "Investigating whether computational word embeddings capture human-like sensorimotor associations. Developed a model to project contextual word embeddings to sensorimotor association spaces and created a pipeline for automated phonestheme detection. Paper accepted to SoCal NLP 2024, with submission pending to ARR rolling review."
    },
    {
      role: "Undergraduate Researcher",
      org: "CAIS++, USC",
      date: "Sep 2022 – Dec 2023",
      icon: "🌍",
      advisor: "Professor Jonathan May and Professor Robin Jia",
      description: "Collaborated with Muysc Cubun Research Group from Universidad Nacional de Colombia to develop an NLP-based system for Chibcha language translation. As part of a team of 6, collected over 30,000 parallel entries from internet sources, old scriptures, and books using custom web scraping tools. Paper accepted to SoCal NLP 2023."
    },
    {
      role: "Research Assistant",
      org: "Signal Analysis and Interpretation Lab, USC",
      date: "Aug 2021 – Jan 2022",
      icon: "📊",
      advisor: "Professor Shrikanth Narayanan",
      description: "Analyzed emotional perception in over 20 video clips using deep learning models and developed bias mitigation algorithms to correct for demographic-related distortions in emotion recognition systems."
    }
  ]

  const workExperience = [
    {
      role: "Math Peer Mentor",
      org: "USC Viterbi MESA University",
      date: "Aug 2025 – Present",
      icon: "📚",
      description: "Mentoring freshmen in introductory calculus courses, providing study techniques and helping with homework problems. Spreading awareness about the program through social media and email outreach, classroom visits, and coordinating with science clubs."
    },
    {
      role: "Course Producer & Peer Mentor",
      org: "USC Viterbi School of Engineering",
      date: "Jan 2022 – Dec 2024",
      icon: "👨‍🏫",
      description: "Tutored classes including CSCI 270 (Algorithm Design), CSCI 170 (Discrete Mathematics), and CSCI 102 (Intro to C++). Entrusted with grading tests and assignments, helping over 300 students with difficult topics, hosting discussion sections, and contributing to test curation."
    },
    {
      role: "Software Dev Engineering Intern",
      org: "Amazon Inc.",
      date: "May 2023 – Aug 2023",
      icon: "💼",
      description: "Designed and implemented an internal tool using Java, Python and AWS to automate podcast content management. Engineered automation solutions that eliminated 10 hours of weekly manual tasks and improved content curation. Developed technical documentation and presented project outcomes to cross-functional teams of 6 developers and 2 designers."
    }
  ]

  const leadershipExperience = [
    {
      role: "Software Developer and Volunteer",
      org: "Code the Change",
      date: "Sep 2022 – Jul 2024",
      icon: "💻",
      description: "Built software for non-profit organizations, focusing on improving accessibility and community engagement.",
      highlights: [
        "Applied computational tools to address social challenges such as developing community platform for victims of assault"
      ]
    },
    {
      role: "Curriculum Lead and Project Member",
      org: "USC Center for Artificial Intelligence in Society",
      date: "Sep 2021 – Jan 2024",
      icon: "🎓",
      description: "Led curriculum development on applying AI and ML for social good.",
      highlights: [
        "Led a team of 7 students in developing and teaching a curriculum on applying Artificial Intelligence and Machine Learning for social good",
        "Advised an NLP project that was later presented to the club, providing technical mentorship and feedback",
        "Collaborated on three projects exploring diverse applications of AI for social impact"
      ]
    },
    {
      role: "Computer Science Tutor",
      org: "Viterbi Impact Program, USC",
      date: "Sep 2021 – Jan 2022",
      icon: "👨‍💻",
      description: "Taught computer science fundamentals to middle school students and teachers.",
      highlights: []
    }
  ]

  const education = {
    school: "University of Southern California",
    degrees: ["B.S. Computer Science", "B.S. Cognitive Science"],
    specialization: "Specialization in AI Applications",
    graduation: "May 2026",
    gpa: {
      cs: "3.73",
      cogsci: "3.82",
      cumulative: "3.56"
    },
    coursework: [
      "Natural Language Processing",
      "Artificial Intelligence",
      "Language and the Brain",
      "Language Technologies",
      "Cognitive Science",
      "Psychology",
      "Cognitive Processes",
      "Algorithms",
      "Theory of Computation",
      "Data Structures",
      "Probability & Statistics",
      "Discrete Mathematics"
    ]
  }

  const honors = [
    {
      title: "USC Dornsife Continuing Student Scholarship",
      date: "Aug 2025 – Present"
    },
    {
      title: "USC Center for Undergraduate Research Fellowship",
      date: "May 2025 – Aug 2025"
    },
    {
      title: "USC Cognitive Science Honors with Distinction in Research",
      date: "Fall 2024 – Present"
    },
    {
      title: "USC Provost Fellowship",
      date: "May 2024 – Aug 2024"
    },
    {
      title: "Undergraduate Research Associates Program Scholar",
      date: "Aug 2023 – May 2024"
    },
    {
      title: "Dornsife College Dean's List",
      date: "Aug 2022 – Present"
    },
    {
      title: "Viterbi School of Engineering Dean's List",
      date: "Aug 2021 – Present"
    }
  ]

  const skills = {
    "Research Interests": {
      icon: "🎓",
      items: [
        "Natural Language Processing",
        "Embodied AI & Grounded Language",
        "Human-AI Interaction",
        "Multimodal Learning",
        "Low-Resource NLP"
      ]
    },
    "Technical Skills": {
      icon: "💻",
      items: [
        "Python, Java, JavaScript, C++",
        "PyTorch, TensorFlow, Hugging Face",
        "React, Node.js, Android SDK",
        "Git, Linux, Cloud Computing"
      ]
    }
  }

  const sweProjects = [
    {
      title: "Grad School Applications Assistant",
      description: "AI-powered web app to streamline graduate school applications by generating tailored personal statements, editing their materials, getting faculty recommendations, and getting detailed review and feedback on their applications",
      tech: ["React", "Node.js", "AI Integration"],
      link: "https://github.com/abhinav-usc/grad-app-assistant"
    },
    {
      title: "CampusMate",
      description: "Off-campus housing marketplace connecting college students with rental opportunities and roommates",
      tech: ["React", "AWS", "Full-Stack"],
      link: "https://main.d23lvw40p53qlv.amplifyapp.com/"
    },
    {
      title: "Brandshake",
      description: "Platform connecting brands with influencers to discover, create, and manage marketing campaigns in one place",
      tech: ["iOS/Android", "Mobile Development"],
      link: "https://apps.apple.com/us/app/brandshake/id1613614806"
    },
    {
      title: "Ethos",
      description: "Wellness companion app for mindful alcohol consumption tracking with personalized insights and community support",
      tech: ["Mobile Development", "Backend"],
      link: "https://apps.apple.com/by/app/ethos-mindful-consumption/id1622702389"
    },
    {
      title: "Personal Portfolio Website",
      description: "Code for this personal portfolio website showcasing my research, projects, and experience",
      tech: ["React", "Frontend Development"],
      link: "https://github.com/abhinav-usc/personal-website"
    },
  ]

  // Get all unique tags
  const allTags = [...new Set(researchProjects.flatMap(p => p.tags))]

  // Filter projects based on selected tag
  const filteredProjects = selectedTag
    ? researchProjects.filter(p => p.tags.includes(selectedTag))
    : researchProjects

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
    <div className={`portfolio ${isPageLoaded ? 'loaded' : ''}`}>
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <a href="/" className="logo">
            <img className="logo" src="/logo.png" alt="AG" />
          </a>
          <div className="nav-links">
            <a href="#research">🔬 Research</a>
            <a href="#experience"><Briefcase size={16} /> Experience</a>
            <a href="#projects"><Code size={16} /> Projects</a>
            <a href="#contact"><Mail size={16} /> Contact</a>
            <a href={cvLink} target="_blank" rel="noreferrer"><FileText size={16} /> CV</a>
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
                <a href="mailto:abhinavg@usc.edu" className="hero-link">
                  <Mail size={16} /> abhinavg@usc.edu
                </a>
                <a href="tel:+12132800780" className="hero-link">
                  📞 (213) 280-0780
                </a>
                <a href="https://github.com/abhinav-usc" className="hero-link" target="_blank" rel="noreferrer">
                  <Github size={16} /> GitHub
                </a>
                <a href="https://linkedin.com/in/abghinav" className="hero-link" target="_blank" rel="noreferrer">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a href={cvLink} className="hero-link" target="_blank" rel="noreferrer">
                  <FileText size={16} /> CV
                </a>
              </div>
            </div>
          </div>
          <div className="hero-bio">
            <p>
              I'm an undergraduate researcher at University of Southern California. I work on the development, analysis and applications of language models rooted in human cognition and understanding. My research interests include Natural Language Processing, AI for Understanding Human Thought, Cognitive Science, and Human-Computer Interaction.
            </p>
            <p>
              I'm advised by <a className='lab-link' href="https://jessethomason.com/">Jesse Thomason</a>, <a className='lab-link' href="https://dornsife.usc.edu/tobenmintz/">Toben H. Mintz</a>, and <a className='lab-link' href="https://maja-mataric.web.app/">Maja Matarić</a>.
            </p>
            <p>
              My work has been supported by the USC Center for Undergraduate Research Fellowship, USC Provost Fellowship, and Undergraduate Research Associates Program.
            </p>
            <p className="currently-exploring">
              <strong>Currently exploring:</strong> How phonesthemes evoke sensorimotor experiences through human behavioral studies and computational modeling
            </p>
          </div>
        </div>
      </section>

      {/* Featured Research Section */}
      <section className="featured-research">
        <div className="container">
          <h2 className="section-title"><Award size={22} /> Featured Research</h2>
          <div className="featured-grid">
            {featuredResearch.map((paper, index) => (
              <div key={index} className="featured-card">
                <div className="featured-content">
                  <div className="featured-header">
                    <h3 className="featured-title">{paper.title}</h3>
                    <span className={`status-badge ${paper.status}`}>
                      {paper.status === 'pending-submission' ? '📝 Pending Submission' : 
                       paper.status === 'in-progress' ? '🔬 In Progress' :
                       '🔄 Under Review'}
                    </span>
                  </div>
                  <p className="featured-authors">{formatAuthors(paper.authors)}</p>
                  <p className="featured-venue">{paper.venue}</p>
                  
                  <div className="featured-description">
                    <p><strong>Overview:</strong> {paper.fullDescription}</p>
                    <p><strong>My Role:</strong> {paper.myRole}</p>
                    <p><strong>Impact:</strong> {paper.impact}</p>
                  </div>

                  {paper.images && paper.images.length > 0 && (
                    <ProjectImages images={paper.images} />
                  )}

                  {paper.hasImage && (!paper.images || paper.images.length === 0) && (
                    <div className="featured-image-placeholder">
                      <span>📊 Visualization coming soon</span>
                    </div>
                  )}

                  <div className="featured-tags">
                    {paper.tags.map((tag, i) => (
                      <span key={i} className="research-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="featured-links">
                    {paper.link !== '#' && (
                      <a href={paper.link} className="research-link" target="_blank" rel="noreferrer">
                        <ExternalLink size={14} /> View Paper
                      </a>
                    )}
                    {paper.code !== '' && (
                      <a href={paper.code} className="research-link" target="_blank" rel="noreferrer">
                        <Github size={16} /> Github
                      </a>
                    )}
                    {paper.hasDemo && (
                      <span className="demo-coming-soon">🔧 Interactive demo in development</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="research">
        <div className="container">
          <h2 className="section-title"><Book size={22} /> Research Publications</h2>
          
          {/* Tag Filter */}
          <div className="tag-filter">
            <button 
              className={`filter-tag ${selectedTag === null ? 'active' : ''}`}
              onClick={() => setSelectedTag(null)}
            >
              All
            </button>
            {allTags.map((tag, i) => (
              <button
                key={i}
                className={`filter-tag ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="research-list">
            {filteredProjects.map((paper, index) => (
              <article key={index} className="research-item">
                <div className="research-year">{paper.year}</div>
                <div className="research-content">
                  <div 
                    className="research-header clickable" 
                    onClick={() => togglePaper(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3 className="research-title">
                      {paper.title}
                      <span className="expand-icon">{expandedPapers[index] ? '−' : '+'}</span>
                    </h3>
                    <span className={`status-badge ${paper.status}`}>
                      {paper.status === 'pending-submission' ? '📝 Pending Submission' : 
                       paper.status === 'in-progress' ? '🔬 In Progress' :
                       paper.status === 'under-review' ? '🔄 Under Review' : 
                       `✓ Presented ${paper.presentedDate}`}
                    </span>
                  </div>
                  <p className="research-authors">{formatAuthors(paper.authors)}</p>
                  <p className="research-venue">{paper.venue}</p>
                  <p className="research-description">{paper.description}</p>
                  
                  {expandedPapers[index] && (
                    <div className="research-expanded">
                      <div className="expanded-section">
                        <h4>Full Description</h4>
                        <p>{paper.fullDescription}</p>
                      </div>
                      
                      <div className="expanded-section">
                        <h4>My Contribution</h4>
                        <p>{paper.myRole}</p>
                      </div>
                      
                      <div className="expanded-section">
                        <h4>Impact</h4>
                        <p>{paper.impact}</p>
                      </div>

                      {paper.images && paper.images.length > 0 && (
                        <div className="expanded-section">
                          <h4>Visualizations</h4>
                          <ProjectImages images={paper.images} />
                        </div>
                      )}

                      {paper.hasImage && (!paper.images || paper.images.length === 0) && (
                        <div className="expanded-image-placeholder">
                          <span>📊 Visualization space reserved</span>
                        </div>
                      )}

                      {paper.hasDemo && (
                        <div className="demo-note">
                          🔧 Interactive demo in development
                        </div>
                      )}
                    </div>
                  )}

                  <div className="research-tags">
                    {paper.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className={`research-tag ${selectedTag === tag ? 'highlighted' : ''}`}
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="research-links">
                    {paper.link !== '#' && (
                      <a href={paper.link} className="research-link" target="_blank" rel="noreferrer">
                        <ExternalLink size={14} /> Paper
                      </a>
                    )}
                    {paper.code !== '' && (
                      <a href={paper.code} className="research-link" target="_blank" rel="noreferrer">
                        <Github size={16} /> Github
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Research Experience Section */}
      <section className="research-experience">
        <div className="container">
          <h2 className="section-title"><FlaskConical size={22} /> Research Experience</h2>
          <div className="experience-list">
            {researchExperience.map((role, index) => (
              <article key={index} className="experience-item">
                <div className="experience-date">{role.date}</div>
                <div className="experience-content">
                  <h3 className="experience-title">
                    <span className="experience-icon">{role.icon}</span>
                    {role.role}
                  </h3>
                  <p className="experience-org">{role.org}</p>
                  {role.advisor && <p className="experience-advisor">Advised by {role.advisor}</p>}
                  <p className="experience-description">{role.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience" className="experience">
        <div className="container">
          <h2 className="section-title"><Briefcase size={22} /> Teaching & Industry</h2>
          <div className="experience-list">
            {workExperience.map((role, index) => (
              <article key={index} className="experience-item">
                <div className="experience-date">{role.date}</div>
                <div className="experience-content">
                  <h3 className="experience-title">
                    <span className="experience-icon">{role.icon}</span>
                    {role.role}
                  </h3>
                  <p className="experience-org">{role.org}</p>
                  <p className="experience-description">{role.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills">
        <div className="container">
          <h2 className="section-title"><Lightbulb size={22} /> Research Interests & Skills</h2>
          <div className="skills-grid">
            {Object.entries(skills).map(([category, data]) => (
              <div key={category} className="skill-category">
                <h3>
                  <span className="skill-icon">{data.icon}</span>
                  {category}
                </h3>
                <div className="skill-items">
                  {data.items.map((skill, i) => (
                    <div key={i} className="skill-item">{skill}</div>
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
          <h2 className="section-title"><Laptop size={22} /> Software Projects</h2>
          <div className="projects-grid">
            {sweProjects.map((project, index) => (
              <a 
                key={index} 
                href={project.link} 
                className="project-card-link" 
                target="_blank" 
                rel="noreferrer"
              >
                <div className="project-card">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  <span className="project-link">
                    View Project <ExternalLink size={14} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="interests">
        <div className="container">
          <h2 className="section-title"><Users size={22} /> Beyond Research</h2>
          <p className="interests-intro">When I'm not in the lab, you'll find me:</p>
          <div className="interests-grid">
            {interests.map((interest, index) => (
              <div key={index} className="interest-card">
                <span className="interest-icon">{interest.icon}</span>
                <h3 className="interest-name">{interest.name}</h3>
                <p className="interest-description">{interest.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title"><MessageCircle size={22} /> Contact</h2>
          <p className="contact-description">
            I'm always interested in discussing research collaborations and new opportunities.
          </p>
          <div className="contact-links">
            <a href="mailto:abhinavg@usc.edu" className="contact-link">
              <Mail size={18} />
              <span>Email</span>
            </a>
            <a href="tel:+12132800780" className="contact-link">
              📞
              <span>Phone</span>
            </a>
            <a href="https://github.com/abhinav81003" className="contact-link" target="_blank" rel="noreferrer">
              <Github size={18} />
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com/in/abghinav" className="contact-link" target="_blank" rel="noreferrer">
              <Linkedin size={18} />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Abhinav Gupta, Last updated: November 2025</p>
      </footer>
    </div>
  )
}

export default App