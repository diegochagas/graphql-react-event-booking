import React, { useContext, useEffect, useRef, useState } from 'react';



import Modal from '../../components/Modal'
import AuthContext from '../../context/auth-context';

import './index.css'

function EventsPage() {
  const [creating, startCreateEventHandler] = useState(false)
  const [events, setEvents] = useState([])
  const titleElRef = useRef('')
  const priceElRef = useRef(0)
  const dateElRef = useRef('')
  const descriptionElRef = useRef('')
  const contextType = useContext(AuthContext)
  const { token } = contextType

  useEffect(() => {
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
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) throw new Error('Failed!')

      return res.json()
    }).then(resData => {
      fetchEvents()
    }).catch(err => {
      console.log(err)
    })
  }

  const modalCancelHandler = () => {
    startCreateEventHandler(false)
  }

  function fetchEvents() {
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
      const eventsData = resData.data.events

      setEvents(eventsData)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <>
      {creating && (
        <Modal title="Add event" canCancel canConfirm onCancel={modalCancelHandler} onConfirm={modalConfirmHandler}>
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

      {token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={() => startCreateEventHandler(true)}>Create Event</button>
        </div>
      )}

      <ul className="events__list">
        {events.map(event => (
          <li key={event._id} className="events__list-item">{event.title}</li>
        ))}
      </ul>
    </>
  );
}

export default EventsPage;