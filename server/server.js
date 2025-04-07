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

const mysql = require('mysql2/promise'); 
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const initializePassport = require('./passport-config');


initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);


const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Mydatabase123456',
    database: process.env.DB_NAME || 'nodemysql',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database!');
        connection.release();
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
})();


app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Routes
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

        const [result] = await pool.query(
            `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [req.body.name, req.body.email, hashedPassword, role]
        );

        console.log("User registered:", result);
        res.redirect('/login');
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Registration failed");
    }
});

app.delete('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});


app.get('/admin', checkAdmin, (req, res) => {
    res.send('Welcome, Admin!');
});

app.post('/admin/add-item', checkAdmin, async (req, res) => {
    try {
        const [result] = await pool.query(
            `INSERT INTO items (name, price) VALUES (?, ?)`,
            [req.body.name, req.body.price]
        );
        res.send('Item added!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding item');
    }
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) return res.redirect('/');
    next();
}

function checkAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') return next();
    res.redirect('/');
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
