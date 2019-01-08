const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
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
