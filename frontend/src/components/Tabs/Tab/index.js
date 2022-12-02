import React from 'react';

import './index.css'

function Tab({ isActive, children }) {
  return (
    <div className={`tab ${isActive ? 'active' : ''}`}>
      {children}
    </div>
  );
}

export default Tab;