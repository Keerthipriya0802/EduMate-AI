import { useEffect, useState } from 'react'
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  CalendarRange,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Target,
  UploadCloud,
  UserCircle2,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const API_URL = 'http://localhost:8000/api'
const USER_ID = 1

const sidebarItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Courses', path: '/courses', icon: GraduationCap },
  { label: 'Study Materials', path: '/materials', icon: BookOpen },
  { label: 'AI Tutor', path: '/tutor', icon: BrainCircuit },
  { label: 'Practice Quizzes', path: '/quizzes', icon: Target },
  { label: 'Learning Path', path: '/learning-path', icon: Sparkles },
  { label: 'Revision Planner', path: '/planner', icon: CalendarRange },
  { label: 'Progress Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
]

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Request failed')
  }

  if (response.status === 204) return null
  return response.json()
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="main-panel">
          <TopBar />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/tutor" element={<TutorPage />} />
              <Route path="/quizzes" element={<QuizPage />} />
              <Route path="/learning-path" element={<LearningPathPage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="sidebar glass-card">
      <div className="brand-row">
        <div className="brand-mark">E</div>
        <div>
          <div className="brand-name">EduMate AI</div>
          <div className="brand-subtitle">Study companion</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sidebarItems.map(({ label, path, icon: Icon }) => (
          <NavLink key={label} to={path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-card">
        <div className="eyebrow">Focus mode</div>
        <div className="card-title">Normalization sprint</div>
        <div className="card-meta">28 min • 4 steps</div>
        <button className="primary-button full-width" onClick={() => navigate('/planner')}>Continue</button>
      </div>
    </aside>
  )
}

function TopBar() {
  return (
    <header className="topbar glass-card">
      <div className="search-box">
        <Search size={18} />
        <input type="text" value="Search resources, topics, and revision tasks" readOnly />
      </div>
      <div className="topbar-actions">
        <button className="icon-button" aria-label="Notifications"><Bell size={18} /></button>
        <div className="profile-pill">
          <UserCircle2 size={28} />
          <div>
            <div className="profile-name">Aarav</div>
            <div className="profile-role">Computer Science</div>
          </div>
        </div>
      </div>
    </header>
  )
}

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    apiFetch(`/dashboard/${USER_ID}`)
      .then(setDashboard)
      .catch((error) => console.error(error))
  }, [])

  if (!dashboard) return <p>Loading dashboard...</p>

  const chartData = dashboard.topicMastery?.map((entry) => ({ name: entry.topic, mastery: entry.value })) || []

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="eyebrow">Student dashboard</div>
          <h1>{dashboard.welcome}</h1>
        </div>
        <button className="primary-button" onClick={() => navigate('/learning-path')}>Continue learning <ArrowRight size={16} /></button>
      </section>

      <section className="stats-grid">
        <StatCard label="Study hours" value={`${dashboard.studyHours}h`} trend="+2.4h this week" accent="violet" />
        <StatCard label="Completed lessons" value={dashboard.completedLessons} trend="8 this week" accent="indigo" />
        <StatCard label="Overall progress" value={`${dashboard.overallProgress}%`} trend="+5% vs last week" accent="emerald" />
        <StatCard label="Daily goal" value={`${dashboard.goalProgress}%`} trend={`${dashboard.dailyGoal} hrs target`} accent="amber" />
      </section>

      <section className="dashboard-grid">
        <div className="glass-card panel-card span-2">
          <div className="panel-header">
            <h3>Topic mastery</h3>
            <span className="chip success">Updated today</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="mastery" fill="#6d5efc" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card panel-card">
          <div className="panel-header">
            <h3>Weak topic focus</h3>
            <span className="chip warning">Needs attention</span>
          </div>
          <ul className="list-stack">
            {dashboard.weakTopics.map((topic) => (
              <li key={topic} className="mini-list-item">
                <div className="dot warning" />
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card panel-card span-2">
          <div className="panel-header">
            <h3>Recently uploaded materials</h3>
            <span className="chip neutral">3 items</span>
          </div>
          <ul className="list-stack compact">
            {dashboard.recentMaterials.map((item) => (
              <li key={item.name} className="material-row">
                <div className="file-badge">PDF</div>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.subject}</p>
                </div>
                <span>{item.updated}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card panel-card">
          <div className="panel-header">
            <h3>Upcoming revision</h3>
            <span className="chip info">Next steps</span>
          </div>
          <ul className="list-stack compact">
            {dashboard.upcomingRevision.map((task) => (
              <li key={task.name} className="mini-list-item spaced">
                <div className="dot info" />
                <div>
                  <strong>{task.name}</strong>
                  <p>{task.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

function CoursesPage() {
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    apiFetch(`/dashboard/${USER_ID}`)
      .then((dashboard) => setCourses(dashboard.currentCourses || []))
      .catch((error) => console.error(error))
  }, [])

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="eyebrow">Your curriculum</div>
          <h1>My courses</h1>
        </div>
        <button className="primary-button" onClick={() => navigate('/materials')}>Add study material <ArrowRight size={16} /></button>
      </section>

      <div className="recommendation-grid">
        {courses.map((course, index) => (
          <div key={course} className="glass-card panel-card recommendation-card">
            <div className="recommendation-header">
              <span className="chip info">Course {index + 1}</span>
              <BookOpen size={20} />
            </div>
            <h3>{course}</h3>
            <p>Build understanding through source-backed notes, practice, and revision tasks.</p>
            <button className="primary-button full-width" onClick={() => navigate('/materials')}>Open materials</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function MaterialsPage() {
  const [materials, setMaterials] = useState([])
  const [file, setFile] = useState(null)
  const [subject, setSubject] = useState('Database Systems')
  const [chapter, setChapter] = useState('Relational Design')
  const [topic, setTopic] = useState('Normalization')
  const [message, setMessage] = useState('')

  useEffect(() => {
    apiFetch(`/materials/${USER_ID}`)
      .then(setMaterials)
      .catch((error) => console.error(error))
  }, [])

  const handleUpload = async (event) => {
    event.preventDefault()
    if (!file) {
      setMessage('Please choose a file first.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('subject', subject)
    formData.append('chapter', chapter)
    formData.append('topic', topic)
    formData.append('user_id', String(USER_ID))

    try {
      const response = await fetch(`${API_URL}/materials/upload`, { method: 'POST', body: formData })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.detail || 'Upload failed')
      }
      setMessage(`Uploaded and processed: ${result.material.name}`)
      const updated = await apiFetch(`/materials/${USER_ID}`)
      setMaterials(updated)
      setFile(null)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="eyebrow">Study library</div>
          <h1>Material uploads and extraction</h1>
        </div>
      </section>

      <div className="two-column-layout">
        <div className="glass-card panel-card">
          <div className="panel-header">
            <h3>Upload resource</h3>
            <span className="chip info">Drag & drop ready</span>
          </div>
          <form className="upload-form" onSubmit={handleUpload}>
            <label className="upload-zone">
              <UploadCloud size={28} />
              <span>{file ? file.name : 'Drop PDF, PPTX, or TXT here'}</span>
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
            <div className="form-grid">
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
              <input value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="Chapter" />
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic" />
            </div>
            <button className="primary-button" type="submit">Process material</button>
          </form>
          {message && <div className="notice-box">{message}</div>}
        </div>

        <div className="glass-card panel-card">
          <div className="panel-header">
            <h3>Recent library</h3>
            <span className="chip neutral">Indexed</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.type.toUpperCase()}</td>
                  <td>{item.subject}</td>
                  <td><span className="chip success">{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TutorPage() {
  const [question, setQuestion] = useState('Explain database normalization with an example.')
  const [level, setLevel] = useState('beginner')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const askTutor = async (customQuestion = question) => {
    try {
      const payload = await apiFetch('/tutor/ask', {
        method: 'POST',
        body: JSON.stringify({ question: customQuestion, level, userId: USER_ID }),
      })
      setResult(payload)
      setError('')
    } catch (fetchError) {
      setError(fetchError.message)
    }
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="eyebrow">AI tutor</div>
          <h1>Source-cited learning support</h1>
        </div>
      </section>

      <div className="two-column-layout">
        <div className="glass-card panel-card">
          <div className="panel-header">
            <h3>Ask a question</h3>
            <span className="chip neutral">Grounded in uploaded materials</span>
          </div>
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={5} />
          <div className="toolbar-row">
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <button className="primary-button" onClick={() => askTutor(question)}>Ask EduMate</button>
          </div>
          {error && <div className="notice-box error">{error}</div>}
        </div>

        <div className="glass-card panel-card">
          <div className="panel-header">
            <h3>Answer</h3>
            <span className="chip success">Citations included</span>
          </div>
          {result ? (
            <>
              <p className="answer-card">{result.answer}</p>
              <div className="action-row">
                <button className="secondary-button" onClick={() => askTutor(`${question} Simplify this.`)}>Simplify this</button>
                <button className="secondary-button" onClick={() => askTutor(`${question} Give an example.`)}>Give an example</button>
                <button className="secondary-button" onClick={() => askTutor(`${question} Test my understanding.`)}>Test my understanding</button>
              </div>

              <div className="citation-box">
                <div className="eyebrow">Citations</div>
                {result.citations?.length ? result.citations.map((citation, index) => (
                  <div key={index} className="citation-item">
                    <strong>{citation.documentName}</strong>
                    <span>Page {citation.page}</span>
                    <p>{citation.snippet}</p>
                  </div>
                )) : <p>No citations available for this answer.</p>}
              </div>

              <div className="followup-box">
                <div className="eyebrow">Suggested follow-ups</div>
                {result.followUps?.map((follow) => (
                  <button key={follow} className="followup-pill" onClick={() => askTutor(follow)}>{follow}</button>
                ))}
              </div>
            </>
          ) : (<p>No answer yet. Ask a question to see the grounded response.</p>)}
        </div>
      </div>
    </div>
  )
}

function QuizPage() {
  const [config, setConfig] = useState({ topic: 'Normalization', difficulty: 'medium', count: 5 })
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const generateQuiz = async () => {
    setIsLoading(true)
    setError('')
    try {
      const payload = await apiFetch('/quizzes/generate', {
        method: 'POST',
        body: JSON.stringify({ ...config, userId: USER_ID }),
      })
      setQuiz(payload.quiz)
      setAnswers({})
      setResult(null)
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const submitQuiz = async () => {
    if (!quiz) return
    setError('')
    try {
      const payload = await apiFetch('/quizzes/submit', {
        method: 'POST',
        body: JSON.stringify({ quizId: quiz.id, userId: USER_ID, responses: answers }),
      })
      setResult(payload)
    } catch (fetchError) {
      setError(fetchError.message)
    }
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="eyebrow">Adaptive assessment</div>
          <h1>Practice quizzes from your study materials</h1>
        </div>
      </section>

      <div className="two-column-layout">
        <div className="glass-card panel-card">
          <div className="panel-header">
            <h3>Quiz settings</h3>
            <span className="chip neutral">AI adaptive</span>
          </div>
          <div className="form-grid stacked">
            <input value={config.topic} onChange={(e) => setConfig({ ...config, topic: e.target.value })} />
            <select value={config.difficulty} onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <input type="number" min="3" max="10" value={config.count} onChange={(e) => setConfig({ ...config, count: Number(e.target.value) || 5 })} />
          </div>
          <button className="primary-button" onClick={generateQuiz} disabled={isLoading}>{isLoading ? 'Generating...' : 'Generate quiz'}</button>
          {error && <div className="notice-box error">{error}</div>}
        </div>

        <div className="glass-card panel-card">
          <div className="panel-header">
            <h3>Question panel</h3>
            <span className="chip info">{quiz ? `${quiz.questions.length} questions` : 'Ready'}</span>
          </div>
          {quiz ? (
            <div className="quiz-stack">
              {quiz.questions.map((question, index) => (
                <div key={`${question.question}-${index}`} className="question-card">
                  <div className="question-label">Question {index + 1}</div>
                  <strong>{question.question}</strong>
                  <div className="choice-list">
                    {question.options.map((option) => (
                      <label key={option} className="choice-option">
                        <input
                          type="radio"
                          name={question.question}
                          value={option}
                          checked={answers[question.question] === option}
                          onChange={() => setAnswers({ ...answers, [question.question]: option })}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button className="primary-button" onClick={submitQuiz}>Submit answers</button>
            </div>
          ) : <p>No quiz generated yet.</p>}
        </div>
      </div>

      {result && (
        <div className="glass-card panel-card result-card">
          <div className="panel-header">
            <h3>Performance summary</h3>
            <span className="chip success">{result.score}% score</span>
          </div>
          <p>You scored {result.correct} out of {result.total}. Topic mastery is updated automatically based on this attempt.</p>
          <div className="feedback-stack">
            {result.details.map((item, index) => (
              <div key={index} className="feedback-item">
                <strong>{item.question}</strong>
                <p>Your answer: {item.yourAnswer || 'No answer selected'} • {item.correct ? 'Correct' : 'Incorrect'}</p>
                <small>{item.explanation}</small>
              </div>
            ))}
          </div>
          {result.misconceptions?.length > 0 && (
            <div className="misconception-box">
              <div className="eyebrow">Misconception detector</div>
              <strong>{result.misconceptions[0].topic}</strong>
              <p>{result.misconceptions[0].likelyMisconception}</p>
              <small>{result.misconceptions[0].example}</small>
              <button className="secondary-button" onClick={() => navigate('/tutor')}>Follow-up: {result.misconceptions[0].followUpQuestion}</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LearningPathPage() {
  const [recommendations, setRecommendations] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    apiFetch(`/recommendations/${USER_ID}`)
      .then(setRecommendations)
      .catch((error) => console.error(error))
  }, [])

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="eyebrow">Learning path</div>
          <h1>Recommendations guided by your performance</h1>
        </div>
      </section>

      <div className="recommendation-grid">
        {recommendations.map((rec) => (
          <div key={rec.id} className="glass-card panel-card recommendation-card">
            <div className="recommendation-header">
              <span className={`chip ${rec.priority === 'high' ? 'warning' : 'info'}`}>{rec.priority}</span>
              <div className="eyebrow">{rec.topic}</div>
            </div>
            <h3>{rec.reason}</h3>
            <div className="meta-line"><Clock3 size={16} /> {rec.duration} min</div>
            <button className="primary-button full-width" onClick={() => navigate(rec.topic === 'Normalization' ? '/tutor' : '/planner')}>{rec.actionLabel}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlannerPage() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('Revise 3NF examples')
  const [topic, setTopic] = useState('Normalization')
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch(`/revision/${USER_ID}`)
      .then(setTasks)
      .catch((error) => console.error(error))
  }, [])

  const addTask = async () => {
    setError('')
    try {
      const payload = await apiFetch('/revision', {
        method: 'POST',
        body: JSON.stringify({ userId: USER_ID, title, topic, dueDate: '2026-10-20', status: 'pending' }),
      })
      setTasks((existing) => [...existing, payload.task])
    } catch (fetchError) {
      setError(fetchError.message)
    }
  }

  const toggleTask = async (taskId, currentStatus) => {
    setError('')
    try {
      const payload = await apiFetch(`/revision/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: currentStatus === 'done' ? 'pending' : 'done' }),
      })
      setTasks((existing) => existing.map((task) => task.id === taskId ? payload.task : task))
    } catch (fetchError) {
      setError(fetchError.message)
    }
  }

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="eyebrow">Revision planner</div>
          <h1>Daily study plan and review scheduling</h1>
        </div>
      </section>

      <div className="two-column-layout">
        <div className="glass-card panel-card">
          <div className="panel-header">
            <h3>Add revision task</h3>
            <span className="chip neutral">Prioritize weak topics</span>
          </div>
          <div className="form-grid stacked">
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <input value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>
          <button className="primary-button" onClick={addTask}>Add task</button>
          {error && <div className="notice-box error">{error}</div>}
        </div>

        <div className="glass-card panel-card">
          <div className="panel-header">
            <h3>Tasks</h3>
            <span className="chip info">{tasks.filter((task) => task.status === 'pending').length} pending</span>
          </div>
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <button className={`check-box ${task.status === 'done' ? 'done' : ''}`} onClick={() => toggleTask(task.id, task.status)}>
                  {task.status === 'done' && <CheckCircle2 size={16} />}
                </button>
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.topic} • {task.dueDate}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    apiFetch(`/analytics/${USER_ID}`)
      .then(setAnalytics)
      .catch((error) => console.error(error))
  }, [])

  if (!analytics) return <p>Loading analytics...</p>

  const pieData = [
    { name: 'Strong', value: analytics.completionRate, color: '#6d5efc' },
    { name: 'Pending', value: 100 - analytics.completionRate, color: '#cbd5e1' },
  ]

  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="eyebrow">Progress analytics</div>
          <h1>Track learning trends and revision progress</h1>
        </div>
      </section>

      <section className="stats-grid analytics-grid">
        <StatCard label="Quiz accuracy" value={`${analytics.completionRate}%`} trend="+14% improvement" accent="violet" />
        <StatCard label="Completed tasks" value={analytics.completedTasks} trend={`${analytics.pendingTasks} pending`} accent="green" />
        <StatCard label="Quiz attempts" value={analytics.quizAttempts} trend="This term" accent="indigo" />
      </section>

      <div className="dashboard-grid">
        <div className="glass-card panel-card span-2">
          <div className="panel-header"><h3>Accuracy over time</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.scoreTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="label" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#6d5efc" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card panel-card">
          <div className="panel-header"><h3>Study time</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={analytics.studyHours}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="hours" stroke="#0f172a" fill="#dbeafe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card panel-card span-2">
          <div className="panel-header"><h3>Topic mastery</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.mastery.values.map((value, index) => ({ name: analytics.mastery.labels[index], value }))}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card panel-card">
          <div className="panel-header"><h3>Completion balance</h3></div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80} paddingAngle={4}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="page-stack">
      <section className="page-header">
        <div>
          <div className="eyebrow">Settings</div>
          <h1>Account and learning preferences</h1>
        </div>
      </section>

      <div className="glass-card panel-card settings-panel">
        <div className="settings-row"><span>Theme</span> <strong>Default violet</strong></div>
        <div className="settings-row"><span>Study language</span> <strong>English</strong></div>
        <div className="settings-row"><span>Notifications</span> <strong>Enabled</strong></div>
        <div className="settings-row"><span>Demo mode</span> <strong>On</strong></div>
      </div>
    </div>
  )
}

function StatCard({ label, value, trend, accent }) {
  const accentMap = {
    violet: '#6d5efc',
    indigo: '#4f46e5',
    emerald: '#10b981',
    amber: '#f59e0b',
    green: '#16a34a',
  }

  return (
    <div className="glass-card stat-card" style={{ borderTop: `4px solid ${accentMap[accent] || '#6d5efc'}` }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-trend">{trend}</div>
    </div>
  )
}

export default App
