import React from 'react'

import './index.css'

const EventItem = props => {  
  const { event } = props

  return (
    <li className="event__list-item">
      <div>
        <h1>{event.title}</h1>

        <h2>${event.price.toFixed(2)} - {new Date(event.date).toLocaleDateString('en-GB')}</h2>
      </div>

      <div>
        {props.userId === event.creator._id ? <p>Your the owner of this event.</p> : (
          <button className="btn" onClick={() => props.onDetail(event._id)}>View details</button>
        )}
      </div>
    </li>
  );
}

export default EventItem;