import React from 'react';
import { Home, Cpu, FileText, Search, X, Play } from 'lucide-react';

function Sidebar({
  docs,
  activeDocSlug,
  onSelectDoc,
  view,
  setView,
  t,
  lang,
  searchQuery,
  setSearchQuery,
  sidebarOpen,
  setSidebarOpen
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 95,
          }}
          className="menu-toggle"
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="logo-icon">Y</div>
            <div>
              <div className="logo-text">{t.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-faint)', fontWeight: 500, lineHeight: 1.2 }}>{t.subtitle}</div>
            </div>
          </div>
          
          <button 
            className="menu-toggle" 
            onClick={() => setSidebarOpen(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--ink)', 
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Text Search */}
        <div style={{ padding: '16px 12px 12px 12px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: '8px',
                border: '1px solid var(--line)',
                background: 'var(--line-soft)',
                color: 'var(--ink)',
                fontSize: '13.5px',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s ease'
              }}
            />
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--ink-faint)'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  color: 'var(--ink-faint)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {/* Main Navigation links */}
          <button
            className={`nav-item ${view === 'landing' ? 'active' : ''}`}
            onClick={() => setView('landing')}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', font: 'inherit' }}
          >
            <Home size={16} />
            <span>{t.landing}</span>
          </button>

          <button
            className={`nav-item ${view === 'workflows' ? 'active' : ''}`}
            onClick={() => setView('workflows')}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', font: 'inherit' }}
          >
            <Cpu size={16} />
            <span>{t.workflows}</span>
          </button>

          <button
            className={`nav-item ${view === 'playground' ? 'active' : ''}`}
            onClick={() => setView('playground')}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', font: 'inherit' }}
          >
            <Play size={16} />
            <span>{t.playground}</span>
          </button>

          {/* Documentation list */}
          <div className="nav-section-title">{t.docs}</div>
          
          {docs.length === 0 ? (
            <div style={{ padding: '8px 12px', fontSize: '13px', color: 'var(--ink-faint)', fontStyle: 'italic' }}>
              {t.noDocs}
            </div>
          ) : (
            docs.map((doc) => (
              <button
                key={doc.slug}
                className={`nav-item ${view === 'docs' && activeDocSlug === doc.slug ? 'active' : ''}`}
                onClick={() => onSelectDoc(doc.slug)}
                style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', font: 'inherit' }}
              >
                <FileText size={16} style={{ flexShrink: 0 }} />
                <span style={{ 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis' 
                }}>
                  {doc.title}
                </span>
              </button>
            ))
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <span style={{ fontSize: '11px', color: 'var(--ink-faint)', fontFamily: 'IBM Plex Mono, monospace' }}>
            {t.metaTitle}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--ink-faint)', fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase' }}>
            {lang}
          </span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
