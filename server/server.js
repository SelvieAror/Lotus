// if (process.env.NODE_ENV !== 'production'){
//     require('dotenv').config()
// }

// const mysql = require('mysql2');
// const express = require('express')
// const app = express()
// const ejs = require('ejs')
// const bcrypt = require('bcrypt')
// const passport = require('passport')
// const flash = require('express-flash')
// const session = require('express-session')
// const initializePassport = require('./passport-config')
// const methodOverride = require ('method-override')
// const path = require('path')


//  initializePassport(passport, 
//      email => users.find(user => user.email === email),
//     id => users.find(user => user.id === id)
//  )
 


//  app.use(express.static(path.join(__dirname, "../frontend/dist")));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
// });

// const PORT = process.env.PORT || 5000;





// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Mydatabase123456',
// })

// app.get('/createdb', (req, res) => {
//     let sql = 'CREATE DATABASE nodemysql'
//     db.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log(result)
//         res.send('database created')
//     })
// })

// db.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });




// app.set('view engine', 'ejs')
// app.use(express.urlencoded({extended: false}))
// app.use(flash())
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }))
// app.use(passport.initialize())
// app.use(passport.session())
// app.use(methodOverride('_method'))

// app.get('/', (req, res) => {
//     res.render('index.ejs', { name: req.user ? req.user.name : 'Guest' });

// })

// app.get('./pages/login', (req, res) => {
//     res.render('login.ejs')
// })
// app.post('./pages/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: './pages/login',
//     failureFlash: true
// }))

// app.get('./pages/signup', (req, res) => {
//     res.render('register.ejs')
// })

// app.post('./pages/signup', async (req, res) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         const role = req.body.role || 'user'

//         const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`
        
//         db.query(sql, [req.body.name, req.body.email, hashedPassword, role], (err, result) => {
//             if (err) {
//                 console.error("Database error:", err)
//                 return res.status(500).send("Error registering user");
//             }
//             console.log("User registered:", result)
//             res.redirect('/login')
//         })

//     } catch (error) {
//         console.error("Server error:", error);
//         res.status(500).send("Server error occurred");
//     }
// });


// app.delete('/logout', (req, res) => {
//     req.logout()
//     res.redirect('./pages/login')
// })

// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()){
//         return next()
//     }
//     res.redirect('./pages/login')
// }

// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()){
//        return res.redirect('/')
//     }
//     next()
// }

// function checkAdmin(req, res, next) {
//     if (req.isAuthenticated() && req.user.role === 'admin') {
//         return next()
//     }
//     res.redirect('/')
// }

// app.get('/admin', checkAdmin, (req, res) => {
//     res.send('Welcome, Admin!')
// })

// app.post('/admin/add-item', checkAdmin, (req, res) => {
//     const sql = `INSERT INTO items (name, price) VALUES (?, ?)`
//     db.query(sql, [req.body.name, req.body.price], (err, result) => {
//         if (err) throw err
//         res.send('Item added!')
//     })
// })


// app.listen(3000)

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const initializePassport = require('./passport-config');
const db = require('./databases')


const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Could not connect to SQLite database', err);
        process.exit(1);
    } else {
        console.log('Connected to SQLite database.');
    }
});
initializePassport(passport, db);


db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
    )`);

    // Create items table 
    db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        imagePath TEXT  
    )`, (err) => {
        if (err) {
            console.error("Error creating items table:", err.message);
        } else {
            console.log("Items table is ready.");
        }
    });
});



function getUserByEmail(email, done) {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) return done(err);
        return done(null, row);
    });
}

function getUserById(id, done) {
    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) return done(err);
        return done(null, row);
    });
}

initializePassport(
    passport,
    
    (email, done) => {
        getUserByEmail(email, (err, user) => {
            if (err) return done(err);
            return done(null, user);
        });
    },
    (id, done) => {
        getUserById(id, (err, user) => {
            if (err) return done(err);
            return done(null, user);
        });
    }
);

app.use(express.static(path.join(__dirname, "../Frontend/dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));


//Guest option 
app.get('/', (req, res) => {
    res.render('index.ejs', { name: req.user ? req.user.name : 'Guest' });
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/signup', (req, res) => {
    res.render('register.ejs');
});

app.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const role = req.body.role || 'user';

        db.run(
            `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [req.body.name, req.body.email, hashedPassword, role],
            function(err) {
                if (err) {
                    console.error("Error inserting user:", err);
                    return res.status(500).send("Registration failed");
                }
                console.log("User registered with ID:", this.lastID);
                res.redirect('/login');
            }
        );
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Registration failed");
    }
});

app.delete('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') return next();
    res.redirect('/');
}

app.get('/admin', checkAdmin, (req, res) => {
    res.send('Welcome, Admin!');
});

app.post('/admin/add-item', checkAdmin, (req, res) => {
    const { name, price, description, imagePath } = req.body;
    db.run(
      `INSERT INTO items (name, price, description) VALUES (?, ?, ?, ?)`,
      [name, price, description, imagePath],
      function (err) {
        if (err) {
          console.error("Error adding item:", err.message);
          return res.status(500).send('Error adding item.');
        }
        res.send('Item added successfully!');
      }
    );
  });

  
  app.delete('/admin/delete-item/:id', checkAdmin, (req, res) => {
    const { id } = req.params;
    db.run(
      `DELETE FROM items WHERE id = ?`,
      [id],
      function (err) {
        if (err) {
          console.error("Error deleting item:", err.message);
          return res.status(500).send('Error deleting item.');
        }
        if (this.changes === 0) {
          return res.status(404).send('Item not found.');
        }
        res.send('Item deleted successfully!');
      }
    );
  });
  


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/dist", "index.html"));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



// const multer = require('multer');
// const path = require('path');

// // Configure Multer storage
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'public/uploads/'); // Directory for uploaded images
//   },
//   filename: function(req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname); // Unique filename
//   }
// });
// const upload = multer({ storage });

// // Admin route to add an item with image upload
// app.post('/admin/add-item', checkAdmin, upload.single('image'), (req, res) => {
//     // req.body contains the text fields: name, price, description
//     // req.file contains the uploaded image info
//     const { name, price, description } = req.body;
//     const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  
//     db.run(
//       `INSERT INTO items (name, price, description) VALUES (?, ?, ?)`,
//       [name, price, description],
//       function(err) {
//           if (err) {
//               console.error("Error adding item:", err.message);
//               return res.status(500).send('Error adding item.');
//           }
//           // Optionally, update the item record with the imagePath if needed,
//           // or have the table include an image column from the start.
//           res.send('Item added successfully!');
//       }
//     );
// });

