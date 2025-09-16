//ts-nocheck

import React, { useState } from 'react';

const AutomationContext = React.createContext();

const AutomationProvider = ({ children } : any) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState(null);

  return (
    <AutomationContext.Provider value={{ selectedAction, setSelectedAction, selectedReaction, setSelectedReaction }}>
      {children}
    </AutomationContext.Provider>
  );
};

export { AutomationProvider, AutomationContext };