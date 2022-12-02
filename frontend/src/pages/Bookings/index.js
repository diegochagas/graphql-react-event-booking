import React, { useContext, useEffect, useState } from 'react';

import Chart from '../../components/Chart';
import BookingList from '../../components/Bookings/BookingList';
import Spinner from '../../components/Spinner';
import Tabs from '../../components/Tabs';
import Tab from '../../components/Tabs/Tab';
import AuthContext from '../../context/auth-context';
import useTabs from '../../hooks/useTabs';

function BookingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [bookings, setBookings] = useState([])
  const context = useContext(AuthContext)
  const { token } = context
  const labels = ["List", "Chat"]
  const { currentLabel, toggleLabel } = useTabs(labels[0])
  const BOOKINGS_BUCKETS = {
    Cheap: { min: 0, max: 100 },
    Normal: { min: 100, max: 200 },
    Expensive: { min: 200, max: 100000000 }
  }

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
                price
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

  const deleteBookingHandler = bookingId => {
    setIsLoading(true)
  
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
      }
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
      setBookings(bookings.filter(booking => booking._id !== bookingId))

      setIsLoading(false)
    }).catch(err => {
      console.log(err)

      setIsLoading(false)
    })
  }

  function getChartData() {
    const chartData = { labels: [], datasets: [] }
    let values = []

    for (const bucket in BOOKINGS_BUCKETS) {
      const filteredBookingsCount = bookings.reduce((prev, current) => {
        if (
          current.event.price > BOOKINGS_BUCKETS[bucket].min &&
          current.event.price < BOOKINGS_BUCKETS[bucket].max
        ) {
          return prev + 1
        } else return prev
      }, 0)

      values.push(filteredBookingsCount)

      chartData.labels.push(bucket)

      chartData.datasets.push({ data: values, backgroundColor: 'rgba(220, 220, 220, 0.5)' })

      values = [...values]
      
      values[values.length - 1] = 0
    }

    return chartData
  }

  return isLoading ? <Spinner /> : (
    <Tabs labels={labels} selectTab={toggleLabel} currentLabel={currentLabel}>
      <Tab isActive={currentLabel === labels[0]}>
        <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
      </Tab>
      <Tab isActive={currentLabel === labels[1]}>
        <Chart chartData={getChartData()} />
      </Tab>
    </Tabs>
  )
}

export default BookingsPage;