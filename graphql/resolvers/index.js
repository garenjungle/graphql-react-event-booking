const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: user.bind(this, event._doc.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        };
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
      createdEvent = {
        ...result._doc,
        _id: result.id,
        date: new Date(result._doc.date).toISOString(),
        creator: user.bind(this, result._doc.creator)
      };
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
  },
  createUser: async args => {
    const { email, password } = args.userInput;
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new Error('User exists already');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email: email,
        password: hashedPassword
      });
      const result = await user.save();
      return { ...result._doc, _id: result.id, password: null };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
