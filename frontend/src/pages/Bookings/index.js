import React, { useContext, useEffect, useState } from 'react';

import Spinner from '../../components/Spinner';
import AuthContext from '../../context/auth-context';
// import { Container } from './styles';

function BookingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [bookings, setBookings] = useState([])
  const context = useContext(AuthContext)
  const { token } = context

  useEffect(() => {
    const fetchBookings = () => {
      setIsLoading(true)
  
      const requestBody = {
        query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
              }
            }
          }
        `
      }
  
      fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        if (res.status !== 200 && res.status !== 201) throw new Error('Failed!')
  
        return res.json()
      }).then(resData => {
        setBookings(resData.data.bookings)
  
        setIsLoading(false)
      }).catch(err => {
        console.log(err)
  
        setIsLoading(false)
      })
    }

    fetchBookings()
  }, [token])

  return isLoading ? <Spinner /> : (
    <ul>
      {bookings.map(booking => (
        <li key={booking._id}>{booking.event.title} - {new Date(booking.createdAt).toLocaleDateString('en-GB')}</li>
      ))}
    </ul>
  )
}

export default BookingsPage;