import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { exportProtocol } from '../services/api';

export default function ProtocolPanel({ 
  agenda, 
  onAgendaChange, 
  transcription, 
  isGeneratingProtocol, 
  onGenerateProtocol, 
  protocol 
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [viewMode, setViewMode] = useState('markdown');

  const handleExport = async (format) => {
    if (!protocol) return;
    setIsExporting(true);
    try {
      const data = await exportProtocol(protocol, format);
      
      const content = format === 'md' 
        ? data.content 
        : new Uint8Array(data.content.split('').map(c => c.charCodeAt(0)));
      
      const blob = format === 'md'
        ? new Blob([content], { type: 'text/markdown' })
        : new Blob([content], { type: data.content_type });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert('Ошибка при экспорте');
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="side-panel">
      <h2>Генерация протокола</h2>
      
      <div className="agenda-section">
        <label htmlFor="agenda">Повестка дня (необязательно):</label>
        <textarea
          id="agenda"
          value={agenda}
          onChange={(e) => onAgendaChange(e.target.value)}
          placeholder="Введите темы для обсуждения..."
          rows={4}
        />
      </div>

      <button 
        onClick={onGenerateProtocol} 
        disabled={!transcription || isGeneratingProtocol}
        className="btn-secondary"
      >
        {isGeneratingProtocol ? 'Генерирую протокол (Рик работает)...' : 'Сгенерировать протокол'}
      </button>

      {protocol && (
        <div className="protocol-section">
          <div className="protocol-header">
            <h3>Протокол (Rick Sanchez Mode)</h3>
            <div className="view-toggle">
              <button 
                onClick={() => setViewMode('markdown')}
                className={viewMode === 'markdown' ? 'active' : ''}
              >
                Markdown
              </button>
              <button 
                onClick={() => setViewMode('raw')}
                className={viewMode === 'raw' ? 'active' : ''}
              >
                Raw
              </button>
            </div>
          </div>
          <div className="protocol-box">
            {viewMode === 'markdown' ? (
              <ReactMarkdown>{protocol}</ReactMarkdown>
            ) : (
              <pre>{protocol}</pre>
            )}
          </div>
          <div className="protocol-actions">
            <button 
              onClick={() => {
                if (navigator.clipboard && window.isSecureContext) {
                  navigator.clipboard.writeText(protocol);
                } else {
                  const textArea = document.createElement("textarea");
                  textArea.value = protocol;
                  document.body.appendChild(textArea);
                  textArea.select();
                  document.execCommand("copy");
                  document.body.removeChild(textArea);
                }
              }}
              className="btn-icon"
              title="Копировать"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button 
              onClick={() => handleExport('md')} 
              disabled={isExporting}
              className="btn-icon"
              title="Экспорт в Markdown"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </button>
            <button 
              onClick={() => handleExport('docx')} 
              disabled={isExporting}
              className="btn-icon"
              title="Экспорт в Word"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <line x1="10" y1="9" x2="8" y2="9"></line>
              </svg>
            </button>
            <button 
              onClick={() => handleExport('pdf')} 
              disabled={isExporting}
              className="btn-icon"
              title="Экспорт в PDF"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M9 15v-2h2c.6 0 1 .4 1 1v0c0 .6-.4 1-1 1H9z"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
