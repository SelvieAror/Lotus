
// const bcrypt = require('bcrypt');
// const LocalStrategy = require('passport-local').Strategy;

// function initialize(passport, getUserByEmail, getUserById) {
//     const authenticateUser = async (email, password, done) => {
//         const user = getUserByEmail(email);
//         if (user == null) {
//             return done(null, false, { message: 'No user with this email' });
//         }

//         try {
//             if (await bcrypt.compare(password, user.password)) {
//                 return done(null, user);
//             } else {
//                 return done(null, false, { message: 'Password incorrect' });
//             }
//         } catch (e) {
//             return done(e);
//         }
//     }

//     passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

//     passport.serializeUser((user, done) => done(null, user.id))

//     passport.deserializeUser((id, done) => {return done(null, getUserById(id))})
// }

// module.exports = initialize;


const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, db) {
  const getUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  };

  const getUserById = async (id) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  };

  const authenticateUser = async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'No user with this email' });
      }
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (err) {
      return done(err);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  });
}

module.exports = initialize;

