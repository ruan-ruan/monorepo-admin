import React, { useState } from 'react'
import { ProjectList } from '@monorepo/manager'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'app' | 'package'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="app">
      <header className="app-header">
        <h1>Monorepo 项目管理</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜索项目..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>
      <nav className="app-nav">
        <button
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
        >
          所有项目
        </button>
        <button
          className={activeTab === 'app' ? 'active' : ''}
          onClick={() => setActiveTab('app')}
        >
          应用项目
        </button>
        <button
          className={activeTab === 'package' ? 'active' : ''}
          onClick={() => setActiveTab('package')}
        >
          包项目
        </button>
      </nav>
      <main className="app-main">
        <ProjectList type={activeTab} searchQuery={searchQuery} />
      </main>
      <footer className="app-footer">
        <p>© 2026 Monorepo Admin</p>
      </footer>
    </div>
  )
}

export default App
