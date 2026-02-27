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
            className="btn-copy"
          >
            Копировать
          </button>
          <div className="export-buttons">
            <button 
              onClick={() => handleExport('md')} 
              disabled={isExporting}
              className="btn-export"
            >
              .MD
            </button>
            <button 
              onClick={() => handleExport('docx')} 
              disabled={isExporting}
              className="btn-export"
            >
              .DOC
            </button>
            <button 
              onClick={() => handleExport('pdf')} 
              disabled={isExporting}
              className="btn-export"
            >
              .PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
