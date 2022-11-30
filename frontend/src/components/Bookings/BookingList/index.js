import React from 'react';

import './index.css'

function BookingList(props) {
  const { bookings } = props

  return (
    <ul className="bookings__list">
      {bookings.length > 0 ? 
        bookings.map(booking => (
          <li key={booking._id} className="bookings__item">
            <div className="bookings__item-data">
              {booking.event.title} - {new Date(booking.createdAt).toLocaleDateString('en-GB')}
            </div>

            <div className="bookings__item-actions" onClick={() => props.onDelete(booking._id)}>
              <button className="btn btn-cancel">Cancel</button>
            </div>
          </li>
        )) : (
          <li className="bookings__item empty-bookings">
            No bookings made yet.
          </li>
        )
      }
    </ul>
  );
}

export default BookingList;