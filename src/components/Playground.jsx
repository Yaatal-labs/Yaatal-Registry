import React, { useState } from 'react';
import { Play, Save, CheckCircle, AlertCircle, Key, Cpu } from 'lucide-react';

const PLAYGROUND_T = {
  en: {
    title: "Model Playground & Feedback Loop",
    desc: "Test Wolof-to-French translation models in real-time. Suggest corrections to train future fine-tuned checkpoints.",
    inputLabel: "Wolof Input",
    inputPlaceholder: "Enter Wolof phrase (e.g. 'Nanga def?')...",
    translateBtn: "Translate",
    translatingBtn: "Processing...",
    hfTokenLabel: "Hugging Face API Token:",
    hfTokenPlaceholder: "Enter hf_token to test...",
    hfTokenHelp: "Enter your Hugging Face API key to enable live inference.",
    outputLabel: "French Translation Output",
    outputPlaceholder: "Translation will appear here...",
    suggestLabel: "Suggest Correction",
    suggestHelp: "Edit the translation to submit a corrected pair to n8n.",
    submitCorrection: "Submit Correction",
    correctionSubmitted: "Correction Submitted!",
    offlineWarning: "Offline Mode: Suggestion logged to console. Set up Supabase to trigger n8n.",
    readyWarning: "Saved to Supabase! The n8n pipeline is triggered.",
    errorTranslation: "Failed to translate. Ensure your HF token is valid and the model is loaded."
  },
  fr: {
    title: "Playground du Modèle & Feedback",
    desc: "Testez les modèles de traduction Wolof-Français en temps réel. Suggérez des corrections pour entraîner les prochains checkpoints.",
    inputLabel: "Entrée Wolof",
    inputPlaceholder: "Entrez une phrase en Wolof (ex: 'Nanga def?')...",
    translateBtn: "Traduire",
    translatingBtn: "Calcul...",
    hfTokenLabel: "Jeton API Hugging Face :",
    hfTokenPlaceholder: "Entrez hf_token...",
    hfTokenHelp: "Entrez votre clé API Hugging Face pour activer l'inférence en direct.",
    outputLabel: "Sortie Française",
    outputPlaceholder: "La traduction apparaîtra ici...",
    suggestLabel: "Suggérer une correction",
    suggestHelp: "Modifiez la traduction pour envoyer la correction à n8n.",
    submitCorrection: "Envoyer la correction",
    correctionSubmitted: "Correction envoyée !",
    offlineWarning: "Mode Hors-ligne : Suggestion loggée en console. Activez Supabase pour n8n.",
    readyWarning: "Enregistré dans Supabase ! Le pipeline n8n est activé.",
    errorTranslation: "Échec de la traduction. Vérifiez votre jeton HF et que le modèle est chargé."
  }
};

