import React from 'react';
import { ArrowRight, Cpu, MessageSquare, Mic, Activity, FileText, Zap, Award } from 'lucide-react';

const LANDING_T = {
  en: {
    heroTag: "Single Source of Truth",
    heroTitleHtml: "YAATAL <em>Control Center</em>",
    heroDesc: "One umbrella — the SDK, the AI models, Commerce (BOBO) and Livestream/Translation lanes — removing West African language barriers so anyone can speak in their mother tongue and be understood in everyone else's. The main barrier is access and reach, not creativity, vision or talent.",
    exploreDocs: "Explore Documentation",
    viewWorkflows: "View Workflows & Tools",

    // Features / pillars section
    featuresTitle: "One Umbrella, Two Product Lanes",
    featCaptionTitle: "Commerce Lane (BOBO)",
    featCaptionDesc: "Voice-first market commerce: an on-device model proposes the action, the sovereignty-typed Engine validates and executes. Be heard by the market in your tongue.",
    featDubTitle: "Livestream Lane",
    featDubDesc: "Real-time captions and audio dubbing for live broadcasts, with an auditable moderation seam between understanding and speech. Be understood live by everyone, each in theirs.",
    featEdgeTitle: "Shared Substrate",
    featEdgeDesc: "The Rust Engine, the data factory and native review pipeline, and license-first sovereign model choices — one foundation under both lanes.",

    // Stats section
    statsTitle: "Live Program Metrics",
    statASRLatency: "Market-Intent Dataset",
    statASRLatencyVal: "6,022 rows",
    statMTLatency: "Licensed Wolof Speech",
    statMTLatencyVal: "~115 h",
    statTTSLatency: "Guardrail Acceptance",
    statTTSLatencyVal: "88.3%",
    statQuality: "Edge Model (Q4 GGUF)",
    statQualityVal: "901 MB",

    // Quick links / documents
    quickLinksTitle: "Essential Documentation",
    welcomeDoc: "Welcome — The Umbrella",
    welcomeDocDesc: "The mission, the four pillars, the two product lanes, and the shared substrate they stand on.",
    livestreamDoc: "Livestream Lane Specs",
    livestreamDocDesc: "Deep dive comparison of ASR+MT cascade vs monolithic speech-to-speech architectures."
  },
  fr: {
    heroTag: "Source Unique de Vérité",
    heroTitleHtml: "Centre de Contrôle <em>YAATAL</em>",
    heroDesc: "Une ombrelle — le SDK, les modèles d'IA, les voies Commerce (BOBO) et Livestream/Traduction — pour faire tomber les barrières de langues d'Afrique de l'Ouest : que chacun·e parle dans sa langue maternelle et soit compris·e dans celle de tous les autres. La barrière principale, c'est l'accès et la portée — pas la créativité, la vision ou le talent.",
    exploreDocs: "Explorer la Documentation",
    viewWorkflows: "Voir les Flux & Outils",

    // Features / piliers
    featuresTitle: "Une Ombrelle, Deux Voies Produit",
    featCaptionTitle: "Voie Commerce (BOBO)",
    featCaptionDesc: "Commerce de marché à la voix : un modèle sur l'appareil propose l'action, l'Engine typé-souveraineté valide et exécute. Être entendu·e par le marché dans sa langue.",
    featDubTitle: "Voie Livestream",
    featDubDesc: "Sous-titres et doublage audio en temps réel pour les directs, avec une couture de modération auditable entre compréhension et parole. Être compris·e en direct par tous, chacun dans la sienne.",
    featEdgeTitle: "Socle Commun",
    featEdgeDesc: "L'Engine Rust, la fabrique de données et le pipeline de révision native, et des choix de modèles souverains licence-d'abord — une fondation sous les deux voies.",

    // Stats
    statsTitle: "Métriques du Programme",
    statASRLatency: "Jeu Market-Intent",
    statASRLatencyVal: "6 022 lignes",
    statMTLatency: "Parole Wolof sous Licence",
    statMTLatencyVal: "~115 h",
    statTTSLatency: "Acceptation Garde-fou",
    statTTSLatencyVal: "88,3 %",
    statQuality: "Modèle Edge (GGUF Q4)",
    statQualityVal: "901 Mo",

    // Liens rapides
    quickLinksTitle: "Documentation Essentielle",
    welcomeDoc: "Bienvenue — L'Ombrelle",
    welcomeDocDesc: "La mission, les quatre piliers, les deux voies produit, et le socle commun sur lequel elles reposent.",
    livestreamDoc: "Spécifications Voie Livestream",
    livestreamDocDesc: "Comparatif approfondi entre la cascade ASR+MT et les architectures monolithiques de parole à parole."
  }
};

