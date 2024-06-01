import passport from "passport";

import { Strategy } from "passport-local";
// import { mockUsers } from "../utilis/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassword } from "../utilis/helpers.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User not found!");
      if (!comparePassword(password, findUser.password))
        throw new Error("Bad credentials!");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
