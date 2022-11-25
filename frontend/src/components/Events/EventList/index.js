import React from 'react';

import EventItem from './EventItem';
import './index.css'

const EventList = props => {
  const { events } = props
  
  return (
    <ul className="event__list">
      {events.map(event => (
        <EventItem key={event._id} event={event} userId={props.authUserId} onDetail={props.onViewDetail} />
      ))}
    </ul>
  );
}

export default EventList;