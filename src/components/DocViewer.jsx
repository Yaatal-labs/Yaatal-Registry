import React from 'react';
import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
});

function DocViewer({ doc, t }) {
  if (!doc) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-faint)' }}>
        {t ? t.noDocs : 'No documents found'}
      </div>
    );
  }

  const isEn = doc.lang === 'en';
  const formatName = doc.format === 'html' ? 'HTML' : 'Markdown';
  const langName = isEn ? 'English' : 'Français';
  
  const metaText = isEn
    ? `Source: docs/${doc.lang}/${doc.slug}.${doc.format} • Format: ${formatName} • Language: ${langName}`
    : `Source: docs/${doc.lang}/${doc.slug}.${doc.format} • Format: ${formatName} • Langue: ${langName}`;

  let contentHtml = '';
  if (doc.format === 'md') {
    try {
      contentHtml = marked.parse(doc.content || '');
    } catch (e) {
      console.error('Failed to parse Markdown:', e);
      contentHtml = `<p>Error rendering document: ${e.message}</p><pre>${doc.content}</pre>`;
    }
  } else {
    contentHtml = doc.content || '';
  }

  return (
    <div className="doc-viewer-container">
      <div className="doc-header">
        <div className="doc-header-nav">
          <span>{t ? t.docs : 'Documentation'}</span>
          <span>/</span>
          <span style={{ textTransform: 'uppercase' }}>{doc.format}</span>
          <span>/</span>
          <span style={{ color: 'var(--ink)' }}>{doc.slug}</span>
        </div>
        <h1>{doc.title}</h1>
        <div className="doc-meta">
          {metaText}
        </div>
      </div>

      <div 
        className={`doc-body-wrapper ${doc.format === 'md' ? 'markdown-body' : ''}`}
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}

export default DocViewer;
