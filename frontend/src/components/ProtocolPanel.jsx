export default function ProtocolPanel({ 
  agenda, 
  onAgendaChange, 
  transcription, 
  isGeneratingProtocol, 
  onGenerateProtocol, 
  protocol 
}) {
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
          <h3>Протокол (Rick Sanchez Mode)</h3>
          <div className="protocol-box">
            <pre>{protocol}</pre>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(protocol)}
            className="btn-copy"
          >
            Копировать
          </button>
        </div>
      )}
    </div>
  );
}
