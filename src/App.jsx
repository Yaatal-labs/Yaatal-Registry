import React, { useState, useEffect } from 'react';
import defaultDocsData from './data/docs.json';
import defaultWorkflowsData from './data/workflows.json';
import Sidebar from './components/Sidebar';
import DocViewer from './components/DocViewer';
import LandingPage from './components/LandingPage';
import WorkflowsPage from './components/WorkflowsPage';
import Playground from './components/Playground';
import VoiceLab from './components/VoiceLab';
import { supabase, hasSupabaseConfig } from './supabase';
import { Menu, Moon, Sun, Globe, ArrowLeft } from 'lucide-react';

const TRANSLATIONS = {
  en: {
    title: "YAATAL Portal",
    subtitle: "Livestream Control Center",
    searchPlaceholder: "Search documents...",
    workflows: "Workflows & Tools",
    docs: "Documentation",
    landing: "Home",
    playground: "Model Playground",
    voicelab: "Voice Lab (Wolof)",
    themeLight: "Light Paper",
    themeDark: "Sleek Charcoal",
    menu: "Menu",
    noDocs: "No documents found",
    backToHome: "Back to Home",
    toggleLang: "FR",
    metaTitle: "Single Source of Truth"
  },
  fr: {
    title: "Portail YAATAL",
    subtitle: "Centre de Contrôle Livestream",
    searchPlaceholder: "Rechercher...",
    workflows: "Flux & Outils",
    docs: "Documentation",
    landing: "Accueil",
    playground: "Playground Modèle",
    voicelab: "Voice Lab (Wolof)",
    themeLight: "Papier Classique",
    themeDark: "Charbon Élégant",
    menu: "Menu",
    noDocs: "Aucun document trouvé",
    backToHome: "Retour à l'accueil",
    toggleLang: "EN",
    metaTitle: "Source Unique de Vérité"
  }
};

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'docs' | 'workflows' | 'playground'
  const [activeDocSlug, setActiveDocSlug] = useState('welcome');
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic state databases with offline defaults
  const [docsData, setDocsData] = useState(defaultDocsData);
  const [workflowsData, setWorkflowsData] = useState(defaultWorkflowsData);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // Hash deep links: #/doc/<slug>, #/workflows, #/playground, #/ (landing).
  // Markdown links inside docs (e.g. [text](#/doc/commerce-overview)) navigate via hashchange.
  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash.replace(/^#\/?/, '');
      if (h.startsWith('doc/')) {
        setActiveDocSlug(decodeURIComponent(h.slice(4)));
        setView('docs');
      } else if (h === 'workflows' || h === 'playground' || h === 'voicelab') {
        setView(h);
      } else if (h === '') {
        setView('landing');
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  // Keep the URL shareable as the user navigates (replaceState: no history spam, no hashchange loop).
  useEffect(() => {
    const target = view === 'docs' ? `#/doc/${activeDocSlug}` : view === 'landing' ? '#/' : `#/${view}`;
    if (window.location.hash !== target) {
      window.history.replaceState(null, '', target);
    }
  }, [view, activeDocSlug]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch dynamic content from Supabase in Live mode
  useEffect(() => {
    if (hasSupabaseConfig && supabase) {
      console.log("Supabase config detected. Initializing live sync...");
      
      // Fetch dynamic documents
      supabase
        .from('documents')
        .select('*')
        .then(({ data, error }) => {
          if (error) {
            console.error("Failed to fetch documents from Supabase:", error);
          } else if (data && data.length > 0) {
            console.log(`Fetched ${data.length} documents from Supabase.`);
            setDocsData(data);
          }
        });

      // Fetch dynamic workflows
      supabase
        .from('workflows')
        .select('*')
        .then(({ data, error }) => {
          if (error) {
            console.error("Failed to fetch workflows from Supabase:", error);
          } else if (data && data.length > 0) {
            console.log(`Fetched ${data.length} workflows from Supabase.`);
            setWorkflowsData(data);
          }
        });
    } else {
      console.log("No Supabase configuration. Running in Offline Fallback Mode.");
    }
  }, []);

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'fr' : 'en'));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectDoc = (slug) => {
    setActiveDocSlug(slug);
    setView('docs');
    setSidebarOpen(false);
  };

  const t = TRANSLATIONS[lang];

  // Filter documents by language and search query
  const filteredDocs = docsData.filter(doc => {
    if (doc.lang !== lang) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return doc.title.toLowerCase().includes(q) || doc.content.toLowerCase().includes(q);
  });

  // Get currently active document
  const activeDoc = docsData.find(doc => doc.slug === activeDocSlug && doc.lang === lang) || 
                    docsData.find(doc => doc.slug === 'welcome' && doc.lang === lang) ||
                    filteredDocs[0];

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        docs={filteredDocs}
        activeDocSlug={activeDocSlug}
        onSelectDoc={handleSelectDoc}
        view={view}
        setView={(v) => { setView(v); setSidebarOpen(false); }}
        t={t}
        lang={lang}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Header Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            {view !== 'landing' && (
              <button className="btn btn-secondary" onClick={() => setView('landing')} style={{ padding: '6px 12px', fontSize: '12.5px' }}>
                <ArrowLeft size={14} /> {t.backToHome}
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Language Selector */}
            <div className="lang-selector">
              <button 
                className={`lang-opt ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button 
                className={`lang-opt ${lang === 'fr' ? 'active' : ''}`}
                onClick={() => setLang('fr')}
              >
                FR
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button className="theme-btn" onClick={toggleTheme} title={theme === 'light' ? t.themeDark : t.themeLight}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        {/* Content Render Switch */}
        <main className="content-area">
          <div className="content-container">
            {view === 'landing' && (
              <LandingPage 
                setView={setView} 
                onSelectDoc={handleSelectDoc} 
                t={t} 
                lang={lang}
              />
            )}
            {view === 'docs' && (
              <DocViewer 
                doc={activeDoc} 
                t={t}
              />
            )}
            {view === 'workflows' && (
              <WorkflowsPage 
                workflows={workflowsData}
                t={t} 
                lang={lang}
              />
            )}
            {view === 'playground' && (
              <Playground
                lang={lang}
                supabase={supabase}
                hasSupabase={hasSupabaseConfig}
              />
            )}
            {view === 'voicelab' && (
              <VoiceLab lang={lang} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
