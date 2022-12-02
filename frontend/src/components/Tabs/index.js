import React from 'react';

import './index.css'

function Tabs({ labels, selectTab, currentLabel, children }) {
  return (
    <div className="tabs">
      {labels.map(label => (
        <button className={`btn-tab ${label === currentLabel ? 'active' : ''}`} key={label} onClick={() => selectTab(label)}>
          {label}
        </button>
      ))}

      {children}
    </div>
  );
}

export default Tabs;