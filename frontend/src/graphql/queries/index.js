export const EVENTS = {
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

export const LOGIN = (email, password) => {
  return {
    query: `
      query Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          userId
          token
          tokenExpiration
        }
      }
    `,
    variables: {
      email,
      password
    }
  }
}

export const BOOKINGS = {
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