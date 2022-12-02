import { useState } from 'react';

function useTabs(startingLabel) {
  const [currentLabel, setLabel] = useState(startingLabel)
  
  const toggleLabel = label => setLabel(label)

  return { currentLabel, toggleLabel }
}

export default useTabs;