function LandingPage({ setView, onSelectDoc, t, lang }) {
  const lt = LANDING_T[lang] || LANDING_T.en;

  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="hero">
        <span className="hero-tag">{lt.heroTag}</span>
        <h1 dangerouslySetInnerHTML={{ __html: lt.heroTitleHtml }} />
        <p>{lt.heroDesc}</p>
        <div className="hero-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setView('docs')}
          >
            {lt.exploreDocs} <ArrowRight size={16} />
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => setView('workflows')}
          >
            {lt.viewWorkflows} <Cpu size={16} />
          </button>
        </div>
      </section>

      {/* Pillars Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', fontFamily: 'Fraunces, serif', fontSize: '24px' }}>
          {lt.featuresTitle}
        </h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <MessageSquare size={28} style={{ color: 'var(--cap)' }} />
            </div>
            <h3>{lt.featCaptionTitle}</h3>
            <p>{lt.featCaptionDesc}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Mic size={28} style={{ color: 'var(--dub)' }} />
            </div>
            <h3>{lt.featDubTitle}</h3>
            <p>{lt.featDubDesc}</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Cpu size={28} style={{ color: 'var(--asr)' }} />
            </div>
            <h3>{lt.featEdgeTitle}</h3>
            <p>{lt.featEdgeDesc}</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ marginBottom: '40px', borderTop: '1px solid var(--line)', paddingTop: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', fontFamily: 'Fraunces, serif', fontSize: '24px' }}>
          {lt.statsTitle}
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px'
        }}>
          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 16px' }}>
            <div className="feature-icon" style={{ color: 'var(--asr)', marginBottom: '12px' }}>
              <Activity size={24} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lt.statASRLatency}
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'IBM Plex Mono, monospace', marginTop: '8px' }}>
              {lt.statASRLatencyVal}
            </div>
          </div>

          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 16px' }}>
            <div className="feature-icon" style={{ color: 'var(--cap)', marginBottom: '12px' }}>
              <Zap size={24} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lt.statMTLatency}
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'IBM Plex Mono, monospace', marginTop: '8px' }}>
              {lt.statMTLatencyVal}
            </div>
          </div>

          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 16px' }}>
            <div className="feature-icon" style={{ color: 'var(--gold)', marginBottom: '12px' }}>
              <Zap size={24} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lt.statTTSLatency}
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'IBM Plex Mono, monospace', marginTop: '8px' }}>
              {lt.statTTSLatencyVal}
            </div>
          </div>

          <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 16px' }}>
            <div className="feature-icon" style={{ color: 'var(--dub)', marginBottom: '12px' }}>
              <Award size={24} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lt.statQuality}
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)', fontFamily: 'IBM Plex Mono, monospace', marginTop: '8px' }}>
              {lt.statQualityVal}
            </div>
          </div>
        </div>
      </section>

      {/* Smooth Navigation / Quick Links Section */}
      <section style={{ borderTop: '1px solid var(--line)', paddingTop: '40px', marginTop: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px', fontFamily: 'Fraunces, serif', fontSize: '24px' }}>
          {lt.quickLinksTitle}
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          <div 
            onClick={() => onSelectDoc('welcome')}
            className="feature-card"
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s ease' }}
          >
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Fraunces, serif', fontSize: '18px' }}>
                <FileText size={18} style={{ color: 'var(--cap)' }} />
                {lt.welcomeDoc}
              </h3>
              <p style={{ marginTop: '10px', color: 'var(--ink-soft)', fontSize: '14px' }}>{lt.welcomeDocDesc}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px', fontSize: '12px', fontWeight: 600, color: 'var(--asr)', fontFamily: 'IBM Plex Mono, monospace' }}>
              <span>{lang === 'en' ? 'READ DOCUMENT' : 'LIRE LE DOCUMENT'}</span>
              <ArrowRight size={12} />
            </div>
          </div>

          <div 
            onClick={() => onSelectDoc('yaatal-livestream-lane')}
            className="feature-card"
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s ease' }}
          >
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Fraunces, serif', fontSize: '18px' }}>
                <FileText size={18} style={{ color: 'var(--dub)' }} />
                {lt.livestreamDoc}
              </h3>
              <p style={{ marginTop: '10px', color: 'var(--ink-soft)', fontSize: '14px' }}>{lt.livestreamDocDesc}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px', fontSize: '12px', fontWeight: 600, color: 'var(--asr)', fontFamily: 'IBM Plex Mono, monospace' }}>
              <span>{lang === 'en' ? 'READ DOCUMENT' : 'LIRE LE DOCUMENT'}</span>
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
