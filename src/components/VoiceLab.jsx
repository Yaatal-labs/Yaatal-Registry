import React from 'react';
import { Mic, Cpu, Volume2, ShieldCheck, FlaskConical } from 'lucide-react';
import lab from '../data/voicelab.json';

const STR = {
  en: {
    title: 'BOBO Voice Lab',
    tagline: 'A full-duplex Wolof voice assistant that fits on a commodity phone.',
    intro: 'Three swappable Apache-2.0 components — ears, brain, mouth — composed SALM-style. No cloud required at inference; sovereignty is enforced at the text seam.',
    ears: 'Ears', brain: 'Brain', mouth: 'Mouth',
    earsDesc: 'Wolof speech → text', brainDesc: 'text → intent JSON', mouthDesc: 'Wolof reply → audio',
    stateQualified: 'qualified', stateTraining: 'training now', statePlanned: 'planned',
    clipsTitle: 'Hear it speak Wolof',
    clipsEmpty: 'First Wolof checkpoint is training on Modal right now — sample clips land here when the bake finishes.',
    turnTitle: 'One duplex turn, end to end',
    turnUser: 'Market vendor says', turnIntent: 'The 350M brain routes', turnReply: 'BOBO answers (spoken by the mouth model)',
    brainProof: 'Brain qualification (v2 held-out, 2026-06-12): intent accuracy 99.3% · slot-F1 0.846 · 100% valid JSON',
    honesty: 'Lab status: this is a research demo of the cascade composition (ASR → router → TTS). Training data includes synthetic Wolof pending native-speaker review. Not a product yet — a proof that the sovereign edge stack works.',
    vision: '“The main barrier is Access and Reach, not Creativity, Vision or Talent.”'
  },
  fr: {
    title: 'BOBO Voice Lab',
    tagline: 'Un assistant vocal wolof full-duplex qui tient sur un téléphone ordinaire.',
    intro: 'Trois composants Apache-2.0 interchangeables — oreilles, cerveau, bouche — composés façon SALM. Aucun cloud requis à l\'inférence ; la souveraineté est garantie à la couture texte.',
    ears: 'Oreilles', brain: 'Cerveau', mouth: 'Bouche',
    earsDesc: 'parole wolof → texte', brainDesc: 'texte → intention JSON', mouthDesc: 'réponse wolof → audio',
    stateQualified: 'qualifié', stateTraining: 'en entraînement', statePlanned: 'planifié',
    clipsTitle: 'Écoutez-le parler wolof',
    clipsEmpty: 'Le premier checkpoint wolof s\'entraîne sur Modal en ce moment — les extraits audio arriveront ici dès la fin du bake.',
    turnTitle: 'Un tour duplex, de bout en bout',
    turnUser: 'La vendeuse dit', turnIntent: 'Le cerveau 350M route', turnReply: 'BOBO répond (voix du modèle bouche)',
    brainProof: 'Qualification du cerveau (held-out v2, 12-06-2026) : précision d\'intention 99,3 % · slot-F1 0,846 · 100 % JSON valide',
    honesty: 'Statut labo : démo de recherche de la composition en cascade (ASR → routeur → TTS). Les données incluent du wolof synthétique en attente de relecture par des locuteurs natifs. Pas encore un produit — la preuve que la pile edge souveraine fonctionne.',
    vision: '« La barrière principale, c\'est l\'Accès et la Portée, pas la Créativité, la Vision ou le Talent. »'
  }
};

const STAGE_ICONS = { ears: Mic, brain: Cpu, mouth: Volume2 };

function VoiceLab({ lang }) {
  const s = STR[lang] || STR.en;
  const stateLabel = { qualified: s.stateQualified, training: s.stateTraining, planned: s.statePlanned };
  const stateColor = { qualified: '#16a34a', training: '#d97706', planned: 'var(--ink-faint)' };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <FlaskConical size={26} />
        <h1 style={{ margin: 0 }}>{s.title}</h1>
      </div>
      <p style={{ fontSize: 17, fontWeight: 600, marginTop: 8 }}>{s.tagline}</p>
      <p style={{ color: 'var(--ink-faint)' }}>{s.intro}</p>

      {/* Pipeline: ears -> brain -> mouth */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '24px 0' }}>
        {lab.stack.map((st) => {
          const Icon = STAGE_ICONS[st.id];
          return (
            <div key={st.id} style={{
              flex: '1 1 220px', border: '1px solid var(--border, #ddd)', borderRadius: 12,
              padding: '16px 18px', background: 'var(--surface, transparent)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                <Icon size={18} /> {s[st.id]}
                <span style={{
                  marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: stateColor[st.state],
                  border: `1px solid ${stateColor[st.state]}`, borderRadius: 999, padding: '1px 8px'
                }}>{stateLabel[st.state]}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', margin: '6px 0' }}>{s[`${st.id}Desc`]}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{st.model}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 4 }}>
                {st.params} · {st.size} · {st.license}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-faint)' }}>
        <ShieldCheck size={15} /> {s.brainProof}
      </div>

      {/* Audio clips (populated post-training from voicelab.json) */}
      <h2 style={{ marginTop: 36 }}>{s.clipsTitle}</h2>
      {lab.clips.length === 0 ? (
        <div style={{
          border: '1px dashed var(--border, #ccc)', borderRadius: 12, padding: '22px 20px',
          color: 'var(--ink-faint)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 10
        }}>
          <Volume2 size={18} /> {s.clipsEmpty}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {lab.clips.map((c) => (
            <div key={c.src} style={{ border: '1px solid var(--border, #ddd)', borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 14, marginBottom: 8 }}>« {c.text} »</div>
              <audio controls preload="none" src={`${import.meta.env.BASE_URL}voicelab/${c.src}`} style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      )}

      {/* One duplex turn walkthrough */}
      <h2 style={{ marginTop: 36 }}>{s.turnTitle}</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-faint)' }}>{s.turnUser}</div>
          <div style={{ fontSize: 15, marginTop: 4 }}>« {lab.sampleTurn.user} »</div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-faint)' }}>{s.turnIntent}</div>
          <pre style={{ fontSize: 12.5, borderRadius: 10, padding: 14, overflowX: 'auto', marginTop: 6 }}>
            {JSON.stringify(lab.sampleTurn.intent, null, 2)}
          </pre>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-faint)' }}>{s.turnReply}</div>
          <div style={{ fontSize: 15, marginTop: 4 }}>« {lab.sampleTurn.reply_wo} »</div>
        </div>
      </div>

      <p style={{ marginTop: 32, fontSize: 13, color: 'var(--ink-faint)', borderLeft: '3px solid var(--border, #ccc)', paddingLeft: 12 }}>
        {s.honesty}
      </p>
      <p style={{ fontSize: 14, fontStyle: 'italic', marginTop: 18 }}>{s.vision}</p>
    </div>
  );
}

export default VoiceLab;
