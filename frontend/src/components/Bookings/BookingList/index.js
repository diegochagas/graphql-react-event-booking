import React from 'react';

import './index.css'

function BookingList(props) {
  return (
    <ul className="bookings__list">
      {props.bookings.map(booking => (
        <li key={booking._id} className="bookings__item">
          <div className="bookings__item-data">
            {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString('en-GB')}
          </div>

          <div className="bookings__item-actions" onClick={() => props.onDelete(booking._id)}>
            <button className="btn btn-cancel">Cancel</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default BookingList;