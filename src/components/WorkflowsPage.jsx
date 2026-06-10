import React, { useState } from 'react';
// Dynamic workflows passed from props
import { 
  Cpu, 
  Table, 
  Server, 
  Database, 
  Layers, 
  RefreshCw, 
  ExternalLink, 
  Zap, 
  Activity, 
  Award 
} from 'lucide-react';

const WORKFLOWS_T = {
  en: {
    title: "Workflows & Tools Registry",
    desc: "Manage external services, code workspaces, and compute pipelines. Configure latency targets for real-time edge translation.",
    
    // Calculator
    calcTitle: "Interactive Latency Budget Calculator",
    calcDesc: "Simulate and optimize the latency of different edge translation architectures. Real-time translation requires a tight budget to remain conversational or broadcast-ready.",
    presetsLabel: "Architectural Presets:",
    presetNemotron: "Nemotron Cascade (Edge/Fast)",
    presetStandard: "Standard Broadcast Cascade",
    presetMonolithic: "Monolithic S2ST (Hibiki)",
    
    sliderASR: "ASR Leg Latency",
    sliderASRSub: "Speech-to-Text translation",
    sliderMT: "MT Leg Latency",
    sliderMTSub: "Machine Translation leg",
    sliderTTS: "TTS Leg Latency",
    sliderTTSSub: "Text-to-Speech synthesis",
    sliderMonolithic: "Monolithic S2ST Latency",
    sliderMonolithicSub: "Direct audio-to-audio model",
    
    monolithicNote: "ASR, MT, and TTS legs are bundled in a single monolithic model (Hibiki S2ST), eliminating cascading serialization delays.",
    
    legendASR: "ASR (Speech-to-Text)",
    legendMT: "MT (Machine Translation)",
    legendTTS: "TTS (Text-to-Speech)",
    legendMonolithic: "Monolithic S2ST (Audio-to-Audio)",
    
    totalLatency: "Total Pipeline Latency",
    statusExcellent: "Conversational / Excellent",
    statusFair: "Broadcast-Ready / Fair",
    statusPoor: "Noticeable Lag / Poor",
    
    // Tools registry
    toolsTitle: "External Services & Development Hubs",
    toolsDesc: "Access the notebooks, database tables, and compute nodes driving the YAATAL translation ecosystem.",
    openTool: "OPEN TOOL"
  },
  fr: {
    title: "Registre des Flux & Outils",
    desc: "Gérez les services externes, les espaces de développement et les pipelines de calcul. Configurez les cibles de latence pour la traduction à l'edge.",
    
    // Calculator
    calcTitle: "Calculateur Interactif de Latence",
    calcDesc: "Simulez et optimisez la latence des différentes architectures de traduction. La traduction en temps réel nécessite un budget serré pour rester fluide ou prête à la diffusion.",
    presetsLabel: "Préréglages d'Architecture :",
    presetNemotron: "Cascade Nemotron (Edge/Rapide)",
    presetStandard: "Cascade standard de diffusion",
    presetMonolithic: "S2ST Monolithique (Hibiki)",
    
    sliderASR: "Latence de l'étape ASR",
    sliderASRSub: "Transcription parole vers texte",
    sliderMT: "Latence de l'étape MT",
    sliderMTSub: "Traduction automatique de texte",
    sliderTTS: "Latence de l'étape TTS",
    sliderTTSSub: "Synthèse vocale texte vers parole",
    sliderMonolithic: "Latence S2ST Monolithique",
    sliderMonolithicSub: "Modèle direct audio vers audio",
    
    monolithicNote: "Les étapes ASR, MT et TTS sont regroupées dans un modèle monolithique unique (Hibiki S2ST), éliminant les délais de sérialisation en cascade.",
    
    legendASR: "ASR (Parole-vers-Texte)",
    legendMT: "MT (Traduction de Texte)",
    legendTTS: "TTS (Texte-vers-Parole)",
    legendMonolithic: "S2ST Monolithique (Audio-vers-Audio)",
    
    totalLatency: "Latence Totale du Pipeline",
    statusExcellent: "Conversationnel / Excellent",
    statusFair: "Prêt pour la Diffusion / Moyen",
    statusPoor: "Décalage Sensible / Faible",
    
    // Tools registry
    toolsTitle: "Services Externes & Plateformes de Calcul",
    toolsDesc: "Accédez aux calepins de calcul, tables de correspondance et pipelines orchestrant l'écosystème YAATAL.",
    openTool: "OUVRIR L'OUTIL"
  }
};

