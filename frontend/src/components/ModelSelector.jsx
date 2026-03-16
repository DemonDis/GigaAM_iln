import { useState, useEffect, useRef } from 'react';
import { BACKEND_URL, QWEN_TEXT_MODEL_ID, DEFAULT_MODEL_ID, QWEN_VL_MODEL_ID, QWEN_VL_235_MODEL_ID } from '../constants/config';

const STATIC_MODEL_OPTIONS = [
  {
    id: QWEN_VL_235_MODEL_ID,
    label: 'Qwen3-VL-235B-A22B-Instruct-FP8',
    description: 'Внутренняя модель'
  },
  {
    id: DEFAULT_MODEL_ID,
    label: 'API cloud',
    description: 'Внешняя, платная модель'
  },
];

export default function ModelSelector({ value, onChange }) {
  const [models, setModels] = useState(STATIC_MODEL_OPTIONS);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/models`)
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          const apiModels = data.data.map(m => ({
            id: m.id,
            label: m.id,
            description: 'API модель'
          }));
          setModels([...STATIC_MODEL_OPTIONS, ...apiModels]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedModel = models.find(m => m.id === value);
  const filteredModels = models.filter(m => 
    m.label.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="model-selector">
      <label className="model-selector__label">Модель генерации:</label>
      <div className="combobox" ref={wrapperRef}>
        <button
          type="button"
          className="combobox__trigger"
          onClick={() => !loading && setIsOpen(!isOpen)}
          disabled={loading}
        >
          <span className="combobox__selected">
            {selectedModel ? selectedModel.label : 'Выберите модель'}
          </span>
          <span className="combobox__arrow">{isOpen ? '▲' : '▼'}</span>
        </button>
        
        {isOpen && (
          <div className="combobox__dropdown">
            <input
              type="text"
              className="combobox__search"
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <div className="combobox__list">
              {filteredModels.length === 0 ? (
                <div className="combobox__empty">Ничего не найдено</div>
              ) : (
                filteredModels.map((option) => (
                  <div
                    key={option.id}
                    className={`combobox__option ${value === option.id ? 'selected' : ''}`}
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                      setSearch('');
                    }}
                  >
                    <div className="combobox__option-label">{option.label}</div>
                    <div className="combobox__option-desc">{option.description}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
