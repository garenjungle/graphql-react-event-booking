const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return transformEvent(event);
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createEvent: async args => {
    const { title, description, price } = args.eventInput;
    const event = new Event({
      title: title,
      description: description,
      price: +price,
      date: new Date(),
      creator: '5c2e360a0483660bec4beda5'
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById('5c2e360a0483660bec4beda5');
      if (!creator) {
        throw new Error('User not found');
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