function WorkflowsPage({ workflows, t: globalT, lang }) {
  const lt = WORKFLOWS_T[lang] || WORKFLOWS_T.en;

  const [mode, setMode] = useState('cascade'); // 'cascade' | 'monolithic'
  const [asr, setAsr] = useState(320);
  const [mt, setMt] = useState(150);
  const [tts, setTts] = useState(200);
  const [monolithicLatency, setMonolithicLatency] = useState(120);

  const totalLatency = mode === 'cascade' ? (asr + mt + tts) : monolithicLatency;

  let statusClass = 'good';
  let statusText = lt.statusExcellent;

  if (totalLatency < 350) {
    statusClass = 'good';
    statusText = lt.statusExcellent;
  } else if (totalLatency <= 700) {
    statusClass = 'warning';
    statusText = lt.statusFair;
  } else {
    statusClass = 'poor';
    statusText = lt.statusPoor;
  }

  // Group workflowsData by category based on language
  const groupedWorkflows = workflows.reduce((acc, tool) => {
    const catName = tool.category[lang] || tool.category.en;
    if (!acc[catName]) {
      acc[catName] = [];
    }
    acc[catName].push(tool);
    return acc;
  }, {});

  return (
    <div className="workflows-page-container">
      {/* Top Header */}
      <div className="workflows-header" style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>
          {lt.title}
        </h1>
        <p style={{ color: 'var(--ink-soft)' }}>
          {lt.desc}
        </p>
      </div>

      {/* Latency Budget Calculator */}
      <section className="latency-panel">
        <h2>{lt.calcTitle}</h2>
        <p className="latency-panel-desc">
          {lt.calcDesc}
        </p>

        {/* Architectural Presets */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '28px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)' }}>
            {lt.presetsLabel}
          </span>
          <button 
            className={`btn btn-secondary ${mode === 'cascade' && asr === 80 && mt === 50 && tts === 100 ? 'btn-primary' : ''}`}
            onClick={() => {
              setMode('cascade');
              setAsr(80);
              setMt(50);
              setTts(100);
            }}
            style={{ padding: '6px 12px', fontSize: '12.5px', font: 'inherit' }}
          >
            {lt.presetNemotron}
          </button>
          <button 
            className={`btn btn-secondary ${mode === 'cascade' && asr === 320 && mt === 150 && tts === 200 ? 'btn-primary' : ''}`}
            onClick={() => {
              setMode('cascade');
              setAsr(320);
              setMt(150);
              setTts(200);
            }}
            style={{ padding: '6px 12px', fontSize: '12.5px', font: 'inherit' }}
          >
            {lt.presetStandard}
          </button>
          <button 
            className={`btn btn-secondary ${mode === 'monolithic' && monolithicLatency === 120 ? 'btn-primary' : ''}`}
            onClick={() => {
              setMode('monolithic');
              setMonolithicLatency(120);
            }}
            style={{ padding: '6px 12px', fontSize: '12.5px', font: 'inherit' }}
          >
            {lt.presetMonolithic}
          </button>
        </div>

        {/* Interactive Sliders */}
        <div className="slider-container">
          {mode === 'cascade' ? (
            <>
              {/* ASR */}
              <div className="slider-group">
                <div className="slider-label">
                  <span>{lt.sliderASR}</span>
                  <span>{lt.sliderASRSub}</span>
                </div>
                <input 
                  type="range" 
                  min="80" 
                  max="1200" 
                  step="10"
                  value={asr} 
                  onChange={(e) => setAsr(Number(e.target.value))}
                  className="slider-input"
                />
                <div className="slider-value">{asr}ms</div>
              </div>

              {/* MT */}
              <div className="slider-group">
                <div className="slider-label">
                  <span>{lt.sliderMT}</span>
                  <span>{lt.sliderMTSub}</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="500" 
                  step="5"
                  value={mt} 
                  onChange={(e) => setMt(Number(e.target.value))}
                  className="slider-input"
                />
                <div className="slider-value">{mt}ms</div>
              </div>

              {/* TTS */}
              <div className="slider-group">
                <div className="slider-label">
                  <span>{lt.sliderTTS}</span>
                  <span>{lt.sliderTTSSub}</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  step="10"
                  value={tts} 
                  onChange={(e) => setTts(Number(e.target.value))}
                  className="slider-input"
                />
                <div className="slider-value">{tts}ms</div>
              </div>
            </>
          ) : (
            <>
              {/* Monolithic */}
              <div className="slider-group">
                <div className="slider-label">
                  <span>{lt.sliderMonolithic}</span>
                  <span>{lt.sliderMonolithicSub}</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="500" 
                  step="10"
                  value={monolithicLatency} 
                  onChange={(e) => setMonolithicLatency(Number(e.target.value))}
                  className="slider-input"
                />
                <div className="slider-value">{monolithicLatency}ms</div>
              </div>
              <p style={{ 
                fontSize: '13.5px', 
                color: 'var(--ink-soft)', 
                fontStyle: 'italic', 
                background: 'var(--line-soft)', 
                padding: '14px 16px', 
                borderRadius: '8px', 
                border: '1px solid var(--line)',
                lineHeight: 1.5
              }}>
                {lt.monolithicNote}
              </p>
            </>
          )}
        </div>

        {/* Visual Bar Graph */}
        <div className="latency-budget-bar" style={{ marginBottom: '24px' }}>
          {mode === 'cascade' ? (
            <>
              <div className="budget-segment asr" style={{ width: `${(asr / totalLatency) * 100}%` }}>
                {asr}ms
              </div>
              <div className="budget-segment mt" style={{ width: `${(mt / totalLatency) * 100}%` }}>
                {mt}ms
              </div>
              <div className="budget-segment tts" style={{ width: `${(tts / totalLatency) * 100}%` }}>
                {tts}ms
              </div>
            </>
          ) : (
            <div className="budget-segment" style={{ width: '100%', background: 'var(--dub)' }}>
              {monolithicLatency}ms
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="budget-legend">
          {mode === 'cascade' ? (
            <>
              <div className="legend-item">
                <div className="legend-dot asr" />
                <span>{lt.legendASR}</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot mt" />
                <span>{lt.legendMT}</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot tts" />
                <span>{lt.legendTTS}</span>
              </div>
            </>
          ) : (
            <div className="legend-item">
              <div className="legend-dot" style={{ background: 'var(--dub)' }} />
              <span>{lt.legendMonolithic}</span>
            </div>
          )}
        </div>

        {/* Latency Summary & Quality Rating */}
        <div className="latency-summary">
          <div className="latency-summary-label">
            <div>{lt.totalLatency}</div>
            <div style={{ 
              fontSize: '12px', 
              textTransform: 'none', 
              color: 'var(--ink-soft)', 
              marginTop: '4px',
              fontWeight: 500
            }}>
              {statusText}
            </div>
          </div>
          <div className={`latency-summary-value ${statusClass}`}>
            {totalLatency}ms
          </div>
        </div>
      </section>

      {/* External Tools Registry */}
      <section style={{ borderTop: '1px solid var(--line)', paddingTop: '40px', marginTop: '40px' }}>
        <div className="workflows-header" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>
            {lt.toolsTitle}
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '14.5px' }}>
            {lt.toolsDesc}
          </p>
        </div>

        {Object.entries(groupedWorkflows).map(([categoryName, tools]) => (
          <div key={categoryName} style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              textTransform: 'uppercase',
              color: 'var(--ink-faint)',
              letterSpacing: '0.12em',
              marginBottom: '16px',
              borderBottom: '1px solid var(--line-soft)',
              paddingBottom: '8px',
              fontWeight: 600
            }}>
              {categoryName}
            </h3>

            <div className="workflows-grid">
              {tools.map((tool) => {
                let IconComponent = Cpu;
                if (tool.service === 'sheets') IconComponent = Table;
                else if (tool.service === 'colab') IconComponent = Cpu;
                else if (tool.service === 'modal') IconComponent = Server;
                else if (tool.service === 'huggingface') IconComponent = Layers;
                else if (tool.service === 'supabase') IconComponent = Database;
                else if (tool.service === 'airflow') IconComponent = RefreshCw;

                return (
                  <a 
                    key={tool.id} 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`workflow-card ${tool.service}`}
                  >
                    <div className="wf-header">
                      <span className="wf-cat">{tool.category[lang] || tool.category.en}</span>
                      <div className="wf-icon-wrap">
                        <IconComponent size={18} />
                      </div>
                    </div>
                    <h3>{tool.name[lang] || tool.name.en}</h3>
                    <p>{tool.description[lang] || tool.description.en}</p>
                    <div className="wf-link">
                      <span>{lt.openTool}</span>
                      <ExternalLink size={12} />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default WorkflowsPage;
