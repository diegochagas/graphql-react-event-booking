const Event = require('../../models/event');

const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
      try {
          const events = await Event.find();
  
          return events.map(event => transformEvent(event));
      } catch(err) {
          throw err;
      }
  },
  createEvent: async args => {
      try {
          const event = new Event ({
              title: args.eventInput.title,
              description: args.eventInput.description,
              price: +args.eventInput.price,
              date: new Date(args.eventInput.date),
              creator: '6038011f0eca5b2f504a1d1c'
          });
  
          let createdEvent;
  
          const result = await event.save()
  
          createdEvent = transformEvent(result);
  
          const creator = await User.findById('6038011f0eca5b2f504a1d1c');
              
          if (!creator) {
              throw new Error('User not found.');
          }
          
          creator.createdEvents.push(event);
          
          await creator.save();
          
          return createdEvent;
      } catch(err) {
          console.error(err);

          throw err;
      }
  }
};