import { QWEN_TEXT_MODEL_ID, DEFAULT_MODEL_ID, QWEN_VL_MODEL_ID, QWEN_VL_235_MODEL_ID } from '../constants/config';

const MODEL_OPTIONS = [
  {
    id: DEFAULT_MODEL_ID,
    label: 'API cloud',
    description: 'Внешняя, платная модель'
  },
  {
    id: QWEN_TEXT_MODEL_ID,
    label: 'Qwen3 32B AWQ',
    description: 'Внутреняя модель'
  },
  {
    id: QWEN_VL_235_MODEL_ID,
    label: 'Qwen3 VL-235B A22B Instruct FP8',
    description: 'Внутреняя модель'
  },
  // {
  //   id: QWEN_VL_MODEL_ID,
  //   label: 'Qwen3 V1 2B instruct',
  //   description: 'Внутреняя модель'
  // }
];

export default function ModelSelector({ value, onChange }) {
  return (
    <div className="model-selector">
      <label className="model-selector__label">Модель генерации:</label>
      <div className="model-selector__options">
        {MODEL_OPTIONS.map((option) => (
          <label key={option.id} className={`model-option ${value === option.id ? 'selected' : ''}`}>
            <input
              type="radio"
              name="model"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <div>
              <div className="model-option__title">{option.label}</div>
              <div className="model-option__description">{option.description}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
