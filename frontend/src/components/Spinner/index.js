import React from 'react';

import './index.css'

function Spinner() {
  return (
    <div className="spinner">
      <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </div>
  );
}

export default Spinner;