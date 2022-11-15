import React, { useState } from 'react';

import Modal from '../../components/Modal'

import './index.css'

function EventsPage() {
  const [creating, startCreateEventHandler] = useState(false)

  const modalConfirmHandler = () => {
    startCreateEventHandler(false)
  }

  const modalCancelHandler = () => {
    startCreateEventHandler(false)
  }

  return (
    <>
      {creating && (
        <Modal title="Add event" canCancel canConfirm onCancel={modalCancelHandler} onConfirm={modalConfirmHandler}>
          <p>Modal content</p>
        </Modal>
      )}
      <div className="events-control">
        <p>Share your own Events!</p>
        <button className="btn" onClick={() => startCreateEventHandler(true)}>Create Event</button>
      </div>
    </>
  );
}

export default EventsPage;