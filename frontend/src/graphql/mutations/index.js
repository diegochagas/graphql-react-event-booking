export const CREATE_EVENT = (title, description, price, date) => {
  return {
    query: `
      mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!){
        createEvent(eventInput: { title: $title, description: $description, price: $price, date: $date }) {
          _id
          title
          price
          description
          date
        }
      }
    `,
    variables: {
      title,
      description,
      price,
      date
    }
  }
}

export const BOOK_EVENT = (selectedEventId) => {
  return {
    query: `
      mutation BookEvent($id: ID!) {
        bookEvent(eventId: $id) {
          _id
          createdAt
          updatedAt
        }
      }
    `, 
    variables: {
      id: selectedEventId
    }
  }
}

export const CREATE_USER = (email, password) => {
  return {
    query: `
      mutation CreateUser($email: String!, $password: String!) {
        createUser(userInput: { email: $email, password: $password }) {
          _id
          email
        }
      }
    `,
    variables: {
      email,
      password
    }
  }
}

export const CANCEL_BOOKING = bookingId => {
  return {
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
}