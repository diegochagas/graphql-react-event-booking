import React, { useContext, useEffect, useRef, useState } from 'react';

import EventList from '../../components/Events/EventList';
import Modal from '../../components/Modal'
import Spinner from '../../components/Spinner'
import AuthContext from '../../context/auth-context';

import './index.css'

function EventsPage() {
  const [creating, startCreateEventHandler] = useState(false)
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const titleElRef = useRef('')
  const priceElRef = useRef(0)
  const dateElRef = useRef('')
  const descriptionElRef = useRef('')
  const context = useContext(AuthContext)
  const { token } = context

  useEffect(() => {
    function fetchEvents() {
      setIsLoading(true)

      const requestBody = {
        query: `
          query {
            events {
              _id
              title
              price
              description
              date
              creator {
                _id
                email
              }
            }
          }
        `
      }

      fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.status !== 200 && res.status !== 201) throw new Error('Failed!')

        return res.json()
      }).then(resData => {
        setEvents(resData.data.events)

        setIsLoading(false)
      }).catch(err => {
        console.log(err)

        setIsLoading(false)
      })
    }
    
    fetchEvents()
  }, [])

  const modalConfirmHandler = () => {
    startCreateEventHandler(false)

    const title = titleElRef.current.value
    const price = +priceElRef.current.value
    const date = dateElRef.current.value
    const description = descriptionElRef.current.value

    if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
      return
    }

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: { title: "${title}", description: "${description}", price: ${price}, date: "${date}" }) {
            _id
            title
            price
            description
            date
          }
        }
      `
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) throw new Error('Failed!')

      return res.json()
    }).then(resData => {
      setEvents([...events, {
        _id: resData.data.createEvent._id,
        title: resData.data.createEvent.title,
        price: resData.data.createEvent.price,
        description: resData.data.createEvent.description,
        date: resData.data.createEvent.date,
        creator: {
          _id: context.userId
        }
      }])
    }).catch(err => {
      console.log(err)
    })
  }

  const modalCancelHandler = () => {
    startCreateEventHandler(false)

    setSelectedEvent(null)
  }

  const showDetailHandler = eventId => {
    setSelectedEvent(events.find(event => event._id === eventId))
  }

  const bookEventHandler = () => {
    if (!token) {
      setSelectedEvent(null)

      return
    }

    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${selectedEvent._id}") {
            _id
            createdAt
            updatedAt
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
      setSelectedEvent(null)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <>
      {creating && (
        <Modal
          title="Add event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>

              <input type="text" id="title" ref={titleElRef} />
            </div>

            <div className="form-control">
              <label htmlFor="price">Price</label>

              <input type="number" id="price" ref={priceElRef} />
            </div>

            <div className="form-control">
              <label htmlFor="date">date</label>

              <input type="datetime-local" id="date" ref={dateElRef} />
            </div>

            <div className="form-control">
              <label htmlFor="description">Description</label>

              <textarea rows="4" id="description" ref={descriptionElRef} />
            </div>
          </form>
        </Modal>
      )}

      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={token ? 'Book' : 'Confirm'}
        >
          <h1>{selectedEvent.title}</h1>

          <h2>${selectedEvent.price.toFixed(2)} - {new Date(selectedEvent.date).toLocaleDateString('en-GB')}</h2>

          <p>{selectedEvent.description}</p>
        </Modal>
      )}

      {token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={() => startCreateEventHandler(true)}>Create Event</button>
        </div>
      )}

      {isLoading ? <Spinner /> : (
        <EventList events={events} authUserId={context.userId} onViewDetail={showDetailHandler} />
      )}
    </>
  );
}

export default EventsPage;