function Playground({ lang, supabase, hasSupabase }) {
  const t = PLAYGROUND_T[lang] || PLAYGROUND_T.en;

  const [wolofText, setWolofText] = useState('');
  const [frenchTranslation, setFrenchTranslation] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [hfToken, setHfToken] = useState(() => import.meta.env.VITE_HF_API_KEY || '');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTranslate = async () => {
    if (!wolofText.trim()) return;
    setLoading(false);
    setErrorMsg('');
    setFrenchTranslation('');
    setSubmitted(false);
    setLoading(true);

    try {
      // Query the Wolof-NMT translator model on Hugging Face
      // Using NLLB-200-distilled-600M as default reference or user-specified model
      const modelEndpoint = "https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600m";
      
      const response = await fetch(modelEndpoint, {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: wolofText,
          parameters: {
            src_lang: "wol_Latn", // Wolof NLLB language tag
            tgt_lang: "fra_Latn", // French NLLB language tag
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Inference returned status ${response.status}`);
      }

      const result = await response.json();
      
      let translated = '';
      if (Array.isArray(result) && result[0] && result[0].translation_text) {
        translated = result[0].translation_text;
      } else if (result && result.generated_text) {
        translated = result.generated_text;
      } else {
        // Fallback demo matching if HF api is loading/warming up
        translated = `[NLLB-600M Output] French translation of: "${wolofText}"`;
      }

      setFrenchTranslation(translated);
      setSuggestion(translated);
    } catch (e) {
      console.error(e);
      setErrorMsg(t.errorTranslation);
      // Fallback mock rendering for offline UI testing
      setFrenchTranslation(`[Offline Mock] Traduction de: "${wolofText}"`);
      setSuggestion(`[Offline Mock] Traduction de: "${wolofText}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleCorrectionSubmit = async () => {
    if (!suggestion.trim()) return;

    try {
      if (hasSupabase && supabase) {
        const { error } = await supabase.from('translation_corrections').insert([
          {
            source_wolof: wolofText,
            model_output: frenchTranslation,
            correction: suggestion,
            created_at: new Date().toISOString()
          }
        ]);
        if (error) throw error;
      } else {
        // Log to console in offline mode
        console.log("Supabase Mock Correction Log:", {
          source_wolof: wolofText,
          model_output: frenchTranslation,
          correction: suggestion
        });
      }
      setSubmitted(true);
    } catch (err) {
      console.error("Error logging correction:", err);
      alert("Error logging correction, printing to console instead.");
      console.log("Correction Data:", { wolofText, frenchTranslation, suggestion });
      setSubmitted(true);
    }
  };

  return (
    <div className="latency-panel" style={{ padding: '30px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 900, marginBottom: '6px' }}>
          {t.title}
        </h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: '14px' }}>
          {t.desc}
        </p>
      </div>

      {/* Hugging Face Token Configuration */}
      <div style={{
        background: 'var(--line-soft)',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid var(--line)',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Key size={14} /> {t.hfTokenLabel}
        </label>
        <input 
          type="password"
          placeholder={t.hfTokenPlaceholder}
          value={hfToken}
          onChange={(e) => setHfToken(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--line)',
            background: 'var(--card)',
            color: 'var(--ink)',
            fontSize: '13.5px',
            fontFamily: 'monospace'
          }}
        />
        <span style={{ fontSize: '11px', color: 'var(--ink-faint)' }}>{t.hfTokenHelp}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        {/* Wolof Input */}
        <div>
          <label style={{ fontSize: '13.5px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            {t.inputLabel}
          </label>
          <textarea
            value={wolofText}
            onChange={(e) => setWolofText(e.target.value)}
            placeholder={t.inputPlaceholder}
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              background: 'var(--card)',
              color: 'var(--ink)',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </div>

        <div>
          <button 
            onClick={handleTranslate} 
            className="btn btn-primary" 
            disabled={loading}
            style={{ fontFamily: 'inherit' }}
          >
            {loading ? t.translatingBtn : t.translateBtn} <Cpu size={14} style={{ marginLeft: '4px' }} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            background: 'var(--warn-bg)',
            color: 'var(--warn)',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Translation Output */}
        {frenchTranslation && (
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '20px', marginTop: '10px' }}>
            <label style={{ fontSize: '13.5px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              {t.outputLabel}
            </label>
            <div style={{
              background: 'var(--line-soft)',
              padding: '14px 16px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              fontSize: '14.5px',
              color: 'var(--ink)',
              marginBottom: '20px',
              minHeight: '40px'
            }}>
              {frenchTranslation}
            </div>

            {/* Suggestions loop */}
            <div style={{
              background: 'var(--card)',
              border: '1px dashed var(--line)',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <label style={{ fontSize: '13.5px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                {t.suggestLabel}
              </label>
              <span style={{ fontSize: '11.5px', color: 'var(--ink-faint)', display: 'block', marginBottom: '12px' }}>
                {t.suggestHelp}
              </span>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  fontSize: '13.5px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                  marginBottom: '14px'
                }}
              />
              
              <button 
                onClick={handleCorrectionSubmit} 
                className={`btn ${submitted ? 'btn-secondary' : 'btn-primary'}`}
                disabled={submitted}
              >
                {submitted ? (
                  <>
                    {t.correctionSubmitted} <CheckCircle size={14} />
                  </>
                ) : (
                  <>
                    {t.submitCorrection} <Save size={14} />
                  </>
                )}
              </button>

              {submitted && (
                <div style={{
                  marginTop: '12px',
                  fontSize: '12px',
                  color: hasSupabase ? 'var(--cap)' : 'var(--gold)',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle size={14} />
                  <span>{hasSupabase ? t.readyWarning : t.offlineWarning}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Playground;
