import React from 'react';
import { ArrowRight, Cpu, MessageSquare, Mic, Activity, FileText, Zap, Award } from 'lucide-react';

const LANDING_T = {
  en: {
    heroTag: "Single Source of Truth",
    heroTitleHtml: "YAATAL <em>Livestream Control Center</em>",
    heroDesc: "The central repository for YAATAL real-time translation architecture, workflows, and edge latency optimization budgets.",
    exploreDocs: "Explore Documentation",
    viewWorkflows: "View Workflows & Tools",
    
    // Features / pillars section
    featuresTitle: "Core Architectural Pillars",
    featCaptionTitle: "Caption / Subtitle Lane",
    featCaptionDesc: "Low-latency streaming ASR cascade combined with neural machine translation to display subtitles on the broadcast stream.",
    featDubTitle: "Dub / Audio Lane",
    featDubDesc: "Synthesized edge-TTS voices tailored for low-literacy broadcast audiences, de-risking high-latency cascade vs monolithic models.",
    featEdgeTitle: "Edge Processing",
    featEdgeDesc: "Direct on-device CPU execution using local dictionary databases and ONNX WebAssembly-based translation models.",

    // Stats section
    statsTitle: "System Metrics & Live Status",
    statASRLatency: "ASR Target Latency",
    statASRLatencyVal: "80 - 320ms",
    statMTLatency: "MT Target Latency",
    statMTLatencyVal: "150ms",
    statTTSLatency: "TTS Target Latency",
    statTTSLatencyVal: "200ms",
    statQuality: "Translation Quality",
    statQualityVal: "94.2% BLEU",

    // Quick links / documents
    quickLinksTitle: "Essential Documentation",
    welcomeDoc: "Welcome Guide",
    welcomeDocDesc: "General overview of the YAATAL control center and platform features.",
    livestreamDoc: "Livestream Lane Specs",
    livestreamDocDesc: "Deep dive comparison of ASR+MT cascade vs monolithic Hibiki speech-to-speech architectures."
  },
  fr: {
    heroTag: "Source Unique de Vérité",
    heroTitleHtml: "Centre de Contrôle <em>Livestream YAATAL</em>",
    heroDesc: "Le répertoire central pour l'architecture de traduction en temps réel YAATAL, ses flux de travail et ses budgets d'optimisation de latence edge.",
    exploreDocs: "Explorer la Documentation",
    viewWorkflows: "Voir les Flux & Outils",

    // Features / piliers
    featuresTitle: "Piliers Architecturaux Clés",
    featCaptionTitle: "Voie Sous-titrage / Captions",
    featCaptionDesc: "Cascade ASR en continu à faible latence combinée avec une traduction automatique neuronale pour afficher des sous-titres sur le flux.",
    featDubTitle: "Voie Doublage / Audio",
    featDubDesc: "Voix TTS synthétisées à l'edge pour les audiences à faible alphabétisation, évaluant le compromis cascade vs modèles monolithiques.",
    featEdgeTitle: "Traitement à l'Edge",
    featEdgeDesc: "Exécution directe sur le processeur de l'appareil à l'aide de dictionnaires locaux et de modèles de traduction ONNX via WebAssembly.",

    // Stats
    statsTitle: "Métriques du Système & État",
    statASRLatency: "Latence Cible ASR",
    statASRLatencyVal: "80 - 320ms",
    statMTLatency: "Latence Cible MT",
    statMTLatencyVal: "150ms",
    statTTSLatency: "Latence Cible TTS",
    statTTSLatencyVal: "200ms",
    statQuality: "Qualité de Traduction",
    statQualityVal: "94.2% BLEU",

    // Liens rapides
    quickLinksTitle: "Documentation Essentielle",
    welcomeDoc: "Guide de Bienvenue",
    welcomeDocDesc: "Vue d'ensemble générale du centre de contrôle YAATAL et des fonctionnalités de la plateforme.",
    livestreamDoc: "Spécifications Voie Livestream",
    livestreamDocDesc: "Comparatif approfondi entre la cascade ASR+MT et les architectures monolithiques Hibiki de parole à parole."
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
