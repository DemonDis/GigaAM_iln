import React from 'react';
import { createContext, useContext, useState } from 'react';

import { QWEN_VL_235_MODEL_ID } from '../constants/config';


const ModelContext = createContext({});

export function ModelProvider({ children }) {
  const [selectedModel, setSelectedModel] = useState(QWEN_VL_235_MODEL_ID);

  return (
    <ModelContext.Provider value={{ selectedModel, setSelectedModel }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);

  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }

  return context;
}
