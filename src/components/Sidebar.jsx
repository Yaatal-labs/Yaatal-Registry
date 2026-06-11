import React, { useState } from 'react';
import { Home, Cpu, FileText, Search, X, Play, ChevronDown, ChevronRight, Folder } from 'lucide-react';

const CATEGORY_LABELS = {
  en: {
    commerce: "Commerce Lane (BOBO)",
    livestream: "Livestream Lane",
    guides: "Guides & Onboarding"
  },
  fr: {
    commerce: "Voie Commerce (BOBO)",
    livestream: "Voie Livestream",
    guides: "Guides & Intégration"
  }
};

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
  const [collapsed, setCollapsed] = useState({
    commerce: false,
    livestream: false,
    guides: false
  });

  const toggleCollapse = (cat) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const labels = CATEGORY_LABELS[lang] || CATEGORY_LABELS.en;

  // Group documents by category
  const groupedDocs = docs.reduce((acc, doc) => {
    const cat = doc.category || 'guides';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  const categories = ['commerce', 'livestream', 'guides'];

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
            categories.map((cat) => {
              const catDocs = groupedDocs[cat] || [];
              if (catDocs.length === 0 && searchQuery) return null; // Hide empty search categories

              const isCollapsed = collapsed[cat];
              const categoryLabel = labels[cat] || cat;

              return (
                <div key={cat} style={{ marginBottom: '4px' }}>
                  {/* Collapsible Header */}
                  <button
                    onClick={() => toggleCollapse(cat)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      color: 'var(--ink)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      borderRadius: '6px',
                      transition: 'background 0.2s',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--line-soft)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Folder size={14} style={{ color: 'var(--ink-faint)', marginTop: '-1px' }} />
                      <span>{categoryLabel}</span>
                    </div>
                    {isCollapsed ? <ChevronRight size={13} style={{ color: 'var(--ink-faint)' }} /> : <ChevronDown size={13} style={{ color: 'var(--ink-faint)' }} />}
                  </button>

                  {/* Submenu docs */}
                  {!isCollapsed && (
                    <div style={{ paddingLeft: '8px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      {catDocs.map((doc) => (
                        <button
                          key={doc.slug}
                          className={`nav-item ${view === 'docs' && activeDocSlug === doc.slug ? 'active' : ''}`}
                          onClick={() => onSelectDoc(doc.slug)}
                          style={{
                            width: '100%',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            font: 'inherit',
                            padding: '8px 8px 8px 16px',
                            fontSize: '13px',
                            marginBottom: '1px'
                          }}
                        >
                          <FileText size={14} style={{ flexShrink: 0, marginRight: '8px', color: 'var(--ink-faint)' }} />
                          <span style={{ 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis' 
                          }}>
                            {doc.title}
                          </span>
                        </button>
                      ))}
                      {catDocs.length === 0 && (
                        <div style={{ padding: '6px 8px 6px 24px', fontSize: '12px', color: 'var(--ink-faint)', fontStyle: 'italic' }}>
                          Empty
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
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
